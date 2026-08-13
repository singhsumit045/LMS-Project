import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Server, Socket } from 'socket.io';

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
  liveClassId: number | string;
}

interface WebRTCOfferPayload {
  liveClassId: number | string;
  targetSocketId: string;
  offer: RTCSessionDescriptionInit;
}

interface WebRTCAnswerPayload {
  liveClassId: number | string;
  targetSocketId: string;
  answer: RTCSessionDescriptionInit;
}

interface WebRTCIcePayload {
  liveClassId: number | string;
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
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(
    LiveClassGateway.name,
  );
  
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
      // GET TOKEN
      // Accept BOTH token and access_token
      // ------------------------------------------------

      const token =
        socket.handshake.auth?.token ||
        socket.handshake.auth?.access_token;

      if (!token) {
        this.logger.warn(
          `Socket rejected: JWT token missing - ${socket.id}`,
        );

        socket.emit('socket-auth-error', {
          message:
            'Authentication token is missing.',
        });

        socket.disconnect(true);

        return;
      }

      // ------------------------------------------------
      // VERIFY JWT
      // ------------------------------------------------

      const payload =
        await this.jwtService.verifyAsync(token);

      // ------------------------------------------------
      // VALIDATE JWT PAYLOAD
      // ------------------------------------------------

      if (!payload?.sub) {
        this.logger.warn(
          `Socket rejected: Invalid JWT payload - ${socket.id}`,
        );

        socket.emit('socket-auth-error', {
          message:
            'Invalid authentication token.',
        });

        socket.disconnect(true);

        return;
      }
      
      // ------------------------------------------------
      // ATTACH USER
      // ------------------------------------------------

      socket.user = {
        id: Number(payload.sub),
        role: payload.role || 'student',
        email: payload.email,
      };

      // ------------------------------------------------
      // LOG
      // ------------------------------------------------

      this.logger.log(
        `Live Class Socket Connected: ${socket.id}`,
      );

      this.logger.log(
        `User ${socket.user.id} connected | Role: ${socket.user.role}`,
      );

      // ------------------------------------------------
      // AUTH SUCCESS
      // ------------------------------------------------

      socket.emit('socket-authenticated', {
        socketId: socket.id,
        userId: socket.user.id,
        role: socket.user.role,
      });
    } catch (error: unknown) {
      let message =
        'Socket authentication failed.';

      if (error instanceof Error) {
        message = error.message;
      }

      this.logger.warn(
        `WebSocket access token rejected: ${message}`,
      );

      socket.emit('socket-auth-error', {
        message,
      });

      socket.disconnect(true);
    }
  }

  // ====================================================
  // SOCKET DISCONNECT
  // ====================================================

  handleDisconnect(
    socket: AuthenticatedSocket,
  ): void {
    const userId = socket.user?.id;

    const liveClassId =
      socket.liveClassId;

    // --------------------------------------------------
    // NOTIFY ROOM
    // --------------------------------------------------

    if (liveClassId && userId) {
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
    // AUTHENTICATION
    // --------------------------------------------------

    if (!socket.user) {
      socket.emit('socket-auth-error', {
        message:
          'Socket is not authenticated.',
      });

      return;
    }

    // --------------------------------------------------
    // VALIDATE LIVE CLASS ID
    // --------------------------------------------------

    const liveClassId =
      Number(data?.liveClassId);

    if (
      !Number.isInteger(liveClassId) ||
      liveClassId <= 0
    ) {
      socket.emit('live-class-error', {
        message:
          'Invalid live class ID.',
      });

      this.logger.warn(
        `Invalid live class ID received from ${socket.id}: ${data?.liveClassId}`,
      );

      return;
    }

    // --------------------------------------------------
    // LEAVE PREVIOUS ROOM
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

      socket
        .to(previousRoom)
        .emit(
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
    // ROOM NAME
    // --------------------------------------------------

    const room =
      this.getRoomName(liveClassId);

    // --------------------------------------------------
    // JOIN ROOM
    // --------------------------------------------------

    socket.join(room);

    socket.liveClassId =
      liveClassId;

    this.logger.log(
      `User ${socket.user.id} joined ${room}`,
    );

    // --------------------------------------------------
    // GET ROOM SOCKETS SAFELY
    // --------------------------------------------------

    const roomSockets =
      this.server?.sockets?.adapter?.rooms?.get(
        room,
      );

    // --------------------------------------------------
    // EXISTING PARTICIPANTS
    // --------------------------------------------------

    const participants =
      roomSockets
        ? Array.from(roomSockets)
            .filter(
              (socketId) =>
                socketId !== socket.id,
            )
            .map((socketId) => {
              const participant =
                this.server?.sockets?.sockets?.get(
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
    // NOTIFY EXISTING PARTICIPANTS
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
    // CONFIRM JOIN
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

    this.logger.log(
      `User ${socket.user.id} successfully joined ${room}. Participants: ${participants.length}`,
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
    // LEAVE ROOM
    // --------------------------------------------------

    socket.leave(room);

    // --------------------------------------------------
    // CLEAR CLASS
    // --------------------------------------------------

    if (
      socket.liveClassId ===
      liveClassId
    ) {
      socket.liveClassId =
        undefined;
    }

    // --------------------------------------------------
    // NOTIFY
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
  // LIVE CLASS STARTED
  // ====================================================

  @SubscribeMessage('live-class-started')
  handleLiveClassStarted(
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
    // CHECK USER IS IN ROOM
    // --------------------------------------------------

    if (!socket.rooms.has(room)) {
      this.logger.warn(
        `User ${socket.user.id} tried to start class ${liveClassId} without joining room`,
      );

      return;
    }

    // --------------------------------------------------
    // BROADCAST
    // --------------------------------------------------

    this.server.to(room).emit(
      'live-class-started',
      {
        liveClassId,

        startedBy:
          socket.user.id,

        startedByRole:
          socket.user.role,
      },
    );

    this.logger.log(
      `Live class ${liveClassId} started by user ${socket.user.id}`,
    );
  }

  // ====================================================
  // LIVE CLASS ENDED
  // ====================================================

  @SubscribeMessage('live-class-ended')
  handleLiveClassEnded(
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
    // CHECK USER IS IN ROOM
    // --------------------------------------------------

    if (!socket.rooms.has(room)) {
      this.logger.warn(
        `User ${socket.user.id} tried to end class ${liveClassId} without joining room`,
      );

      return;
    }

    // --------------------------------------------------
    // BROADCAST
    // --------------------------------------------------

    this.server.to(room).emit(
      'live-class-ended',
      {
        liveClassId,

        endedBy:
          socket.user.id,

        endedByRole:
          socket.user.role,
      },
    );

    this.logger.log(
      `Live class ${liveClassId} ended by user ${socket.user.id}`,
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
    if (!socket.user) {
      return;
    }

    const liveClassId =
      Number(data?.liveClassId);

    // --------------------------------------------------
    // CHECK SENDER
    // --------------------------------------------------

    if (
      !socket.liveClassId ||
      socket.liveClassId !== liveClassId
    ) {
      this.logger.warn(
        `Offer rejected: user ${socket.user.id} is not in class ${liveClassId}`,
      );

      return;
    }

    // --------------------------------------------------
    // VALIDATE
    // --------------------------------------------------

    if (
      !data?.targetSocketId ||
      !data?.offer
    ) {
      return;
    }

    // --------------------------------------------------
    // CHECK TARGET
    // --------------------------------------------------

    if (
      !this.isSocketInLiveClass(
        data.targetSocketId,
        liveClassId,
      )
    ) {
      this.logger.warn(
        `Offer target ${data.targetSocketId} is not in class ${liveClassId}`,
      );

      return;
    }

    // --------------------------------------------------
    // SEND OFFER
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

    this.logger.debug(
      `WebRTC offer: ${socket.id} -> ${data.targetSocketId}`,
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
    if (!socket.user) {
      return;
    }

    const liveClassId =
      Number(data?.liveClassId);

    // --------------------------------------------------
    // CHECK SENDER
    // --------------------------------------------------

    if (
      !socket.liveClassId ||
      socket.liveClassId !== liveClassId
    ) {
      this.logger.warn(
        `Answer rejected: user ${socket.user.id} is not in class ${liveClassId}`,
      );

      return;
    }

    // --------------------------------------------------
    // VALIDATE
    // --------------------------------------------------

    if (
      !data?.targetSocketId ||
      !data?.answer
    ) {
      return;
    }

    // --------------------------------------------------
    // CHECK TARGET
    // --------------------------------------------------

    if (
      !this.isSocketInLiveClass(
        data.targetSocketId,
        liveClassId,
      )
    ) {
      this.logger.warn(
        `Answer target ${data.targetSocketId} is not in class ${liveClassId}`,
      );

      return;
    }

    // --------------------------------------------------
    // SEND ANSWER
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

    this.logger.debug(
      `WebRTC answer: ${socket.id} -> ${data.targetSocketId}`,
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
    if (!socket.user) {
      return;
    }

    const liveClassId =
      Number(data?.liveClassId);

    // --------------------------------------------------
    // CHECK SENDER
    // --------------------------------------------------

    if (
      !socket.liveClassId ||
      socket.liveClassId !== liveClassId
    ) {
      this.logger.warn(
        `ICE rejected: user ${socket.user.id} is not in class ${liveClassId}`,
      );

      return;
    }

    // --------------------------------------------------
    // VALIDATE
    // --------------------------------------------------

    if (
      !data?.targetSocketId ||
      !data?.candidate
    ) {
      return;
    }

    // --------------------------------------------------
    // CHECK TARGET
    // --------------------------------------------------

    if (
      !this.isSocketInLiveClass(
        data.targetSocketId,
        liveClassId,
      )
    ) {
      this.logger.warn(
        `ICE target ${data.targetSocketId} is not in class ${liveClassId}`,
      );

      return;
    }

    // --------------------------------------------------
    // SEND ICE
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

    this.logger.debug(
      `ICE candidate: ${socket.id} -> ${data.targetSocketId}`,
    );
  }

  // ====================================================
  // CHAT MESSAGE
  // ====================================================

  @SubscribeMessage('chat-message')
  handleChatMessage(
    @MessageBody()
    data: any,

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
    // CHECK USER IN ROOM
    // --------------------------------------------------

    if (!socket.rooms.has(room)) {
      return;
    }

    // --------------------------------------------------
    // MESSAGE
    // --------------------------------------------------

    const message =
      String(
        data?.message || '',
      ).trim();

    if (!message) {
      return;
    }

    const chatMessage = {
      liveClassId,

      senderId:
        socket.user.id,

      senderName:
        data?.senderName ||
        'User',

      message,

      createdAt:
        data?.createdAt ||
        new Date().toISOString(),
    };

    // --------------------------------------------------
    // BROADCAST
    // --------------------------------------------------

    this.server
      .to(room)
      .emit(
        'chat-message',
        chatMessage,
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
      this.server?.sockets?.sockets?.get(
        socketId,
      ) as
        | AuthenticatedSocket
        | undefined;

    if (!targetSocket) {
      return false;
    }

    const room =
      this.getRoomName(liveClassId);

    return targetSocket.rooms.has(room);
  }
}