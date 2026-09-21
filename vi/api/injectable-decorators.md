# Decorator Có thể tiêm

Decorator cho tiêm phụ thuộc.

## @Injectable

Đánh dấu một class là provider có thể tiêm.

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';

@Injectable()
export class UsersService {
  findAll() {
    return [];
  }
}
```

### Tùy chọn Phạm vi

```typescript
import { Injectable, Scope } from '@galaxy-stack/orbit-common';

@Injectable({ scope: Scope.DEFAULT })
export class SingletonService {}

@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {}

@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {}
```

## @Inject

Tiêm một provider bằng token.

```typescript
import { Inject } from '@galaxy-stack/orbit-common';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: DatabaseConnection,
    @Inject(ConfigService) private config: ConfigService,
  ) {}
}
```

## @Optional

Đánh dấu một phụ thuộc là tùy chọn.

```typescript
import { Optional, Inject } from '@galaxy-stack/orbit-common';

@Injectable()
export class NotificationService {
  constructor(
    @Optional() @Inject('EMAIL_SERVICE') private emailService?: EmailService,
  ) {}

  notify(message: string) {
    if (this.emailService) {
      this.emailService.send(message);
    }
  }
}
```

## Token tiêm tùy chỉnh

```typescript
import { InjectionToken } from '@galaxy-stack/orbit-core';

export const CONFIG = new InjectionToken<AppConfig>('CONFIG');
export const LOGGER = new InjectionToken<Logger>('LOGGER');

@Module({
  providers: [
    {
      provide: CONFIG,
      useValue: { apiUrl: 'https://api.example.com' },
    },
    {
      provide: LOGGER,
      useFactory: () => new ConsoleLogger(),
    },
  ],
})
export class AppModule {}

@Injectable()
export class ApiService {
  constructor(
    @Inject(CONFIG) private config: AppConfig,
    @Inject(LOGGER) private logger: Logger,
  ) {}
}
```

## Tham chiếu chuyển tiếp

Xử lý phụ thuộc vòng tròn.

```typescript
import { forwardRef, Inject } from '@galaxy-stack/orbit-common';

@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => DogsService)) private dogsService: DogsService,
  ) {}
}
```