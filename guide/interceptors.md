# Interceptors

Interceptors have access to the request/response before and after the route handler executes. They're useful for logging, transforming responses, caching, and more.

## Basic Interceptor

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@galaxy-stack/orbit-core';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    
    console.log(`[${request.method}] ${request.url} - Started`);
    
    const result = await next.handle();
    
    console.log(`[${request.method}] ${request.url} - ${Date.now() - now}ms`);
    
    return result;
  }
}
```

## Using Interceptors

### Controller Level

```typescript
@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UserController {}
```

### Method Level

```typescript
@Controller('users')
export class UserController {
  @Get()
  @UseInterceptors(CacheInterceptor)
  findAll() {
    return [];
  }
}
```

### Global Interceptors

```typescript
const app = await BunFactory.create(AppModule);
app.useGlobalInterceptors(new LoggingInterceptor());
```

## Response Transformation

```typescript
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const data = await next.handle();
    
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
```

## Caching Interceptor

```typescript
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, { data: any; expiry: number }>();

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const key = request.url;
    
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    
    const data = await next.handle();
    
    this.cache.set(key, {
      data,
      expiry: Date.now() + 60000, // 1 minute
    });
    
    return data;
  }
}
```

## Timeout Interceptor

```typescript
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000);
    });

    return Promise.race([
      next.handle(),
      timeoutPromise,
    ]);
  }
}
```

## Error Mapping Interceptor

```typescript
@Injectable()
export class ErrorMappingInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    try {
      return await next.handle();
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Resource not found');
      }
      throw error;
    }
  }
}
```

## Serialization Interceptor

```typescript
@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const data = await next.handle();
    return this.removeNulls(data);
  }

  private removeNulls(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeNulls(item));
    }
    if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([_, v]) => v !== null)
          .map(([k, v]) => [k, this.removeNulls(v)])
      );
    }
    return obj;
  }
}
```

## Execution Order

1. Global interceptors (before)
2. Controller interceptors (before)
3. Method interceptors (before)
4. **Route handler**
5. Method interceptors (after)
6. Controller interceptors (after)
7. Global interceptors (after)
