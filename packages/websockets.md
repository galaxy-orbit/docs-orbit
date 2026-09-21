# @galaxy-stack/orbit-websockets

WebSocket gateway with NestJS-style decorators.

## Installation

```bash
bun add @galaxy-stack/orbit-websockets
```

## Creating a Gateway

```typescript
import { 
  WebSocketGateway, 
  SubscribeMessage, 
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@galaxy-stack/orbit-websockets';

@WebSocketGateway({ port: 3001 })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: WebSocket) {
    console.log('Client connected');
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected');
  }

  @SubscribeMessage('message')
  handleMessage(client: WebSocket, payload: any) {
    this.server.emit('message', payload);
  }
}
```

## Decorators

| Decorator | Description |
|-----------|-------------|
| `@WebSocketGateway()` | Mark class as gateway |
| `@SubscribeMessage(event)` | Subscribe to event |
| `@WebSocketServer()` | Inject server instance |
| `@ConnectedSocket()` | Get client socket |
| `@MessageBody()` | Get message payload |

## Gateway Options

```typescript
@WebSocketGateway({
  port: 3001,
  path: '/ws',
  cors: {
    origin: '*',
  },
})
export class AppGateway {}
```

## Rooms & Broadcasting

```typescript
@SubscribeMessage('join')
handleJoin(client: WebSocket, room: string) {
  client.join(room);
}

@SubscribeMessage('broadcast')
handleBroadcast(client: WebSocket, data: { room: string; message: string }) {
  this.server.to(data.room).emit('message', data.message);
}
```

## Guards & Interceptors

```typescript
@WebSocketGateway()
@UseGuards(WsAuthGuard)
@UseInterceptors(LoggingInterceptor)
export class SecureGateway {
  @SubscribeMessage('private')
  handlePrivate(@ConnectedSocket() client: AuthSocket) {
    return { user: client.user };
  }
}
```

## Module Setup

```typescript
@Module({
  imports: [WebSocketModule],
  providers: [ChatGateway],
})
export class ChatModule {}
```
