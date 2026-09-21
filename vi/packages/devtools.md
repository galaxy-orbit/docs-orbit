# @galaxy-stack/orbit-devtools

Bảng điều khiển nhà phát triển và định dạng lỗi nâng cao.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-devtools
```

## Bảng điều khiển Devtools

Bảng điều khiển dựa trên web để hiển thị trực quan route, đồ thị DI và metric thời gian thực.

### Thiết lập

```typescript
import { createDevtools, DevtoolsDashboard } from '@galaxy-stack/orbit-devtools';

const devtools = createDevtools({
  title: 'Devtools Ứng dụng của tôi',
  port: 9229,
  path: '/__devtools',
  theme: 'auto', // 'light' | 'dark' | 'auto'
  refreshInterval: 1000,
});

// Đặt dữ liệu ứng dụng
devtools.setRoutes([
  { method: 'GET', path: '/users', controller: 'UserController', handler: 'findAll' },
  { method: 'POST', path: '/users', controller: 'UserController', handler: 'create' },
]);

devtools.setProviders([
  { name: 'UserService', scope: 'singleton', dependencies: ['UserRepository'], module: 'UserModule' },
  { name: 'UserRepository', scope: 'singleton', dependencies: [], module: 'UserModule' },
]);

devtools.setModules([
  { name: 'UserModule', controllers: ['UserController'], providers: ['UserService'], imports: [], exports: ['UserService'] },
]);

// Đẩy metric thời gian thực
setInterval(() => {
  devtools.pushMetrics({
    requestsPerSecond: Math.random() * 100,
    avgLatency: Math.random() * 50,
    errorRate: Math.random() * 0.05,
    activeConnections: Math.floor(Math.random() * 100),
    memoryUsage: process.memoryUsage().heapUsed,
    cpuUsage: Math.random() * 100,
  });
}, 1000);

// Gắn bộ xử lý
app.get('/__devtools', devtools.createHandler());
app.get('/__devtools/api/data', devtools.createHandler());
```

### Tính năng bảng điều khiển

- **Tổng quan**: Thống kê nhanh (route, provider, module, RPS, độ trễ, lỗi)
- **Route**: Bảng với phương thức, đường dẫn, bộ xử lý, guard, pipe
- **Đồ thị DI**: Biểu diễn trực quan với chỉ báo phạm vi
- **Module**: Controller, provider, import, export cho mỗi module
- **Metric**: Biểu đồ thời gian thực và bảng lịch sử

## Thông báo lỗi tốt hơn

Định dạng lỗi nâng cao với ngữ cảnh nguồn và gợi ý giải pháp.

### Định dạng lỗi

```typescript
import { formatError, prettyPrintError } from '@galaxy-stack/orbit-devtools';

try {
  throw new Error('Đã xảy ra lỗi');
} catch (error) {
  // Lấy đối tượng lỗi đã định dạng
  const formatted = await formatError(error, {
    showStack: true,
    showSource: true,
    showHelp: true,
    colors: true,
    maxStackFrames: 10,
  });

  console.log(formatted.name);    // 'Error'
  console.log(formatted.message); // 'Đã xảy ra lỗi'
  console.log(formatted.stack);   // Khung ngăn xếp được phân tích
  console.log(formatted.source);  // Ngữ cảnh mã nguồn
  console.log(formatted.help);    // Gợi ý giải pháp
}
```

### In đẹp

```typescript
import { prettyPrintError } from '@galaxy-stack/orbit-devtools';

try {
  await riskyOperation();
} catch (error) {
  await prettyPrintError(error);
}
```

Đầu ra:

```
Error: Không thể tìm thấy module 'missing-module'

  /src/app.ts

   12 | import { something } from 'other-module';
 > 13 | import { thing } from 'missing-module';
   14 | 
   15 | export class AppService {

Ngăn xếp:
    at loadModule (/src/loader.ts:45:12)
    at bootstrap (/src/main.ts:10:5)

Giải pháp có thể:
  • Kiểm tra nếu module đã được cài đặt: bun install missing-module
  • Xác minh đường dẫn import là chính xác
  • Kiểm tra nếu file tồn tại tại đường dẫn được chỉ định
```

### Middleware lỗi

```typescript
import { createErrorMiddleware } from '@galaxy-stack/orbit-devtools';

app.use(createErrorMiddleware({
  showStack: process.env.NODE_ENV !== 'production',
  showSource: true,
  showHelp: true,
}));
```

### Lớp lỗi tùy chỉnh

```typescript
import {
  BetterError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from '@galaxy-stack/orbit-devtools';

// Lỗi chung với mã và ngữ cảnh
throw new BetterError('Thao tác thất bại', 'OP_FAILED', {
  operation: 'create',
  resource: 'user',
});

// Lỗi xác thực với chi tiết trường
throw new ValidationError('Xác thực thất bại', {
  email: ['Định dạng email không hợp lệ'],
  password: ['Phải có ít nhất 8 ký tự'],
});

// Lỗi không tìm thấy
throw new NotFoundError('Người dùng', '123');
// Tin nhắn: "Người dùng với id 123 không tìm thấy"

// Lỗi xác thực
throw new UnauthorizedError('Token hết hạn');
throw new ForbiddenError('Không đủ quyền');

// Lỗi xung đột
throw new ConflictError('Email đã tồn tại', 'user');
```

## Xuất khẩu

```typescript
export {
  // Bảng điều khiển
  DevtoolsDashboard,
  createDevtools,
  DashboardConfig,
  RouteInfo,
  ProviderInfo,
  ModuleInfo,
  MetricsSnapshot,

  // Lỗi
  formatError,
  formatErrorToString,
  prettyPrintError,
  createErrorMiddleware,
  FormattedError,
  StackFrame,
  SourceContext,

  // Lỗi tùy chỉnh
  BetterError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
};
```