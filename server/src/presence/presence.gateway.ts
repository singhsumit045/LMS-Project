import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class PresenceGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit
{
  @WebSocketServer()
  server!: Server;

  // =====================================================
  // userId -> socket IDs
  // Multiple tabs / devices ko handle karega
  // =====================================================

  private onlineUsers = new Map<
    number,
    Set<string>
  >();

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // =====================================================
  // SERVER INITIALIZATION
  // =====================================================

  async afterInit() {
    try {
      // -------------------------------------------------
      // Server restart ke baad stale online users ko
      // offline kar do
      // -------------------------------------------------

      await this.usersService.resetAllOnlineStatus();

      console.log(
        '✅ Presence system initialized',
      );
    } catch (error) {
      console.error(
        '❌ Failed to initialize presence system:',
        error,
      );
    }
  }

  // =====================================================
  // USER CONNECT
  // =====================================================

  async handleConnection(socket: Socket) {
    try {
      // =================================================
      // Get access token from socket handshake
      // =================================================

      const accessToken =
        socket.handshake.auth?.access_token;

      if (!accessToken) {
        console.log(
          '❌ WebSocket access token not found',
        );

        socket.disconnect();
        return;
      }

      // =================================================
      // Verify JWT
      // =================================================

      let payload: any;

      try {
        payload =
          this.jwtService.verify(accessToken);
      } catch (error: any) {
        if (
          error?.name === 'TokenExpiredError'
        ) {
          console.log(
            '❌ WebSocket access token expired',
          );
        } else {
          console.log(
            '❌ Invalid WebSocket access token',
          );
        }

        // Invalid/expired token wale user ko
        // online nahi karna hai.

        socket.disconnect();

        return;
      }

      // =================================================
      // Get user ID from JWT
      // =================================================

      const userId = Number(payload?.sub);

      if (!userId) {
        console.log(
          '❌ User ID not found in access token',
        );

        socket.disconnect();
        return;
      }

      // =================================================
      // Store user ID inside socket
      // =================================================

      socket.data.userId = userId;

      // =================================================
      // Get existing sockets for this user
      // =================================================

      let userSockets =
        this.onlineUsers.get(userId);

      const wasAlreadyOnline =
        !!userSockets &&
        userSockets.size > 0;

      // =================================================
      // Create socket set if user doesn't exist
      // =================================================

      if (!userSockets) {
        userSockets = new Set<string>();

        this.onlineUsers.set(
          userId,
          userSockets,
        );
      }

      // =================================================
      // Add current socket
      // =================================================

      userSockets.add(socket.id);

      // =================================================
      // Update database only if user was offline
      // =================================================

      if (!wasAlreadyOnline) {
        await this.usersService.updateOnlineStatus(
          userId,
          true,
        );

        console.log(
          `🟢 User ${userId} is ONLINE`,
        );

        // Notify all connected clients
        this.server.emit('user-online', {
          userId,
        });
      } else {
        console.log(
          `🟢 User ${userId} connected another device/tab`,
        );
      }
    } catch (error) {
      console.error(
        '❌ Error while handling WebSocket connection:',
        error,
      );

      // Make sure invalid connection  
      // doesn't remain active

      socket.disconnect();
    }
  }

  // =====================================================
  // USER DISCONNECT
  // =====================================================

  async handleDisconnect(socket: Socket) {
    try {
      // =================================================
      // Get user ID from socket
      // =================================================

      const userId = socket.data.userId;

      // Socket authenticated nahi tha
      if (!userId) {
        return;
      }

      // =================================================
      // Get user's sockets
      // =================================================

      const userSockets =
        this.onlineUsers.get(userId);

      if (!userSockets) {
        return;
      }

      // =================================================
      // Remove current socket
      // =================================================

      userSockets.delete(socket.id);

      console.log(
        `🔌 Socket ${socket.id} disconnected for User ${userId}`,
      );

      // =================================================
      // Check if another tab/device is connected
      // =================================================

      if (userSockets.size > 0) {
        console.log(
          `🟢 User ${userId} is still ONLINE`,
        );

        return;
      }

      // =================================================
      // No socket remaining
      // User is completely offline
      // =================================================

      this.onlineUsers.delete(userId);

      await this.usersService.updateOnlineStatus(
        userId,
        false,
      );

      console.log(
        `⚪ User ${userId} is OFFLINE`,
      );

      // =================================================
      // Notify all connected clients
      // =================================================

      this.server.emit('user-offline', {
        userId,
      });
    } catch (error) {
      console.error(
        '❌ Error while handling disconnect:',
        error,
      );
    }
  }
}