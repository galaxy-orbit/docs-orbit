# Interceptor

Interceptor có quyền truy cập vào yêu cầu/phản hồi trước và sau khi bộ xử lý route thực thi. Chúng hữu ích cho việc ghi log, chuyển đổi phản hồi, bộ nhớ đệm và nhiều việc khác.

## Interceptor cơ bản

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@galaxy-stack/orbit-core';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    
    console.log(`[${request.method}] ${request.url} - Bắt đầu`);
    
    const result = await next.handle();
    
    console.log(`[${request.method}] ${request.url} - ${Date.now() - now}ms`);
    
    return result;
  }
}
```

## Sử dụng Interceptor

### Cấp độ Controller

```typescript
@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UserController {}
```

### Cấp độ Phương thức

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

### Interceptor toàn cục

```typescript
const app = await BunFactory.create(AppModule);
app.useGlobalInterceptors(new LoggingInterceptor());
```

## Chuyển đổi phản hồi

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

## Interceptor bộ nhớ đệm

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
      expiry: Date.now() + 60000, // 1 phút
    });
    
    return data;
  }
}
```

## Interceptor thời gian chờ

```typescript
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Yêu cầu hết thời gian chờ')), 5000);
    });

    return Promise.race([
      next.handle(),
      timeoutPromise,
    ]);
  }
}
```

## Interceptor ánh xạ lỗi

```typescript
@Injectable()
export class ErrorMappingInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    try {
      return await next.handle();
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Tài nguyên không tìm thấy');
      }
      throw error;
    }
  }
}
```

## Interceptor tuần tự hóa

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

## Thứ tự thực thi

1. Interceptor toàn cục (trước)
2. Interceptor controller (trước)
3. Interceptor phương thức (trước)
4. **Bộ xử lý route**
5. Interceptor phương thức (sau)
6. Interceptor controller (sau)
7. Interceptor toàn cục (sau)