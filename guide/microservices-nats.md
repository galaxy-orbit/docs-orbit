# NATS Transport

High-performance NATS messaging transport.

## Server Setup

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.NATS,
  options: {
    servers: ['nats://localhost:4222'],
    queue: 'orders-service',
  },
});

await app.listen();
```

## Queue Groups

Queue groups enable load balancing across service instances:

```typescript
{
  transport: Transport.NATS,
  options: {
    servers: ['nats://localhost:4222'],
    queue: 'my-service-group',
  },
}
```

## Wildcard Subscriptions

```typescript
@Controller()
export class NotificationsHandler {
  @MessagePattern('notifications.*')
  handleNotification(@Payload() data: any) {
    console.log('Received notification:', data);
  }

  @MessagePattern('events.>')
  handleAllEvents(@Payload() data: any) {
    console.log('Received event:', data);
  }
}
```

## Client Configuration

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
          maxReconnectAttempts: 10,
          reconnectTimeWait: 2000,
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Publishing Events

```typescript
@Injectable()
export class EventsService {
  constructor(@Inject('NATS_SERVICE') private client: ClientProxy) {}

  async publishEvent(type: string, data: any) {
    this.client.emit(`events.${type}`, {
      timestamp: Date.now(),
      data,
    });
  }
}
```
