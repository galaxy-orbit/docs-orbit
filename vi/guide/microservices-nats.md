# Giao thức NATS

Giao thức nhắn tin NATS hiệu suất cao.

## Thiết lập máy chủ

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

## Nhóm hàng đợi

Nhóm hàng đợi cho phép cân bằng tải giữa các instance dịch vụ:

```typescript
{
  transport: Transport.NATS,
  options: {
    servers: ['nats://localhost:4222'],
    queue: 'my-service-group',
  },
}
```

## Đăng ký ký tự đại diện

```typescript
@Controller()
export class NotificationsHandler {
  @MessagePattern('notifications.*')
  handleNotification(@Payload() data: any) {
    console.log('Đã nhận thông báo:', data);
  }

  @MessagePattern('events.>')
  handleAllEvents(@Payload() data: any) {
    console.log('Đã nhận sự kiện:', data);
  }
}
```

## Cấu hình khách hàng

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

## Xuất bản sự kiện

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