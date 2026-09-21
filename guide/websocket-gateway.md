# WebSocket Gateway

Real-time communication with `@galaxy-stack/orbit-websockets`.

## Setup

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { WebSocketModule } from '@galaxy-stack/orbit-websockets';

@Module({
  imports: [WebSocketModule],
})
export class AppModule {}
```

## Creating a Gateway

```typescript
import { 
  WebSocketGateway, 
  SubscribeMessage, 
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@galaxy-stack/orbit-websockets';

@WebSocketGateway({ port: 3001 })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: WebSocket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: WebSocket, payload: { room: string; text: string }) {
    this.server.to(payload.room).emit('message', {
      from: client.id,
      text: payload.text,
    });
  }
}
```

## Rooms

```typescript
@SubscribeMessage('joinRoom')
handleJoinRoom(client: WebSocket, room: string) {
  client.join(room);
  client.to(room).emit('userJoined', { userId: client.id });
}

@SubscribeMessage('leaveRoom')
handleLeaveRoom(client: WebSocket, room: string) {
  client.leave(room);
  client.to(room).emit('userLeft', { userId: client.id });
}
```

## Broadcasting

```typescript
@SubscribeMessage('broadcast')
handleBroadcast(client: WebSocket, data: any) {
  this.server.emit('announcement', data);
}

@SubscribeMessage('toRoom')
sendToRoom(client: WebSocket, payload: { room: string; data: any }) {
  this.server.to(payload.room).emit('roomMessage', payload.data);
}
```

## Authentication

```typescript
@WebSocketGateway()
@UseGuards(WsAuthGuard)
export class SecureGateway {
  @SubscribeMessage('privateMessage')
  handlePrivate(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: any) {
    console.log('User:', client.user);
  }
}
```

## Client Example

```typescript
const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => {
  ws.send(JSON.stringify({ event: 'message', data: { room: 'general', text: 'Hello!' } }));
};

ws.onmessage = (event) => {
  const { event: eventName, data } = JSON.parse(event.data);
  console.log(eventName, data);
};
```
