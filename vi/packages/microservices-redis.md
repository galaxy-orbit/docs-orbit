# @galaxy-stack/orbit-microservices-redis

Transport Redis pub/sub với triển khai giao thức RESP hoàn chỉnh.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-microservices @galaxy-stack/orbit-microservices-redis
```

## Tính năng

- Bộ mã hóa/giải mã giao thức RESP hoàn chỉnh
- Pub/Sub với tự động kết nối lại
- Nhóm kết nối cho pub và sub
- Mẫu yêu cầu/phản hồi thông qua kênh

## Máy chủ

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
    password: process.env.REDIS_PASSWORD,
  },
});

await app.listen();
```

## Client

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
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
| `host` | string | `'localhost'` | Máy chủ Redis |
| `port` | number | `6379` | Cổng Redis |
| `password` | string | - | Mật khẩu Redis |
| `db` | number | `0` | Chỉ số cơ sở dữ liệu |
| `retryAttempts` | number | `5` | Số lần thử kết nối lại |
| `retryDelay` | number | `3000` | Độ trễ giữa các lần thử |

## Giao thức RESP

Triển khai gốc của Redis Serialization Protocol:
- Chuỗi đơn giản, Lỗi, Số nguyên
- Chuỗi khối, Mảng
- Hỗ trợ đầy đủ lệnh pub/sub