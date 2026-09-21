# Giới hạn tốc độ

Bảo vệ API của bạn khỏi bị lạm dụng bằng giới hạn tốc độ.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-throttler
```

## Giới hạn tốc độ toàn cục

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { ThrottlerModule, ThrottlerGuard } from '@galaxy-stack/orbit-throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60000, // 60 giây
      limit: 100,  // 100 yêu cầu mỗi phút
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

## Giới hạn tốc độ theo tuyến đường cụ thể

```typescript
import { Throttle, SkipThrottle } from '@galaxy-stack/orbit-throttler';

@Controller('users')
export class UserController {
  @Get()
  @Throttle({ limit: 10, ttl: 60000 }) // 10 yêu cầu/phút
  findAll() {
    return [];
  }

  @Get('public')
  @SkipThrottle() // Không giới hạn tốc độ
  publicEndpoint() {
    return { public: true };
  }
}
```

## Giới hạn tốc độ ở cấp độ Controller

```typescript
@Controller('api')
@Throttle({ limit: 50, ttl: 60000 })
export class ApiController {
  @Get('fast')
  @Throttle({ limit: 100, ttl: 60000 }) // Ghi đè
  fastEndpoint() {
    return {};
  }
}
```

## Lưu trữ tùy chỉnh

### Lưu trữ Redis

```typescript
import { ThrottlerModule, RedisThrottlerStorage } from '@galaxy-stack/orbit-throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60000,
      limit: 100,
      storage: new RedisThrottlerStorage({
        host: 'localhost',
        port: 6379,
      }),
    }),
  ],
})
export class AppModule {}
```

## Thuật toán cửa sổ trượt

Orbit sử dụng thuật toán cửa sổ trượt để giới hạn tốc độ chính xác:

```typescript
import { SlidingWindowRateLimiter } from '@galaxy-stack/orbit-security';

const limiter = new SlidingWindowRateLimiter({
  windowMs: 60000,      // Cửa sổ 1 phút
  maxRequests: 100,     // 100 yêu cầu mỗi cửa sổ
  bucketCount: 6,       // 6 bucket con để tăng độ chính xác
});

// Kiểm tra xem yêu cầu có được phép không
const allowed = limiter.check(clientId);
if (!allowed) {
  throw new TooManyRequestsException();
}
```

## Nhiều mức giới hạn tốc độ

```typescript
@Throttle([
  { name: 'short', limit: 3, ttl: 1000 },   // 3 mỗi giây
  { name: 'medium', limit: 20, ttl: 10000 }, // 20 mỗi 10 giây
  { name: 'long', limit: 100, ttl: 60000 },  // 100 mỗi phút
])
@Controller('api')
export class ApiController {}
```

## Trình tạo khóa tùy chỉnh

Giới hạn tốc độ theo người dùng thay vì IP:

```typescript
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(request: Request): string {
    const user = (request as any).user;
    if (user) {
      return `user:${user.id}`;
    }
    return request.headers.get('x-forwarded-for') || 'anonymous';
  }
}
```

## Header phản hồi

Thông tin giới hạn tốc độ được bao gồm trong header phản hồi:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699999999
```

## Phản hồi lỗi

Khi vượt quá giới hạn tốc độ:

```json
{
  "statusCode": 429,
  "message": "Quá nhiều yêu cầu",
  "retryAfter": 45
}
```