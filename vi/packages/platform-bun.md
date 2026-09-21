# @galaxy-stack/orbit-platform-bun

Bộ điều hợp HTTP sử dụng Bun.serve() để đạt hiệu suất tối đa.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-platform-bun
```

## Tổng quan

Gói này cung cấp bộ điều hợp HTTP tích hợp Orbit với API `Bun.serve()` gốc của Bun. Nó được sử dụng tự động khi tạo ứng dụng với `BunFactory`.

## Tính năng

- Tích hợp Bun.serve() gốc
- Không có phụ thuộc HTTP bên ngoài
- Hiệu suất tối đa
- Hỗ trợ WebSocket tích hợp
- Phục vụ file tĩnh

## Sử dụng

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { BunAdapter } from '@galaxy-stack/orbit-platform-bun';

const app = await BunFactory.create(AppModule, {
  adapter: new BunAdapter(),
});

await app.listen(3000);
```

## Tùy chọn cấu hình

```typescript
const app = await BunFactory.create(AppModule, {
  adapter: new BunAdapter({
    maxRequestBodySize: 1024 * 1024 * 10,
    development: process.env.NODE_ENV !== 'production',
    tls: {
      cert: Bun.file('cert.pem'),
      key: Bun.file('key.pem'),
    },
  }),
});
```

## File tĩnh

```typescript
import { StaticMiddleware } from '@galaxy-stack/orbit-platform-bun';

app.use(StaticMiddleware({
  root: './public',
  prefix: '/static',
  maxAge: 86400,
}));
```

## Hỗ trợ WebSocket

```typescript
const server = app.getHttpServer();

server.upgrade(request, {
  data: { userId: request.headers.get('x-user-id') },
});
```

## Hiệu suất

BunAdapter tận dụng triển khai HTTP được tối ưu của Bun:

- Truy cập bộ nhớ trực tiếp
- Không có lớp tương thích Node.js
- Hỗ trợ TLS gốc
- Phân tích yêu cầu hiệu quả