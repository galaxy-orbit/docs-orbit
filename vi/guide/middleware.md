# Middleware

Hàm middleware thực thi trước bộ xử lý route. Chúng có quyền truy cập vào đối tượng yêu cầu và phản hồi và có thể sửa đổi chúng.

## Tạo Middleware

### Middleware hàm

```typescript
import { MiddlewareFunction } from '@galaxy-stack/orbit-core';

export const loggerMiddleware: MiddlewareFunction = async (request, next) => {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  return next();
};
```

### Middleware class

```typescript
import { Injectable, NestMiddleware } from '@galaxy-stack/orbit-core';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, next: () => Promise<Response>): Promise<Response> {
    console.log(`Yêu cầu: ${request.method} ${request.url}`);
    return next();
  }
}
```

## Áp dụng Middleware

### Middleware toàn cục

```typescript
const app = await BunFactory.create(AppModule);
app.use(loggerMiddleware);
```

### Middleware dựa trên Module

```typescript
import { Module, MiddlewareConsumer, NestModule } from '@galaxy-stack/orbit-core';

@Module({
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(UserController);
  }
}
```

### Middleware cho route cụ thể

```typescript
@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.ALL },
        { path: 'posts', method: RequestMethod.POST }
      );
  }
}
```

### Loại trừ Route

```typescript
consumer
  .apply(AuthMiddleware)
  .exclude(
    { path: 'auth/login', method: RequestMethod.POST },
    { path: 'auth/register', method: RequestMethod.POST },
  )
  .forRoutes('*');
```

## Middleware tích hợp

### Middleware CORS

```typescript
import { CorsMiddleware } from '@galaxy-stack/orbit-core';

app.use(new CorsMiddleware({
  origin: ['https://example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
```

### Middleware file tĩnh

```typescript
import { StaticMiddleware } from '@galaxy-stack/orbit-core';

app.use(new StaticMiddleware({
  root: './public',
  prefix: '/static',
  maxAge: 86400,
  etag: true,
}));
```

## Ví dụ Middleware phổ biến

### Middleware xác thực

```typescript
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(request: Request, next: () => Promise<Response>): Promise<Response> {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (token) {
      try {
        const user = await this.authService.validateToken(token);
        (request as any).user = user;
      } catch (error) {
        // Token không hợp lệ, tiếp tục mà không có user
      }
    }

    return next();
  }
}
```

### Middleware ID yêu cầu

```typescript
export const requestIdMiddleware: MiddlewareFunction = async (request, next) => {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  
  const response = await next();
  
  response.headers.set('x-request-id', requestId);
  
  return response;
};
```

### Middleware đo thời gian

```typescript
export const timingMiddleware: MiddlewareFunction = async (request, next) => {
  const start = Date.now();
  
  const response = await next();
  
  const duration = Date.now() - start;
  response.headers.set('x-response-time', `${duration}ms`);
  
  return response;
};
```

## Thứ tự Middleware

Middleware thực thi theo thứ tự chúng được áp dụng:

```typescript
app.use(requestIdMiddleware);   // Thứ 1
app.use(timingMiddleware);       // Thứ 2
app.use(loggerMiddleware);       // Thứ 3
```

## Middleware bất đồng bộ

Middleware có thể là bất đồng bộ:

```typescript
export const asyncMiddleware: MiddlewareFunction = async (request, next) => {
  await someAsyncOperation();
  const response = await next();
  await anotherAsyncOperation();
  return response;
};
```