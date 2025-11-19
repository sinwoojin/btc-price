import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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

  sendWalletUpdate(userId: number, newBalance: number) {
    // In a real app, you'd target the specific user's socket room
    // For this demo, we'll just broadcast or emit to a room named after userId
    this.server.to(`user-${userId}`).emit('walletUpdate', { balance: newBalance });
  }
}
