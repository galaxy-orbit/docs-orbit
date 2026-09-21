# @galaxy-stack/orbit-microservices-tcp

Transport TCP gốc cho microservices - triển khai đầy đủ mà không có phụ thuộc bên ngoài.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-microservices @galaxy-stack/orbit-microservices-tcp
```

## Tính năng

- Giao thức nhị phân có tiền tố độ dài
- Mẫu yêu cầu/phản hồi
- Mẫu sự kiện (bắn và quên)
- Nhóm kết nối
- Tự động kết nối lại

## Máy chủ

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.TCP,
  options: {
    host: '0.0.0.0',
    port: 3001,
  },
});

await app.listen();
console.log('Microservice TCP đang lắng nghe trên cổng 3001');
```

## Client

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { ClientsModule, Transport } from '@galaxy-stack/orbit-microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TCP_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Tùy chọn

| Tùy chọn | Kiểu | Mặc định | Mô tả |
|----------|------|----------|------|
| `host` | string | `'localhost'` | Máy chủ host |
| `port` | number | `3000` | Cổng máy chủ |
| `retryAttempts` | number | `3` | Số lần thử kết nối lại |
| `retryDelay` | number | `1000` | Độ trễ giữa các lần thử (ms) |

## Giao thức

Transport TCP sử dụng giao thức có tiền tố độ dài:
- Header độ dài 4 byte (big-endian)
- Nội dung tin nhắn được mã hóa JSON