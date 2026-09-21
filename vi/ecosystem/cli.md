# Orbit CLI

Giao diện dòng lệnh chính thức cho Orbit.

## Cài đặt

```bash
# Cài đặt toàn cục
bun add -g orbit

# Hoặc sử dụng với bunx
orbit <lệnh>
```

## Tham chiếu nhanh

| Lệnh | Mô tả |
|------|------|
| `orbit new <tên>` | Tạo dự án mới |
| `orbit generate <loại> <tên>` | Tạo thành phần |
| `orbit dev` | Khởi động máy chủ phát triển |
| `orbit build` | Xây dựng cho sản xuất |
| `orbit test` | Chạy kiểm thử |

## Tạo dự án

```bash
orbit new my-app
cd my-app
bun run dev
```

Tùy chọn:
- `--skip-git` - Bỏ qua khởi tạo git
- `--skip-install` - Bỏ qua cài đặt phụ thuộc

## Tạo mã

### Controller

```bash
orbit generate controller users
# Tạo: src/users/users.controller.ts
```

### Service

```bash
orbit generate service users
# Tạo: src/users/users.service.ts
```

### Module

```bash
orbit generate module users
# Tạo: src/users/users.module.ts
```

### Tài nguyên (CRUD)

```bash
orbit generate resource users
# Tạo:
#   src/users/users.module.ts
#   src/users/users.controller.ts
#   src/users/users.service.ts
#   src/users/dto/create-user.dto.ts
#   src/users/dto/update-user.dto.ts
#   src/users/entities/user.entity.ts
```

### Thành phần khác

```bash
orbit generate guard auth
orbit generate pipe validation
orbit generate interceptor logging
orbit generate middleware logger
orbit generate filter http-exception
```

### Tùy chọn tạo

```bash
# Chỉ định đường dẫn
orbit g controller users --path src/modules/users

# Cấu trúc phẳng (không có thư mục con)
orbit g service users --flat

# Bỏ qua file kiểm thử
orbit g controller users --no-spec

# Chạy thử (xem trước)
orbit g module users --dry-run
```

## Máy chủ phát triển

```bash
orbit dev
```

Tính năng:
- Hot Module Replacement (HMR)
- Biên dịch nhanh với Bun.Transpiler
- Tự động khởi động lại khi có thay đổi

Tùy chọn:
- `--port <số>` - Số cổng (mặc định: 3000)
- `--host <chuỗi>` - Địa chỉ máy chủ (mặc định: localhost)

## Xây dựng

```bash
orbit build
```

Tùy chọn:
- `--outdir <đường dẫn>` - Thư mục đầu ra (mặc định: dist)
- `--minify` - Rút gọn đầu ra

## Kiểm thử

```bash
orbit test
```

Tùy chọn:
- `--watch` - Chế độ theo dõi
- `--coverage` - Tạo báo cáo phủ sóng

## Thành phần GraphQL

```bash
# Tạo resolver
orbit generate resolver users

# Tạo tài nguyên GraphQL hoàn chỉnh
orbit generate graphql-resource users
```

## Thành phần Microservice

```bash
# Tạo bộ xử lý tin nhắn
orbit generate handler notifications

# Tạo tài nguyên microservice
orbit generate microservice-resource orders
```

## Bí danh

| Lệnh đầy đủ | Bí danh |
|-------------|---------|
| `generate` | `g` |
| `controller` | `co` |
| `service` | `s` |
| `module` | `mo` |
| `resource` | `res` |
| `guard` | `gu` |
| `pipe` | `pi` |
| `interceptor` | `itc` |
| `middleware` | `mi` |
| `filter` | `f` |

Ví dụ:

```bash
orbit g res users  # Tương đương: orbit generate resource users
```

## Công cụ di chuyển NestJS

CLI bao gồm một công cụ di chuyển mạnh mẽ để giúp bạn chuyển đổi từ dự án NestJS sang Orbit.

### Phân tích dự án

Trước khi di chuyển, hãy phân tích dự án của bạn để kiểm tra tính tương thích:

```bash
orbit migrate analyze ./my-nestjs-app
```

Điều này sẽ hiển thị:
- Phụ thuộc NestJS được tìm thấy và các phiên bản Orbit tương ứng
- Số lượng file TypeScript cần xử lý
- Các mục cần xem xét thủ công (TypeORM, Passport, bcrypt, v.v.)
- Điểm số tương thích di chuyển tổng thể

### Di chuyển toàn bộ

Di chuyển toàn bộ dự án của bạn:

```bash
# Xem trước các thay đổi mà không sửa đổi file
orbit migrate ./my-nestjs-app --dry-run

# Áp dụng di chuyển
orbit migrate ./my-nestjs-app

# Bỏ qua việc tạo file sao lưu
orbit migrate ./my-nestjs-app --skip-backup

# Đầu ra chi tiết
orbit migrate ./my-nestjs-app --verbose
```

### Chỉ di chuyển import

Nếu bạn chỉ muốn cập nhật câu lệnh import:

```bash
orbit migrate imports ./my-nestjs-app
orbit migrate imports ./my-nestjs-app --dry-run
```

### Những gì được di chuyển

#### Chuyển đổi tự động

| Trước | Sau |
|-------|-----|
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
| `NestFactory.create()` | `BunFactory.create()` |
| `NestFactory.createMicroservice()` | `BunFactory.createMicroservice()` |

#### Chuyển đổi mã

```typescript
// Trước
import { NestFactory } from '@nestjs/core';
const app = await NestFactory.create(AppModule);

// Sau
import { BunFactory } from '@galaxy-stack/orbit-core';
const app = await BunFactory.create(AppModule);
```

```typescript
// Trước
import * as bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 10);
const valid = await bcrypt.compare(password, hash);

// Sau
const hash = await Bun.password.hash(password);
const valid = await Bun.password.verify(password, hash);
```

#### Cập nhật Package.json

Công cụ di chuyển sẽ:
- Thay thế phụ thuộc `@nestjs/*` bằng các phiên bản `@galaxy-stack/orbit-*` tương ứng
- Thêm `reflect-metadata` nếu chưa có
- Xóa `@nestjs/cli` và `@nestjs/schematics`
- Thêm `@galaxy-stack/orbit-testing` như phụ thuộc phát triển

### Các mục cần xem xét thủ công

Công cụ di chuyển sẽ cảnh báo bạn về các mẫu sau:

| Mẫu | Hành động được đề xuất |
|-----|------------------------|
| Sử dụng TypeORM | Di chuyển sang Drizzle ORM với `@galaxy-stack/orbit-database` |
| Sử dụng Mongoose | Di chuyển sang Drizzle MongoDB |
| PassportStrategy | Sử dụng guard `@galaxy-stack/orbit-auth` thay thế |
| class-validator | Sử dụng Zod với `@galaxy-stack/orbit-validation` |
| Kiểu dành riêng cho nền tảng | Xem xét việc sử dụng Bun.serve() |

### Các bước sau khi di chuyển

1. Cài đặt phụ thuộc:
   ```bash
   bun install
   ```

2. Cập nhật `tsconfig.json` nếu cần:
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

### Ví dụ di chuyển

#### Di chuyển Module hoàn chỉnh

```typescript
// Trước (NestJS)
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({...}),
  ],
})
export class AppModule {}

// Sau (Orbit)
import { Module } from '@galaxy-stack/orbit-core';
import { ConfigModule } from '@galaxy-stack/orbit-config';
import { DatabaseModule } from '@galaxy-stack/orbit-database';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot({...}),
  ],
})
export class AppModule {}
```

#### Di chuyển xác thực

```typescript
// Trước (NestJS + Passport)
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {}

// Sau (Orbit)
import { UseGuards } from '@galaxy-stack/orbit-common';
import { JwtAuthGuard } from '@galaxy-stack/orbit-auth';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {}
```

Xem [Hướng dẫn di chuyển](/guide/migration) để biết thêm hướng dẫn chi tiết.