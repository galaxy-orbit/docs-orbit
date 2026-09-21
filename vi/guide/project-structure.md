# Cấu trúc dự án

Một dự án Orbit điển hình tuân theo cấu trúc mô-đun tương tự như NestJS.

## Cấu trúc cơ bản

```
my-app/
├── src/
│   ├── app.module.ts       # Module gốc
│   ├── app.controller.ts   # Controller gốc
│   ├── app.service.ts      # Service gốc
│   ├── main.ts             # Điểm vào ứng dụng
│   └── modules/
│       ├── users/
│       │   ├── users.module.ts
│       │   ├── users.controller.ts
│       │   ├── users.service.ts
│       │   └── dto/
│       │       └── create-user.dto.ts
│       └── posts/
│           ├── posts.module.ts
│           ├── posts.controller.ts
│           └── posts.service.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── package.json
├── tsconfig.json
└── bunfig.toml
```

## Điểm vào

```typescript
// src/main.ts
import { BunFactory } from '@galaxy-stack/orbit-core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await BunFactory.create(AppModule);
  await app.listen(3000);
  console.log('Máy chủ chạy tại http://localhost:3000');
}

bootstrap();
```

## Module gốc

```typescript
// src/app.module.ts
import { Module } from '@galaxy-stack/orbit-common';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [UsersModule, PostsModule],
})
export class AppModule {}
```

## Module tính năng

```typescript
// src/modules/users/users.module.ts
import { Module } from '@galaxy-stack/orbit-common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

## Thực hành tốt nhất

1. **Một module cho mỗi tính năng** - Giữ chức năng liên quan вместе
2. **Module chia sẻ** - Tạo module chia sẻ cho các tiện ích chung
3. **DTO** - Sử dụng Data Transfer Objects để xác thực đầu vào
4. **Phân tách mối quan tâm** - Controller xử lý HTTP, service xử lý logic nghiệp vụ