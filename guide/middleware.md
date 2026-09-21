# Middleware

Middleware functions execute before the route handler. They have access to the request and response objects and can modify them.

## Creating Middleware

### Functional Middleware

```typescript
import { MiddlewareFunction } from '@galaxy-stack/orbit-core';

export const loggerMiddleware: MiddlewareFunction = async (request, next) => {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  return next();
};
```

### Class Middleware

```typescript
import { Injectable, NestMiddleware } from '@galaxy-stack/orbit-core';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, next: () => Promise<Response>): Promise<Response> {
    console.log(`Request: ${request.method} ${request.url}`);
    return next();
  }
}
```

## Applying Middleware

### Global Middleware

```typescript
const app = await BunFactory.create(AppModule);
app.use(loggerMiddleware);
```

### Module-based Middleware

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

### Route-specific Middleware

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

### Excluding Routes

```typescript
consumer
  .apply(AuthMiddleware)
  .exclude(
    { path: 'auth/login', method: RequestMethod.POST },
    { path: 'auth/register', method: RequestMethod.POST },
  )
  .forRoutes('*');
```

## Built-in Middleware

### CORS Middleware

```typescript
import { CorsMiddleware } from '@galaxy-stack/orbit-core';

app.use(new CorsMiddleware({
  origin: ['https://example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
```

### Static Files Middleware

```typescript
import { StaticMiddleware } from '@galaxy-stack/orbit-core';

app.use(new StaticMiddleware({
  root: './public',
  prefix: '/static',
  maxAge: 86400,
  etag: true,
}));
```

## Common Middleware Examples

### Authentication Middleware

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
        // Token invalid, continue without user
      }
    }

    return next();
  }
}
```

### Request ID Middleware

```typescript
export const requestIdMiddleware: MiddlewareFunction = async (request, next) => {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  
  const response = await next();
  
  response.headers.set('x-request-id', requestId);
  
  return response;
};
```

### Timing Middleware

```typescript
export const timingMiddleware: MiddlewareFunction = async (request, next) => {
  const start = Date.now();
  
  const response = await next();
  
  const duration = Date.now() - start;
  response.headers.set('x-response-time', `${duration}ms`);
  
  return response;
};
```

## Middleware Order

Middleware executes in the order they are applied:

```typescript
app.use(requestIdMiddleware);   // 1st
app.use(timingMiddleware);       // 2nd
app.use(loggerMiddleware);       // 3rd
```

## Async Middleware

Middleware can be async:

```typescript
export const asyncMiddleware: MiddlewareFunction = async (request, next) => {
  await someAsyncOperation();
  const response = await next();
  await anotherAsyncOperation();
  return response;
};
```
