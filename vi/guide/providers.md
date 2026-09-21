# Provider

Provider là khái niệm cơ bản trong hệ thống tiêm phụ thuộc của Orbit. Service, repository, factory và helper đều có thể là provider.

## Service cơ bản

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

## Kiểu Provider

### Class Provider

```typescript
@Module({
  providers: [UserService], // Viết tắt
})
export class UserModule {}

// Tương đương với:
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

### Value Provider

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

### Factory Provider

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

### Provider hiện có (Alias)

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

## Phạm vi tiêm

### Singleton (Mặc định)

Một instance được chia sẻ trên toàn ứng dụng:

```typescript
@Injectable()
export class ConfigService {}
```

### Phạm vi Yêu cầu

Instance mới cho mỗi yêu cầu:

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  constructor(@Inject(REQUEST) private request: Request) {}
}
```

### Phạm vi Tạm thời

Instance mới mỗi lần được tiêm:

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {}
```

## Phụ thuộc tùy chọn

```typescript
@Injectable()
export class UserService {
  constructor(
    @Optional() private logger?: LoggerService
  ) {}
}
```

## Token tiêm tùy chỉnh

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

## Phụ thuộc vòng tròn

Sử dụng `forwardRef()` để xử lý phụ thuộc vòng tròn:

```typescript
@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => PostService))
    private postService: PostService
  ) {}
}
```