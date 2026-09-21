# Tiêm phụ thuộc

Hệ thống Tiêm phụ thuộc (DI) của Orbit quản lý việc tạo và vòng đời của các thành phần trong ứng dụng của bạn.

## Cách hoạt động

Khi bạn sử dụng decorator `@Injectable()`, Orbit đăng ký lớp với container DI. Các tham số constructor được giải quyết tự động:

```typescript
@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private loggerService: LoggerService
  ) {}
}
```

Container:
1. Đọc kiểu tham số constructor thông qua phản chiếu
2. Giải quyết từng phụ thuộc một cách đệ quy
3. Tạo và lưu trữ các instance dựa trên phạm vi
4. Tiêm các phụ thuộc đã giải quyết

## Luồng giải quyết của Container

```
container.resolve(UserController)
        │
        ▼
┌─────────────────────┐
│ Lấy tham số         │
│ constructor         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐    ┌─────────────────────┐
│ Giải quyết mỗi      │───▶│ Giải quyết phụ      │ (đệ quy)
│ phụ thuộc           │    │ thuộc lồng nhau     │
└─────────┬───────────┘    └─────────┬───────────┘
          │                          │
          ▼                          ▼
┌──────────────────────────────────────────────────┐
│        Tạo instance với phụ thuộc đã giải        │
│                                                  │
│  new UserController(userService, authService)    │
└──────────────────────────────────────────────────┘
```

## Phương pháp đăng ký

### Sử dụng @Injectable()

```typescript
@Injectable()
export class UserService {}

@Module({
  providers: [UserService],
})
export class UserModule {}
```

### Sử dụng đối tượng Provider

```typescript
@Module({
  providers: [
    { provide: UserService, useClass: UserService },
    { provide: 'API_KEY', useValue: 'secret-key' },
    { 
      provide: 'CONNECTION', 
      useFactory: (config: ConfigService) => createConnection(config),
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
```

## Token tiêm

### Token lớp

```typescript
@Injectable()
export class UserService {}

// Tiêm bằng tham chiếu lớp
constructor(private userService: UserService) {}
```

### Token chuỗi

```typescript
{ provide: 'DATABASE_URL', useValue: 'postgres://...' }

// Tiêm với @Inject
constructor(@Inject('DATABASE_URL') private dbUrl: string) {}
```

### Token biểu tượng

```typescript
const DATABASE = Symbol('DATABASE');

{ provide: DATABASE, useFactory: createDb }

constructor(@Inject(DATABASE) private db: Database) {}
```

## Phạm vi

### Singleton (Mặc định)

```typescript
@Injectable() // hoặc @Injectable({ scope: Scope.DEFAULT })
export class ConfigService {}
```

- Được tạo một lần khi yêu cầu đầu tiên
- Cùng một instance được chia sẻ ở mọi nơi
- Tồn tại trong suốt vòng đời ứng dụng

### Yêu cầu

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestLogger {}
```

- Instance mới cho mỗi yêu cầu HTTP
- Truy cập ngữ cảnh yêu cầu
- Được thu hồi sau khi yêu cầu kết thúc

### Tạm thời

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class TemporaryService {}
```

- Instance mới mỗi lần tiêm
- Không bao giờ được chia sẻ
- Hữu ích cho các dịch vụ có trạng thái

## Bong bóng phạm vi

Khi một singleton phụ thuộc vào một provider có phạm vi yêu cầu, singleton sẽ trở thành có phạm vi yêu cầu:

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestContext {}

@Injectable() // Sẽ có phạm vi yêu cầu do phụ thuộc
export class UserService {
  constructor(private ctx: RequestContext) {}
}
```

## Provider bất đồng bộ

```typescript
{
  provide: 'DATABASE',
  useFactory: async () => {
    const connection = await createConnection();
    await connection.runMigrations();
    return connection;
  },
}
```

## Ranh giới Module

Provider mặc định là riêng tư. Sử dụng `exports` để chia sẻ:

```typescript
@Module({
  providers: [UserService],
  exports: [UserService], // Giờ có sẵn cho các module nhập vào
})
export class UserModule {}
```