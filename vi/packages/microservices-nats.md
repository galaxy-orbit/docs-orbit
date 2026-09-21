# @galaxy-stack/orbit-microservices-nats

Giao thức NATS với nhóm hàng đợi và đăng ký ký tự đại diện.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-microservices @galaxy-stack/orbit-microservices-nats
```

## Tính năng

- Giao thức văn bản NATS hoàn chỉnh
- Nhóm hàng đợi để cân bằng tải
- Khớp chủ đề ký tự đại diện (`*`, `>`)
- Mẫu yêu cầu/phản hồi

## Máy chủ

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.NATS,
  options: {
    servers: ['nats://localhost:4222'],
    queue: 'my-service',
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
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Đăng ký ký tự đại diện

```typescript
@MessagePattern('orders.*')
handleOrderEvents(@Payload() data: any) {
  // Khớp: orders.created, orders.updated, orders.deleted
}

@MessagePattern('events.>')
handleAllEvents(@Payload() data: any) {
  // Khớp: events.user.created, events.order.shipped, v.v.
}
```

## Tùy chọn

| Tùy chọn | Loại | Mặc định | Mô tả |
|--------|------|---------|-------------|
| `servers` | string[] | `['nats://localhost:4222']` | Máy chủ NATS |
| `queue` | string | - | Tên nhóm hàng đợi |
| `maxReconnectAttempts` | number | `10` | Số lần tái kết nối tối đa |
| `reconnectTimeWait` | number | `2000` | Thời gian chờ giữa các lần tái kết nối |
