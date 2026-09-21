# @galaxy-stack/orbit-throttler

Giới hạn tốc độ với decorator @Throttle.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-throttler
```

## Thiết lập

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

## Decorator @Throttle

```typescript
import { Controller, Get } from '@galaxy-stack/orbit-common';
import { Throttle, SkipThrottle } from '@galaxy-stack/orbit-throttler';

@Controller('api')
export class ApiController {
  @Get('limited')
  @Throttle({ default: { ttl: 60, limit: 10 } })
  limitedEndpoint() {
    return { data: 'giới hạn tốc độ' };
  }

  @Get('open')
  @SkipThrottle()
  openEndpoint() {
    return { data: 'không giới hạn tốc độ' };
  }
}
```

## Giới hạn tốc độ cấp Controller

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

## Tạo khóa tùy chỉnh

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

## Tùy chọn lưu trữ

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

## Header phản hồi

Phản hồi giới hạn tốc độ bao gồm header:
- `X-RateLimit-Limit`: Yêu cầu tối đa
- `X-RateLimit-Remaining`: Yêu cầu còn lại
- `X-RateLimit-Reset`: Dấu thời gian đặt lại