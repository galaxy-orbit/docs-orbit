# @galaxy-stack/orbit-throttler

Rate limiting with @Throttle decorator.

## Installation

```bash
bun add @galaxy-stack/orbit-throttler
```

## Setup

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { ThrottlerModule, ThrottlerGuard } from '@galaxy-stack/orbit-throttler';
import { APP_GUARD } from '@galaxy-stack/orbit-core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
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

## @Throttle Decorator

```typescript
import { Controller, Get } from '@galaxy-stack/orbit-common';
import { Throttle, SkipThrottle } from '@galaxy-stack/orbit-throttler';

@Controller('api')
export class ApiController {
  @Get('limited')
  @Throttle({ default: { ttl: 60, limit: 10 } })
  limitedEndpoint() {
    return { data: 'rate limited' };
  }

  @Get('open')
  @SkipThrottle()
  openEndpoint() {
    return { data: 'no rate limit' };
  }
}
```

## Controller-Level Throttling

```typescript
@Controller('auth')
@Throttle({ default: { ttl: 60, limit: 5 } })
export class AuthController {
  @Post('login')
  login() {}

  @Post('register')
  @Throttle({ default: { ttl: 3600, limit: 3 } })
  register() {}
}
```

## Custom Key Generation

```typescript
ThrottlerModule.forRoot({
  ttl: 60,
  limit: 100,
  keyGenerator: (context) => {
    const request = context.switchToHttp().getRequest();
    return request.user?.id || request.ip;
  },
})
```

## Storage Options

```typescript
import { ThrottlerStorageRedisService } from '@galaxy-stack/orbit-throttler';

ThrottlerModule.forRoot({
  ttl: 60,
  limit: 100,
  storage: new ThrottlerStorageRedisService({
    host: 'localhost',
    port: 6379,
  }),
})
```

## Response Headers

Throttle responses include headers:
- `X-RateLimit-Limit`: Maximum requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp
