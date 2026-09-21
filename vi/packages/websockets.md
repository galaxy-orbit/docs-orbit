# @galaxy-stack/orbit-websockets

Gateway WebSocket với decorator theo phong cách NestJS.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-websockets
```

## Tạo Gateway

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
    console.log('Client đã kết nối');
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client đã ngắt kết nối');
  }

  @SubscribeMessage('message')
  handleMessage(client: WebSocket, payload: any) {
    this.server.emit('message', payload);
  }
}
```

## Decorator

| Decorator | Mô tả |
|-----------|------|
| `@WebSocketGateway()` | Đánh dấu class là gateway |
| `@SubscribeMessage(event)` | Đăng ký sự kiện |
| `@WebSocketServer()` | Tiêm instance server |
| `@ConnectedSocket()` | Lấy socket client |
| `@MessageBody()` | Lấy nội dung tin nhắn |

## Tùy chọn Gateway

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

## Phòng & Phát sóng

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

## Guard & Interceptor

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

## Thiết lập Module

```typescript
@Module({
  imports: [WebSocketModule],
  providers: [ChatGateway],
})
export class ChatModule {}
```