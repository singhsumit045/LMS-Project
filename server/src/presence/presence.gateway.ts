
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  // userId -> socket IDs
  // Multiple tabs/devices ko handle karega
  private onlineUsers = new Map<number, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // =========================
  // USER CONNECT
  // =========================

  async handleConnection(socket: Socket) {
    try {
      // Get token from socket handshake
      const token = socket.handshake.auth?.token;

      if (!token) {
        console.log('❌ WebSocket token not found');
        socket.disconnect();
        return;
      }

      // Verify JWT
      const payload = this.jwtService.verify(token);

      // IMPORTANT:
      // JWT contains user ID inside "sub"
      const userId = Number(payload.sub);

      if (!userId) {
        console.log('❌ User ID not found in token');
        socket.disconnect();
        return;
      }

      // Store userId in socket
      socket.data.userId = userId;

      // Get existing sockets for this user
      let userSockets = this.onlineUsers.get(userId);

      if (!userSockets) {
        userSockets = new Set<string>();
        this.onlineUsers.set(userId, userSockets);
      }

      // Add current socket
      userSockets.add(socket.id);

      // Update database
      await this.usersService.updateOnlineStatus(
        userId,
        true,
      );

      console.log(`🟢 User ${userId} is ONLINE`);

      // Notify all connected clients
      this.server.emit('user-online', {
        userId,
      });
    } catch (error) {
      console.log('❌ Invalid WebSocket token');
      console.error(error);

      socket.disconnect();
    }
  }

  // =========================
  // USER DISCONNECT
  // =========================

  async handleDisconnect(socket: Socket) {
    try {
      const userId = socket.data.userId;

      if (!userId) {
        return;
      }

      const userSockets = this.onlineUsers.get(userId);

      if (!userSockets) {
        return;
      }

      // Remove current socket
      userSockets.delete(socket.id);

      // Check if user has other tabs/devices
      if (userSockets.size === 0) {
        // No socket left
        this.onlineUsers.delete(userId);

        // Update database
        await this.usersService.updateOnlineStatus(
          userId,
          false,
        );

        console.log(`⚪ User ${userId} is OFFLINE`);

        // Notify all connected clients
        this.server.emit('user-offline', {
          userId,
        });
      }
    } catch (error) {
      console.error(
        '❌ Error while handling disconnect:',
        error,
      );
    }
  }
}

