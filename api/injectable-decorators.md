# Injectable Decorators

Decorators for dependency injection.

## @Injectable

Mark a class as injectable provider.

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';

@Injectable()
export class UsersService {
  findAll() {
    return [];
  }
}
```

### Scope Options

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

Inject a provider by token.

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

Mark a dependency as optional.

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

## Custom Injection Tokens

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

## Forward Reference

Handle circular dependencies.

```typescript
import { forwardRef, Inject } from '@galaxy-stack/orbit-common';

@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => DogsService)) private dogsService: DogsService,
  ) {}
}
```
