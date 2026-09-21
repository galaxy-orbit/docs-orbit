# Providers

Providers are the fundamental concept in Orbit's dependency injection system. Services, repositories, factories, and helpers can all be providers.

## Basic Service

```typescript
import { Injectable } from '@galaxy-stack/orbit-core';

@Injectable()
export class UserService {
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(data: CreateUserDto): User {
    const user = { id: crypto.randomUUID(), ...data };
    this.users.push(user);
    return user;
  }
}
```

## Provider Types

### Class Providers

```typescript
@Module({
  providers: [UserService], // Shorthand
})
export class UserModule {}

// Equivalent to:
@Module({
  providers: [
    {
      provide: UserService,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
```

### Value Providers

```typescript
@Module({
  providers: [
    {
      provide: 'CONFIG',
      useValue: {
        apiUrl: 'https://api.example.com',
        timeout: 5000,
      },
    },
  ],
})
export class AppModule {}
```

### Factory Providers

```typescript
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (config: ConfigService) => {
        return await createConnection(config.get('DATABASE_URL'));
      },
      inject: [ConfigService],
    },
  ],
})
export class DatabaseModule {}
```

### Existing Providers (Aliases)

```typescript
@Module({
  providers: [
    UserService,
    {
      provide: 'AliasedUserService',
      useExisting: UserService,
    },
  ],
})
export class UserModule {}
```

## Injection Scopes

### Singleton (Default)

One instance shared across the entire application:

```typescript
@Injectable()
export class ConfigService {}
```

### Request Scope

New instance per request:

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  constructor(@Inject(REQUEST) private request: Request) {}
}
```

### Transient Scope

New instance every time it's injected:

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {}
```

## Optional Dependencies

```typescript
@Injectable()
export class UserService {
  constructor(
    @Optional() private logger?: LoggerService
  ) {}
}
```

## Custom Injection Tokens

```typescript
// tokens.ts
export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION');

// module.ts
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: () => createConnection(),
    },
  ],
})
export class DatabaseModule {}

// service.ts
@Injectable()
export class UserRepository {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: Connection
  ) {}
}
```

## Circular Dependencies

Use `forwardRef()` to handle circular dependencies:

```typescript
@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => PostService))
    private postService: PostService
  ) {}
}
```
