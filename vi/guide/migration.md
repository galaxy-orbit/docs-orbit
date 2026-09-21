# Di chuyển từ NestJS

Orbit cung cấp công cụ di chuyển để giúp bạn chuyển đổi từ các dự án NestJS.

## Di chuyển tự động

### Phân tích dự án của bạn

Đầu tiên, phân tích dự án của bạn để kiểm tra tính tương thích:

```bash
orbit migrate analyze ./my-nestjs-app
```

Lệnh này sẽ hiển thị:
- Các phụ thuộc của NestJS và các tương đương trong Orbit
- Các file TypeScript cần cập nhật
- Các mục cần xem xét thủ công

### Chạy di chuyển

Di chuyển dự án của bạn:

```bash
# Xem trước thay đổi (chạy thử)
orbit migrate ./my-nestjs-app --dry-run

# Áp dụng thay đổi
orbit migrate ./my-nestjs-app
```

Công cụ di chuyển sẽ:
- Cập nhật các câu lệnh nhập từ `@nestjs/*` sang `@galaxy-stack/orbit-*`
- Thay đổi `NestFactory` thành `BunFactory`
- Cập nhật các phụ thuộc trong `package.json`
- Tạo các file sao lưu (`.bak`)

### Chỉ cập nhật nhập

Nếu bạn muốn chỉ cập nhật phần nhập:

```bash
orbit migrate imports ./my-nestjs-app
```

## Ánh xạ nhập

| NestJS | Orbit |
|--------|-----------|
| `@nestjs/common` | `@galaxy-stack/orbit-common` |
| `@nestjs/core` | `@galaxy-stack/orbit-core` |
| `@nestjs/config` | `@galaxy-stack/orbit-config` |
| `@nestjs/graphql` | `@galaxy-stack/orbit-graphql` |
| `@nestjs/microservices` | `@galaxy-stack/orbit-microservices` |
| `@nestjs/websockets` | `@galaxy-stack/orbit-websockets` |
| `@nestjs/schedule` | `@galaxy-stack/orbit-schedule` |
| `@nestjs/terminus` | `@galaxy-stack/orbit-terminus` |
| `@nestjs/throttler` | `@galaxy-stack/orbit-throttler` |
| `@nestjs/jwt` | `@galaxy-stack/orbit-auth` |
| `@nestjs/passport` | `@galaxy-stack/orbit-auth` |
| `@nestjs/cache-manager` | `@galaxy-stack/orbit-cache` |
| `@nestjs/swagger` | `@galaxy-stack/orbit-swagger` |
| `@nestjs/testing` | `@galaxy-stack/orbit-testing` |
| `@nestjs/platform-express` | `@galaxy-stack/orbit-platform-bun` |
| `@nestjs/platform-fastify` | `@galaxy-stack/orbit-platform-bun` |

## Di chuyển thủ công

### Cơ sở dữ liệu (TypeORM → Drizzle)

Orbit sử dụng Drizzle ORM thay vì TypeORM:

```typescript
// Trước (TypeORM)
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

// Sau (Drizzle)
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});
```

Mẫu Repository:

```typescript
// Trước (TypeORM)
@InjectRepository(User)
private userRepository: Repository<User>

// Sau (Drizzle)
@InjectDatabase()
private db: Database

async findAll() {
  return this.db.select().from(users);
}
```

### Xác thực (Passport → @galaxy-stack/orbit-auth)

```typescript
// Trước (Passport)
@UseGuards(AuthGuard('jwt'))

// Sau
import { JwtAuthGuard } from '@galaxy-stack/orbit-auth';

@UseGuards(JwtAuthGuard)
```

Dịch vụ JWT:

```typescript
// Trước
import { JwtService } from '@nestjs/jwt';

// Sau
import { JwtService } from '@galaxy-stack/orbit-auth';
```

### Băm mật khẩu (bcrypt → Bun.password)

```typescript
// Trước
import * as bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hash);

// Sau (native Bun)
const hash = await Bun.password.hash(password);
const isValid = await Bun.password.verify(password, hash);
```

### Xác thực (class-validator → Zod)

```typescript
// Trước
import { IsEmail, MinLength } from 'class-validator';

class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

// Sau
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type CreateUserDto = z.infer<typeof CreateUserSchema>;
```

### Bootstrap

```typescript
// Trước
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

const app = await NestFactory.create<NestExpressApplication>(AppModule);

// Sau
import { BunFactory } from '@galaxy-stack/orbit-core';

const app = await BunFactory.create(AppModule);
```

## Các bước sau khi di chuyển

1. Cài đặt các phụ thuộc:
   ```bash
   bun install
   ```

2. Cập nhật cấu hình TypeScript nếu cần:
   ```json
   {
     "compilerOptions": {
       "target": "ESNext",
       "module": "ESNext",
       "moduleResolution": "bundler",
       "experimentalDecorators": true,
       "emitDecoratorMetadata": true
     }
   }
   ```

3. Khởi động máy chủ phát triển:
   ```bash
   bun run dev
   ```

4. Chạy kiểm thử:
   ```bash
   bun test
   ```

## Ghi chú về tính tương thích

### Hoàn toàn tương thích
- Hệ thống module (`@Module`)
- Controllers và định tuyến
- Tiêm phụ thuộc
- Guards, Pipes, Interceptors
- Bộ lọc ngoại lệ
- GraphQL resolvers
- Mẫu microservice
- WebSocket gateways
- Lập lịch
- Kiểm tra sức khỏe

### Yêu cầu cập nhật thủ công
- TypeORM/Mongoose → Drizzle
- Chiến lược Passport → Orbit guards
- bcrypt → Bun.password
- class-validator → Zod
- Các tính năng đặc thù nền tảng

### Không được hỗ trợ
- Nest CLI schematics (sử dụng `orbit generate`)
- Nest DevTools (sử dụng `@galaxy-stack/orbit-devtools`)