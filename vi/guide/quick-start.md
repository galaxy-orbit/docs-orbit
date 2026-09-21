# Bắt đầu nhanh

Hướng dẫn này sẽ giúp bạn tạo ứng dụng Orbit đầu tiên trong vài phút.

## Điều kiện tiên quyết

Đảm bảo bạn đã cài đặt [Bun](https://bun.sh):

```bash
curl -fsSL https://bun.sh/install | bash
```

Kiểm tra cài đặt:

```bash
bun --version
# Nên hiển thị 1.0.0 hoặc cao hơn
```

## Tạo dự án mới

### Sử dụng CLI (Khuyến nghị)

Cách nhanh nhất để bắt đầu là sử dụng Orbit CLI:

```bash
orbit new my-app
cd my-app
bun install
bun run dev
```

Điều này tạo ra cấu trúc dự án hoàn chỉnh với cấu hình TypeScript, các module mẫu và script phát triển.

### Thiết lập thủ công

Nếu bạn muốn thiết lập thủ công:

```bash
mkdir my-app && cd my-app
bun init -y

# Cài đặt các gói Orbit
bun add @galaxy-stack/orbit-core @galaxy-stack/orbit-common reflect-metadata

# Cài đặt phụ thuộc phát triển
bun add -d typescript @types/bun
```

Tạo `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true
  }
}
```

## Ứng dụng đầu tiên của bạn

Tạo `src/main.ts`:

```typescript
import 'reflect-metadata';
import { BunFactory, Module, Controller, Get, Injectable } from '@galaxy-stack/orbit-core';

// 1. Tạo một service
@Injectable()
class AppService {
  getHello(): string {
    return 'Hello Orbit!';
  }
}

// 2. Tạo một controller
@Controller()
class AppController {
  constructor(private appService: AppService) {}

  @Get()
  getHello() {
    return { message: this.appService.getHello() };
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}

// 3. Tạo module gốc
@Module({
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

// 4. Khởi động ứng dụng
async function bootstrap() {
  const app = await BunFactory.create(AppModule);
  await app.listen(3000);
  console.log('🚀 Máy chủ đang chạy tại http://localhost:3000');
}

bootstrap();
```

Chạy ứng dụng:

```bash
bun run src/main.ts
```

Kiểm tra:

```bash
curl http://localhost:3000
# {"message":"Hello Orbit!"}

curl http://localhost:3000/health
# {"status":"ok"}
```

## Thêm tính năng khác

### Thêm Module Người dùng

```typescript
// src/users/user.service.ts
import { Injectable } from '@galaxy-stack/orbit-core';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(data: Omit<User, 'id'>): User {
    const user = { id: this.users.length + 1, ...data };
    this.users.push(user);
    return user;
  }
}
```

```typescript
// src/users/user.controller.ts
import { Controller, Get, Post, Param, Body } from '@galaxy-stack/orbit-core';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id, 10));
  }

  @Post()
  create(@Body() body: { name: string; email: string }) {
    return this.userService.create(body);
  }
}
```

```typescript
// src/users/user.module.ts
import { Module } from '@galaxy-stack/orbit-core';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

Cập nhật module gốc của bạn:

```typescript
// src/main.ts
@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}
```

### Thêm xác thực

```bash
bun add @galaxy-stack/orbit-validation zod
```

```typescript
import { z } from 'zod';
import { UsePipes, ZodValidationPipe } from '@galaxy-stack/orbit-validation';

const CreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
});

@Controller('users')
export class UserController {
  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  create(@Body() body: z.infer<typeof CreateUserSchema>) {
    return this.userService.create(body);
  }
}
```

### Thêm cơ sở dữ liệu

```bash
bun add @galaxy-stack/orbit-database drizzle-orm
```

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { DatabaseModule } from '@galaxy-stack/orbit-database';

@Module({
  imports: [
    DatabaseModule.forRoot({
      type: 'postgresql',
      url: process.env.DATABASE_URL,
    }),
  ],
})
class AppModule {}
```

### Thêm xác thực người dùng

```bash
bun add @galaxy-stack/orbit-auth
```

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { AuthModule } from '@galaxy-stack/orbit-auth';

@Module({
  imports: [
    AuthModule.register({
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    }),
  ],
})
class AppModule {}
```

## Cấu trúc dự án

Cấu trúc dự án Orbit điển hình:

```
my-app/
├── src/
│   ├── main.ts              # Điểm vào của ứng dụng
│   ├── app.module.ts        # Module gốc
│   ├── app.controller.ts    # Controller gốc
│   ├── app.service.ts       # Service gốc
│   ├── users/
│   │   ├── user.module.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── dto/
│   │       └── create-user.dto.ts
│   └── common/
│       ├── guards/
│       ├── pipes/
│       └── interceptors/
├── test/
├── tsconfig.json
├── package.json
└── bun.lockb
```

## Chế độ phát triển

Để tải lại nhanh trong quá trình phát triển:

```bash
orbit dev
# hoặc
bun --watch run src/main.ts
```

## Các bước tiếp theo

- Tìm hiểu về [Module](/vi/guide/modules) để tổ chức mã nguồn
- Hiểu về [Tiêm phụ thuộc](/vi/guide/dependency-injection)
- Thêm [Guard](/vi/guide/guards) để xác thực
- Tích hợp [Cơ sở dữ liệu](/vi/guide/database)