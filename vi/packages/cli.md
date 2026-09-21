# orbit

Công cụ dòng lệnh để tạo khung và tạo mã.

## Cài đặt

```bash
bun add -g orbit
# hoặc sử dụng với bunx
orbit <lệnh>
```

## Lệnh

### Tạo Dự án Mới

```bash
orbit new my-app

# Tùy chọn
orbit new my-app --skip-git     # Bỏ qua khởi tạo git
orbit new my-app --skip-install # Bỏ qua cài đặt phụ thuộc
```

Cấu trúc được tạo:

```
my-app/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   └── app.service.ts
├── test/
│   └── app.e2e-spec.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Tạo Thành phần

```bash
# Tạo controller
orbit generate controller users
orbit g controller users  # viết tắt

# Tạo service
orbit generate service users
orbit g s users  # viết tắt

# Tạo module
orbit generate module users
orbit g mo users

# Tạo guard
orbit generate guard auth

# Tạo pipe
orbit generate pipe validation

# Tạo interceptor
orbit generate interceptor logging

# Tạo middleware
orbit generate middleware logger

# Tạo filter
orbit generate filter http-exception

# Tạo tài nguyên hoàn chỉnh (CRUD)
orbit generate resource users
orbit g res users
```

### Tùy chọn Tạo

```bash
# Chỉ định thư mục
orbit g controller users --path src/modules/users

# Cấu trúc phẳng (không có thư mục)
orbit g service users --flat

# Bỏ qua file spec
orbit g controller users --no-spec

# Chạy thử (xem trước)
orbit g module users --dry-run
```

### Máy chủ Phát triển

```bash
orbit dev

# Với tùy chọn
orbit dev --port 3000
orbit dev --host 0.0.0.0
```

Tính năng:
- Tải lại nhanh với Bun.Transpiler
- Biên dịch file gần như tức thì
- Tự động khởi động lại khi file thay đổi

### Xây dựng

```bash
orbit build

# Tùy chọn
orbit build --outdir dist
orbit build --minify
```

### Kiểm thử

```bash
orbit test

# Tùy chọn
orbit test --watch
orbit test --coverage
orbit test src/users/
```

## Tạo GraphQL

```bash
# Tạo resolver
orbit generate resolver users

# Tạo tài nguyên GraphQL hoàn chỉnh
orbit generate graphql-resource users
```

File được tạo:
- `users.resolver.ts`
- `users.service.ts`
- `dto/create-user.input.ts`
- `dto/update-user.input.ts`
- `entities/user.entity.ts`

## Tạo Microservices

```bash
# Tạo bộ xử lý tin nhắn
orbit generate handler notifications

# Tạo tài nguyên microservice hoàn chỉnh
orbit generate microservice-resource orders
```

## Cấu hình

Tạo `orbit.json` trong thư mục gốc dự án:

```json
{
  "sourceRoot": "src",
  "generateOptions": {
    "spec": true,
    "flat": false
  },
  "compilerOptions": {
    "plugins": []
  }
}
```

## Sử dụng theo chương trình

```typescript
import { CLI } from 'orbit';

const cli = new CLI();

// Tạo thành phần
await cli.generate('controller', 'users', {
  path: 'src/modules/users',
  spec: true,
});

// Tạo dự án
await cli.createProject('my-app', {
  skipGit: false,
  skipInstall: false,
});
```

## Xuất khẩu

```typescript
export {
  CLI,
  NewCommand,
  GenerateCommand,
  DevCommand,
  BuildCommand,
  TestCommand,
};
```