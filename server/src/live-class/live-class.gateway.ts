import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import {
  Logger,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import {
  Server,
  Socket,
} from 'socket.io';

// ======================================================
// AUTHENTICATED SOCKET
// ======================================================

interface AuthenticatedSocket extends Socket {
  user?: {
    id: number;
    role: string;
    email?: string;
  };

  liveClassId?: number;
}

// ======================================================
// PAYLOAD TYPES
// ======================================================

interface LiveClassPayload {
  liveClassId: number;
}

interface WebRTCOfferPayload {
  liveClassId: number;
  targetSocketId: string;
  offer: RTCSessionDescriptionInit;
}

interface WebRTCAnswerPayload {
  liveClassId: number;
  targetSocketId: string;
  answer: RTCSessionDescriptionInit;
}

interface WebRTCIcePayload {
  liveClassId: number;
  targetSocketId: string;
  candidate: RTCIceCandidateInit;
}

// ======================================================
// GATEWAY
// ======================================================

@WebSocketGateway({
  namespace: '/',
  cors: {
    origin:
      process.env.FRONTEND_URL ||
      'http://localhost:5173',

    credentials: true,
  },
})
export class LiveClassGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect
{
  private readonly logger =
    new Logger(LiveClassGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  // ====================================================
  // SOCKET CONNECTION
  // ====================================================

  async handleConnection(
    socket: AuthenticatedSocket,
  ): Promise<void> {
    try {
      // ------------------------------------------------
      // Get token
      // ------------------------------------------------

      const token =
        socket.handshake.auth?.token;

      if (!token) {
        this.logger.warn(
          `Socket rejected: JWT token missing - ${socket.id}`,
        );

        socket.emit(
          'socket-auth-error',
          {
            message:
              'Authentication token is missing.',
          },
        );

        socket.disconnect(true);

        return;
      }

      // ------------------------------------------------
      // Verify JWT
      // ------------------------------------------------

      const payload =
        await this.jwtService.verifyAsync(token);

      // ------------------------------------------------
      // Validate user id
      // ------------------------------------------------

      if (!payload?.sub) {
        this.logger.warn(
          `Socket rejected: Invalid JWT payload - ${socket.id}`,
        );

        socket.emit(
          'socket-auth-error',
          {
            message:
              'Invalid authentication token.',
          },
        );

        socket.disconnect(true);

        return;
      }

      // ------------------------------------------------
      // Attach user to socket
      // ------------------------------------------------

      socket.user = {
        id: Number(payload.sub),
        role: payload.role,
        email: payload.email,
      };

      // ------------------------------------------------
      // Connection success
      // ------------------------------------------------

      this.logger.log(
        `Live Class Socket Connected: ${socket.id}`,
      );

      this.logger.log(
        `User ${socket.user.id} connected | Role: ${socket.user.role}`,
      );

      // ------------------------------------------------
      // Send authentication success
      // ------------------------------------------------

      socket.emit(
        'socket-authenticated',
        {
          socketId: socket.id,
          userId: socket.user.id,
          role: socket.user.role,
        },
      );
    } catch (error: unknown) {
      // =================================================
      // IMPORTANT:
      // TypeScript safe error handling
      // =================================================

      let message =
        'Socket authentication failed.';

      if (error instanceof Error) {
        message = error.message;
      }

      this.logger.warn(
        `WebSocket access token rejected: ${message}`,
      );

      socket.emit(
        'socket-auth-error',
        {
          message,
        },
      );

      socket.disconnect(true);
    }
  }

  // ====================================================
  // SOCKET DISCONNECT
  // ====================================================

  handleDisconnect(
    socket: AuthenticatedSocket,
  ): void {
    const userId =
      socket.user?.id;

    const liveClassId =
      socket.liveClassId;

    // --------------------------------------------------
    // Notify room before leaving
    // --------------------------------------------------

    if (
      liveClassId &&
      userId
    ) {
      const room =
        this.getRoomName(liveClassId);

      socket.to(room).emit(
        'participant-left',
        {
          userId,
          socketId: socket.id,
        },
      );

      this.logger.log(
        `User ${userId} disconnected from ${room}`,
      );
    }

    socket.liveClassId =
      undefined;

    this.logger.log(
      `Live Class Socket Disconnected: ${socket.id}`,
    );
  }

  // ====================================================
  // JOIN LIVE CLASS
  // ====================================================

  @SubscribeMessage('join-live-class')
  handleJoinLiveClass(
    @MessageBody()
    data: LiveClassPayload,

    @ConnectedSocket()
    socket: AuthenticatedSocket,
  ): void {
    // --------------------------------------------------
    // Authentication check
    // --------------------------------------------------

    if (!socket.user) {
      socket.emit(
        'socket-auth-error',
        {
          message:
            'Socket is not authenticated.',
        },
      );

      return;
    }

    // --------------------------------------------------
    // Validate live class id
    // --------------------------------------------------

    const liveClassId =
      Number(data?.liveClassId);

    if (
      !Number.isInteger(liveClassId) ||
      liveClassId <= 0
    ) {
      socket.emit(
        'live-class-error',
        {
          message:
            'Invalid live class ID.',
        },
      );

      return;
    }

    // --------------------------------------------------
    // If already joined another class,
    // leave previous room first.
    // --------------------------------------------------

    if (
      socket.liveClassId &&
      socket.liveClassId !== liveClassId
    ) {
      const previousRoom =
        this.getRoomName(
          socket.liveClassId,
        );

      socket.leave(previousRoom);

      socket.to(previousRoom).emit(
        'participant-left',
        {
          userId:
            socket.user.id,
          socketId:
            socket.id,
        },
      );
    }

    // --------------------------------------------------
    // Room
    // --------------------------------------------------

    const room =
      this.getRoomName(liveClassId);

    // --------------------------------------------------
    // Join room
    // --------------------------------------------------

    socket.join(room);

    socket.liveClassId =
      liveClassId;

    this.logger.log(
      `User ${socket.user.id} joined ${room}`,
    );

    // --------------------------------------------------
    // Get existing sockets
    // --------------------------------------------------

    const roomSockets =
      this.server
        .sockets
        .adapter
        .rooms
        .get(room);

    const participants =
      roomSockets
        ? Array.from(roomSockets)
            .filter(
              (socketId) =>
                socketId !== socket.id,
            )
            .map((socketId) => {
              const participant =
                this.server.sockets.sockets.get(
                  socketId,
                ) as
                  | AuthenticatedSocket
                  | undefined;

              return {
                socketId,
                userId:
                  participant?.user?.id,
                role:
                  participant?.user?.role,
              };
            })
        : [];

    // --------------------------------------------------
    // Notify existing participants
    // --------------------------------------------------

    socket.to(room).emit(
      'participant-joined',
      {
        userId:
          socket.user.id,

        role:
          socket.user.role,

        socketId:
          socket.id,
      },
    );

    // --------------------------------------------------
    // Confirm current user
    // --------------------------------------------------

    socket.emit(
      'joined-live-class',
      {
        liveClassId,
        room,
        socketId:
          socket.id,

        userId:
          socket.user.id,

        role:
          socket.user.role,

        participants,
      },
    );
  }

  // ====================================================
  // LEAVE LIVE CLASS
  // ====================================================

  @SubscribeMessage('leave-live-class')
  handleLeaveLiveClass(
    @MessageBody()
    data: LiveClassPayload,

    @ConnectedSocket()
    socket: AuthenticatedSocket,
  ): void {
    if (!socket.user) {
      return;
    }

    const liveClassId =
      Number(data?.liveClassId);

    if (
      !Number.isInteger(liveClassId) ||
      liveClassId <= 0
    ) {
      return;
    }

    const room =
      this.getRoomName(liveClassId);

    // --------------------------------------------------
    // Leave room
    // --------------------------------------------------

    socket.leave(room);

    // --------------------------------------------------
    // Clear current live class
    // --------------------------------------------------

    if (
      socket.liveClassId ===
      liveClassId
    ) {
      socket.liveClassId =
        undefined;
    }

    // --------------------------------------------------
    // Notify other participants
    // --------------------------------------------------

    socket.to(room).emit(
      'participant-left',
      {
        userId:
          socket.user.id,

        socketId:
          socket.id,
      },
    );

    this.logger.log(
      `User ${socket.user.id} left ${room}`,
    );
  }

  // ====================================================
  // WEBRTC OFFER
  // ====================================================

  @SubscribeMessage('webrtc-offer')
  handleOffer(
    @MessageBody()
    data: WebRTCOfferPayload,

    @ConnectedSocket()
    socket: AuthenticatedSocket,
  ): void {
    // --------------------------------------------------
    // Authentication
    // --------------------------------------------------

    if (!socket.user) {
      return;
    }

    // --------------------------------------------------
    // Validate live class
    // --------------------------------------------------

    const liveClassId =
      Number(data?.liveClassId);

    if (
      !socket.liveClassId ||
      socket.liveClassId !==
        liveClassId
    ) {
      return;
    }

    // --------------------------------------------------
    // Validate payload
    // --------------------------------------------------

    if (
      !data?.targetSocketId ||
      !data?.offer
    ) {
      return;
    }

    // --------------------------------------------------
    // Make sure target belongs to same room
    // --------------------------------------------------

    if (
      !this.isSocketInLiveClass(
        data.targetSocketId,
        liveClassId,
      )
    ) {
      return;
    }

    // --------------------------------------------------
    // Send offer
    // --------------------------------------------------

    this.server
      .to(data.targetSocketId)
      .emit(
        'webrtc-offer',
        {
          senderSocketId:
            socket.id,

          senderUserId:
            socket.user.id,

          senderRole:
            socket.user.role,

          liveClassId,

          offer:
            data.offer,
        },
      );
  }

  // ====================================================
  // WEBRTC ANSWER
  // ====================================================

  @SubscribeMessage('webrtc-answer')
  handleAnswer(
    @MessageBody()
    data: WebRTCAnswerPayload,

    @ConnectedSocket()
    socket: AuthenticatedSocket,
  ): void {
    // --------------------------------------------------
    // Authentication
    // --------------------------------------------------

    if (!socket.user) {
      return;
    }

    // --------------------------------------------------
    // Validate live class
    // --------------------------------------------------

    const liveClassId =
      Number(data?.liveClassId);

    if (
      !socket.liveClassId ||
      socket.liveClassId !==
        liveClassId
    ) {
      return;
    }

    // --------------------------------------------------
    // Validate payload
    // --------------------------------------------------

    if (
      !data?.targetSocketId ||
      !data?.answer
    ) {
      return;
    }

    // --------------------------------------------------
    // Validate target
    // --------------------------------------------------

    if (
      !this.isSocketInLiveClass(
        data.targetSocketId,
        liveClassId,
      )
    ) {
      return;
    }

    // --------------------------------------------------
    // Send answer
    // --------------------------------------------------

    this.server
      .to(data.targetSocketId)
      .emit(
        'webrtc-answer',
        {
          senderSocketId:
            socket.id,

          senderUserId:
            socket.user.id,

          senderRole:
            socket.user.role,

          liveClassId,

          answer:
            data.answer,
        },
      );
  }

  // ====================================================
  // ICE CANDIDATE
  // ====================================================

  @SubscribeMessage(
    'webrtc-ice-candidate',
  )
  handleIceCandidate(
    @MessageBody()
    data: WebRTCIcePayload,

    @ConnectedSocket()
    socket: AuthenticatedSocket,
  ): void {
    // --------------------------------------------------
    // Authentication
    // --------------------------------------------------

    if (!socket.user) {
      return;
    }

    // --------------------------------------------------
    // Validate live class
    // --------------------------------------------------

    const liveClassId =
      Number(data?.liveClassId);

    if (
      !socket.liveClassId ||
      socket.liveClassId !==
        liveClassId
    ) {
      return;
    }

    // --------------------------------------------------
    // Validate payload
    // --------------------------------------------------

    if (
      !data?.targetSocketId ||
      !data?.candidate
    ) {
      return;
    }

    // --------------------------------------------------
    // Validate target
    // --------------------------------------------------

    if (
      !this.isSocketInLiveClass(
        data.targetSocketId,
        liveClassId,
      )
    ) {
      return;
    }

    // --------------------------------------------------
    // Send ICE candidate
    // --------------------------------------------------

    this.server
      .to(data.targetSocketId)
      .emit(
        'webrtc-ice-candidate',
        {
          senderSocketId:
            socket.id,

          senderUserId:
            socket.user.id,

          senderRole:
            socket.user.role,

          liveClassId,

          candidate:
            data.candidate,
        },
      );
  }

  // ====================================================
  // HELPER - ROOM NAME
  // ====================================================

  private getRoomName(
    liveClassId: number,
  ): string {
    return `live-class-${liveClassId}`;
  }

  // ====================================================
  // HELPER - CHECK SOCKET IN ROOM
  // ====================================================

  private isSocketInLiveClass(
    socketId: string,
    liveClassId: number,
  ): boolean {
    const targetSocket =
      this.server.sockets.sockets.get(
        socketId,
      );

    if (!targetSocket) {
      return false;
    }

    const room =
      this.getRoomName(liveClassId);

    return targetSocket.rooms.has(
      room,
    );
  }
}