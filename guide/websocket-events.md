# WebSocket Events

Handle real-time events with decorators.

## Message Decorators

```typescript
import { 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket 
} from '@galaxy-stack/orbit-websockets';

@WebSocketGateway()
export class EventsGateway {
  @SubscribeMessage('createItem')
  handleCreate(
    @MessageBody() data: CreateItemDto,
    @ConnectedSocket() client: WebSocket,
  ) {
    const item = this.itemsService.create(data);
    return { event: 'itemCreated', data: item };
  }
}
```

## Event Acknowledgment

```typescript
@SubscribeMessage('saveData')
async handleSave(@MessageBody() data: any): Promise<WsResponse<boolean>> {
  await this.dataService.save(data);
  return { event: 'dataSaved', data: true };
}
```

## Multiple Events

```typescript
@WebSocketGateway()
export class NotificationsGateway {
  @SubscribeMessage('subscribe')
  handleSubscribe(client: WebSocket, channels: string[]) {
    channels.forEach(channel => client.join(channel));
    return { event: 'subscribed', data: channels };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: WebSocket, channels: string[]) {
    channels.forEach(channel => client.leave(channel));
    return { event: 'unsubscribed', data: channels };
  }
}
```

## Error Handling

```typescript
import { WsException } from '@galaxy-stack/orbit-websockets';

@SubscribeMessage('riskyOperation')
async handleRisky(@MessageBody() data: any) {
  if (!this.isValid(data)) {
    throw new WsException('Invalid data');
  }
  return this.process(data);
}
```

## Interceptors

```typescript
@UseInterceptors(LoggingInterceptor)
@SubscribeMessage('tracked')
handleTracked(@MessageBody() data: any) {
  return this.process(data);
}
```

## Pipes

```typescript
@SubscribeMessage('validated')
handleValidated(
  @MessageBody(new ValidationPipe()) data: CreateDto,
) {
  return this.create(data);
}
```

## Event Emitting from Services

```typescript
@Injectable()
export class AlertsService {
  constructor(private gateway: AlertsGateway) {}

  sendAlert(userId: string, alert: Alert) {
    this.gateway.server.to(userId).emit('alert', alert);
  }

  broadcastAlert(alert: Alert) {
    this.gateway.server.emit('globalAlert', alert);
  }
}
```
