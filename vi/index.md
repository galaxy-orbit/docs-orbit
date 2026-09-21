---
layout: home

hero:
  name: "Orbit"
  text: "Framework theo phong cách NestJS cho Bun"
  tagline: Nhanh, mô-đun và được tối ưu hoàn toàn cho runtime Bun
  actions:
    - theme: brand
      text: Bắt đầu
      link: /vi/guide/introduction
    - theme: alt
      text: Xem trên GitHub
      link: https://github.com/orbit/orbit

features:
  - icon: ⚡
    title: Tối ưu cho Bun
    details: Được xây dựng từ đầu cho runtime Bun. Sử dụng Bun.serve(), Bun.password và socket TCP gốc để đạt hiệu suất tối đa.
  
  - icon: 🧩
    title: Kiến trúc Mô-đun
    details: Tổ chức mã nguồn với các module, controller và provider. Tiêm phụ thuộc đầy đủ với 3 phạm vi - singleton, request, transient.
  
  - icon: 🎨
    title: Dựa trên Decorator
    details: Các decorator theo phong cách NestJS quen thuộc cho routing, validation, caching và nhiều tính năng khác. @Controller, @Get, @Injectable, @Module.
  
  - icon: 📡
    title: 6 Giao thức Microservice
    details: TCP, Redis, NATS, RabbitMQ, Kafka và gRPC - tất cả đều được triển khai gốc mà không cần phụ thuộc bên ngoài.
  
  - icon: 🔮
    title: Hỗ trợ GraphQL
    details: GraphQL code-first với DataLoader, subscriptions và hỗ trợ Federation v2 cho các schema phân tán.
  
  - icon: 🗄️
    title: Tích hợp Cơ sở dữ liệu
    details: Hỗ trợ Drizzle ORM cho PostgreSQL, MySQL, SQLite và MongoDB với mẫu Repository pattern và giao dịch.
  
  - icon: 🔐
    title: Bảo mật tích hợp
    details: Xác thực JWT, giới hạn tốc độ, header Helmet, bảo vệ CSRF và làm sạch đầu vào ngay từ đầu.
  
  - icon: 📊
    title: Khả năng quan sát
    details: Truy vết OpenTelemetry, metric Prometheus và logging có cấu trúc với ID tương quan.
  
  - icon: 🛠️
    title: Công cụ phát triển
    details: CLI để tạo khung, tiện ích VS Code, bảng điều khiển devtools và thông báo lỗi đẹp mắt với gợi ý.
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
}
</style>

## Ví dụ nhanh

```typescript
import { BunFactory, Module, Controller, Get, Injectable } from '@galaxy-stack/orbit-core';

@Injectable()
class UserService {
  getUsers() {
    return [{ id: 1, name: 'John' }];
  }
}

@Controller('users')
class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.getUsers();
  }
}

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class AppModule {}

const app = await BunFactory.create(AppModule);
await app.listen(3000);
```

## Tại sao chọn Orbit?

| Tính năng | Orbit | NestJS |
|---------|-----------|--------|
| Runtime | Bun (gốc) | Node.js |
| Máy chủ HTTP | Bun.serve() | Express/Fastify |
| Băm mật khẩu | Bun.password | bcrypt |
| Microservices | TCP gốc | Thư viện bên ngoài |
| Khởi động lạnh | ~10ms | ~100ms |
| Sử dụng bộ nhớ | Thấp hơn | Cao hơn |

## Tổng quan về các gói

Orbit là một monorepo với **32 gói** được tổ chức theo chức năng:

- **Core**: @galaxy-stack/orbit-core, @galaxy-stack/orbit-common, @galaxy-stack/orbit-config, @galaxy-stack/orbit-validation
- **Cơ sở dữ liệu**: @galaxy-stack/orbit-database, @galaxy-stack/orbit-cache
- **Microservices**: @galaxy-stack/orbit-microservices-tcp, redis, nats, rmq, kafka, grpc
- **GraphQL**: @galaxy-stack/orbit-graphql, @galaxy-stack/orbit-graphql-federation
- **Bảo mật**: @galaxy-stack/orbit-auth, @galaxy-stack/orbit-security, @galaxy-stack/orbit-throttler
- **Khả năng quan sát**: @galaxy-stack/orbit-observability, @galaxy-stack/orbit-logger, @galaxy-stack/orbit-telemetry
- **Công cụ**: orbit, @galaxy-stack/orbit-testing, @galaxy-stack/orbit-devtools