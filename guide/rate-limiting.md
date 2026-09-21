# Rate Limiting

Protect your API from abuse with rate limiting.

## Installation

```bash
bun add @galaxy-stack/orbit-throttler
```

## Global Rate Limiting

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { ThrottlerModule, ThrottlerGuard } from '@galaxy-stack/orbit-throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60000, // 60 seconds
      limit: 100,  // 100 requests per minute
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

## Route-Specific Limits

```typescript
import { Throttle, SkipThrottle } from '@galaxy-stack/orbit-throttler';

@Controller('users')
export class UserController {
  @Get()
  @Throttle({ limit: 10, ttl: 60000 }) // 10 req/min
  findAll() {
    return [];
  }

  @Get('public')
  @SkipThrottle() // No rate limit
  publicEndpoint() {
    return { public: true };
  }
}
```

## Controller-Level Limits

```typescript
@Controller('api')
@Throttle({ limit: 50, ttl: 60000 })
export class ApiController {
  @Get('fast')
  @Throttle({ limit: 100, ttl: 60000 }) // Override
  fastEndpoint() {
    return {};
  }
}
```

## Custom Storage

### Redis Storage

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

## Sliding Window Algorithm

Orbit uses a sliding window algorithm for accurate rate limiting:

```typescript
import { SlidingWindowRateLimiter } from '@galaxy-stack/orbit-security';

const limiter = new SlidingWindowRateLimiter({
  windowMs: 60000,      // 1 minute window
  maxRequests: 100,     // 100 requests per window
  bucketCount: 6,       // 6 sub-buckets for precision
});

// Check if request should be allowed
const allowed = limiter.check(clientId);
if (!allowed) {
  throw new TooManyRequestsException();
}
```

## Multiple Rate Limits

```typescript
@Throttle([
  { name: 'short', limit: 3, ttl: 1000 },   // 3 per second
  { name: 'medium', limit: 20, ttl: 10000 }, // 20 per 10 seconds
  { name: 'long', limit: 100, ttl: 60000 },  // 100 per minute
])
@Controller('api')
export class ApiController {}
```

## Custom Key Generator

Rate limit by user instead of IP:

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

## Response Headers

Rate limit info is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699999999
```

## Error Response

When rate limit is exceeded:

```json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "retryAfter": 45
}
```
