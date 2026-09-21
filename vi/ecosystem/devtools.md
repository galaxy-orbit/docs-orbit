# Bảng điều khiển Devtools

Bảng điều khiển nhà phát triển dựa trên web cho các ứng dụng Orbit.

## Tổng quan

Bảng điều khiển devtools cung cấp khả năng hiển thị thời gian thực vào ứng dụng của bạn:

- **Route**: Xem tất cả endpoint HTTP đã đăng ký
- **Đồ thị DI**: Hiển thị trực quan mối quan hệ tiêm phụ thuộc
- **Module**: Kiểm tra cấu trúc module và xuất khẩu
- **Metric**: Theo dõi hiệu suất theo thời gian thực

## Thiết lập

```typescript
import { createDevtools } from '@galaxy-stack/orbit-devtools';

const devtools = createDevtools({
  title: 'Devtools Ứng dụng của tôi',
  path: '/__devtools',
  theme: 'auto',
});

// Gắn bảng điều khiển
app.get('/__devtools*', devtools.createHandler());
```

Truy cập tại: `http://localhost:3000/__devtools`

## Cung cấp dữ liệu

### Route

```typescript
devtools.setRoutes([
  {
    method: 'GET',
    path: '/users',
    controller: 'UserController',
    handler: 'findAll',
    guards: ['AuthGuard'],
    pipes: ['ValidationPipe'],
  },
  {
    method: 'POST',
    path: '/users',
    controller: 'UserController',
    handler: 'create',
    guards: ['AuthGuard'],
    pipes: ['ValidationPipe'],
    interceptors: ['LoggingInterceptor'],
  },
]);
```

### Provider

```typescript
devtools.setProviders([
  {
    name: 'UserService',
    scope: 'singleton',
    dependencies: ['UserRepository', 'CacheService'],
    module: 'UserModule',
  },
  {
    name: 'UserRepository',
    scope: 'singleton',
    dependencies: ['DatabaseService'],
    module: 'UserModule',
  },
]);
```

### Module

```typescript
devtools.setModules([
  {
    name: 'AppModule',
    controllers: ['AppController'],
    providers: ['AppService'],
    imports: ['UserModule', 'AuthModule'],
    exports: [],
  },
  {
    name: 'UserModule',
    controllers: ['UserController'],
    providers: ['UserService', 'UserRepository'],
    imports: [],
    exports: ['UserService'],
  },
]);
```

### Metric thời gian thực

```typescript
setInterval(() => {
  devtools.pushMetrics({
    requestsPerSecond: calculateRPS(),
    avgLatency: calculateLatency(),
    errorRate: calculateErrorRate(),
    activeConnections: getActiveConnections(),
    memoryUsage: process.memoryUsage().heapUsed,
    cpuUsage: getCpuUsage(),
  });
}, 1000);
```

## Tab bảng điều khiển

### Tổng quan

Thống kê nhanh hiển thị:
- Tổng số route
- Tổng số provider
- Tổng số module
- Yêu cầu mỗi giây
- Độ trễ trung bình
- Tỷ lệ lỗi

### Route

Hiển thị bảng của tất cả route đã đăng ký:

| Phương thức | Đường dẫn | Bộ xử lý | Guard | Pipe |
|------------|-----------|----------|-------|------|
| GET | /users | UserController.findAll | AuthGuard | - |
| POST | /users | UserController.create | AuthGuard | ValidationPipe |

### Đồ thị DI

Biểu diễn trực quan của phụ thuộc provider:

```
┌─────────────┐     ┌─────────────┐
│ UserService │────▶│ UserRepo    │
│ (singleton) │     │ (singleton) │
└─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│ CacheService│
│ (singleton) │
└─────────────┘
```

Mã màu:
- Xanh dương: Phạm vi singleton
- Cam: Phạm vi yêu cầu
- Xanh lá: Phạm vi tạm thời

### Module

Hiển thị thẻ của mỗi module hiển thị:
- Controller
- Provider
- Import
- Export

### Metric

Biểu đồ thời gian thực và bảng lịch sử:
- Yêu cầu mỗi giây theo thời gian
- Phân phối độ trễ
- Xu hướng tỷ lệ lỗi
- Sử dụng bộ nhớ
- Kết nối đang hoạt động

## Tùy chọn cấu hình

```typescript
createDevtools({
  title: 'Devtools của tôi',   // Tiêu đề bảng điều khiển
  port: 9229,                  // Cổng máy chủ độc lập
  path: '/__devtools',         // Đường dẫn gắn
  theme: 'auto',               // 'light' | 'dark' | 'auto'
  refreshInterval: 1000,       // Tỷ lệ làm mới metric (ms)
  auth: {
    enabled: true,
    username: 'admin',
    password: 'secret',
  },
});
```

## Bảo mật

Trong môi trường sản xuất, hãy cân nhắc:

1. Vô hiệu hóa hoàn toàn devtools
2. Sử dụng xác thực
3. Hạn chế cho mạng nội bộ

```typescript
if (process.env.NODE_ENV !== 'production') {
  app.get('/__devtools*', devtools.createHandler());
}
```