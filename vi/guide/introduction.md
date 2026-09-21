# Giới thiệu

## Orbit là gì?

Orbit là một framework backend tiến bộ được tối ưu 100% cho runtime [Bun](https://bun.sh). Nó tuân theo các mô hình theo phong cách NestJS - kiến trúc mô-đun, định tuyến dựa trên decorator và tiêm phụ thuộc - đồng thời tận dụng các khả năng hiệu suất tự nhiên của Bun.

## Tại sao chọn Orbit?

### Hiệu suất Bun tự nhiên

Không giống như các framework chạy trên Node.js và sử dụng các bộ chuyển đổi, Orbit được xây dựng đặc biệt cho Bun:

- **Bun.serve()**: Máy chủ HTTP gốc mà không có chi phí Express hay Fastify
- **Bun.password**: Băm mật khẩu tích hợp sử dụng Argon2
- **Socket TCP gốc**: Tất cả các giao thức microservice đều sử dụng API socket gốc của Bun
- **Bun.Transpiler**: Tải lại nhanh chóng với biên dịch TypeScript gần như tức thì

### Mô hình quen thuộc

Nếu bạn đã từng sử dụng NestJS, bạn sẽ cảm thấy rất quen thuộc:

```typescript
@Controller('users')
class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
```

### Bộ tính năng đầy đủ

Orbit cung cấp mọi thứ bạn cần để xây dựng các ứng dụng sẵn sàng cho sản xuất:

- **Core**: Module, Controller, Provider, Container DI
- **Pipeline**: Middleware, Guard, Pipe, Interceptor, Bộ lọc ngoại lệ
- **Cơ sở dữ liệu**: Tích hợp Drizzle ORM với mẫu Repository
- **GraphQL**: Code-first với DataLoader và Subscription
- **Microservices**: 6 giao thức truyền tải (TCP, Redis, NATS, RabbitMQ, Kafka, gRPC)
- **WebSocket**: Gateway với decorator
- **Bảo mật**: JWT, Giới hạn tốc độ, Helmet, CSRF, Làm sạch
- **Khả năng quan sát**: Truy vết, Metric, Logging có cấu trúc
- **DevTools**: CLI, Tiện ích VS Code, Bảng điều khiển

## Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────┐
│                    Ứng dụng                         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   HTTP   │  │ WebSocket│  │   Microservice   │  │
│  │ Requests │  │ Messages │  │     Messages     │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │             │                  │            │
│       └─────────────┴──────────────────┘            │
│                     │                               │
│       ┌─────────────▼─────────────┐                │
│       │     Request Pipeline      │                │
│       │  Middleware → Guards →    │                │
│       │  Pipes → Interceptors     │                │
│       └─────────────┬─────────────┘                │
│                     │                               │
│       ┌─────────────▼─────────────┐                │
│       │       Controllers         │                │
│       └─────────────┬─────────────┘                │
│                     │                               │
│       ┌─────────────▼─────────────┐                │
│       │        Services           │                │
│       └─────────────┬─────────────┘                │
│                     │                               │
│       ┌─────────────▼─────────────┐                │
│       │      Repositories         │                │
│       └─────────────┬─────────────┘                │
│                     │                               │
│       ┌─────────────▼─────────────┐                │
│       │        Database           │                │
│       └───────────────────────────┘                │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## So sánh với NestJS

| Tính năng | Orbit | NestJS |
|---------|-----------|--------|
| Runtime | Bun | Node.js |
| Máy chủ HTTP | Bun.serve() | Express/Fastify |
| Hệ thống Module | ✅ | ✅ |
| Tiêm phụ thuộc | ✅ | ✅ |
| Decorator | ✅ | ✅ |
| Guards/Pipes/Interceptors | ✅ | ✅ |
| Microservices | TCP gốc | Thư viện bên ngoài |
| GraphQL | ✅ | ✅ |
| WebSocket | ✅ | ✅ |
| Khởi động lạnh | ~10ms | ~100ms |
| Phụ thuộc bên ngoài | Tối thiểu | Nhiều |

## Yêu cầu

- **Bun** >= 1.0.0
- **TypeScript** >= 5.0.0

Cấu hình TypeScript phải bao gồm:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Các bước tiếp theo

Bạn đã sẵn sàng chưa? Hãy đến với hướng dẫn [Bắt đầu nhanh](/vi/guide/quick-start) để tạo ứng dụng Orbit đầu tiên của bạn.