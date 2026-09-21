# @galaxy-stack/orbit-microservices-rmq

Giao thức RabbitMQ với giao thức AMQP 0-9-1 hoàn chỉnh.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-microservices @galaxy-stack/orbit-microservices-rmq
```

## Tính năng

- Triển khai giao thức AMQP 0-9-1 hoàn chỉnh
- Bắt tay kết nối với xác thực PLAIN
- Quản lý kênh và heartbeat
- Khai báo hàng đợi (durable/exclusive)
- Xác nhận tin nhắn ACK/NACK
- RPC với hàng đợi phản hồi độc quyền

## Máy chủ

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'my_queue',
    queueOptions: { durable: true },
  },
});

await app.listen();
```

## Khách hàng

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'my_queue',
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Xác nhận thủ công

```typescript
@MessagePattern('process')
async handle(@Payload() data: any, @Ctx() context: RmqContext) {
  const channel = context.getChannelRef();
  const msg = context.getMessage();
  
  try {
    await this.process(data);
    channel.ack(msg);
  } catch {
    channel.nack(msg, false, true);
  }
}
```

## Tùy chọn

| Tùy chọn | Loại | Mô tả |
|--------|------|-------------|
| `urls` | string[] | URL kết nối AMQP |
| `queue` | string | Tên hàng đợi |
| `prefetchCount` | number | Prefetch người tiêu dùng |
| `queueOptions.durable` | boolean | Tồn tại sau khi khởi động lại |
| `noAck` | boolean | Tự động xác nhận |
