# Module

Module là các khối xây dựng cơ bản của ứng dụng Orbit. Chúng giúp tổ chức mã nguồn thành các khối chức năng gắn kết.

## Tổng quan

Module là một lớp được trang trí bằng `@Module()` cung cấp metadata về cách cấu trúc ứng dụng.

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

## Tùy chọn Decorator Module

| Thuộc tính | Mô tả |
|----------|-------------|
| `imports` | Danh sách module để nhập |
| `controllers` | Controller cần khởi tạo |
| `providers` | Provider cần khởi tạo bởi container DI |
| `exports` | Provider có sẵn trong các module khác |

## Module tính năng

Tổ chức ứng dụng theo tính năng:

```typescript
// users/user.module.ts
@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}

// posts/post.module.ts
@Module({
  imports: [UserModule], // Nhập UserModule để sử dụng UserService
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
```

## Module gốc

Mỗi ứng dụng có một module gốc:

```typescript
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(),
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
```

## Module toàn cục

Sử dụng `global: true` để làm cho provider có sẵn ở mọi nơi:

```typescript
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
  global: true,
})
export class ConfigModule {}
```

## Module động

Tạo module có thể cấu hình:

```typescript
@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
      global: true,
    };
  }
}
```

## Xuất lại Module

Xuất lại các module đã nhập:

```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule], // Xuất lại để các module nhập có thể sử dụng CommonModule
})
export class CoreModule {}
```

## Tham chiếu xuôi

Xử lý các phụ thuộc vòng tròn:

```typescript
import { forwardRef } from '@galaxy-stack/orbit-core';

@Module({
  imports: [forwardRef(() => PostModule)],
})
export class UserModule {}
```