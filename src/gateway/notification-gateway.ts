import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway(3100)
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server
    handleConnection(client: Socket) {
        console.log("new Client Connected")
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('newMessage')
    handleSendNotification(client: Socket, payload: { message: string }) {
        this.server.emit('newMessage', payload);
    }
}