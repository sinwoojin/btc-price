import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinUserRoom')
  handleJoinRoom(client: Socket, userId: string) {
    client.join(`user-${userId}`);
    console.log(`User ${userId} joined room user-${userId}`);
    return { success: true };
  }

  sendWalletUpdate(userId: string, newBalance: number) {
    this.server
      .to(`user-${userId}`)
      .emit('walletUpdate', { balance: newBalance });
  }
}
