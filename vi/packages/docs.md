# @galaxy-stack/orbit-docs

Sân chơi API tương tác và trình tạo SDK TypeScript.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-docs
```

## Tính năng

- Sân chơi API tương tác
- Tạo SDK TypeScript
- Tích hợp OpenAPI
- Ví dụ yêu cầu/phản hồi
- Kiểm tra xác thực

## Thiết lập

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { DocsModule } from '@galaxy-stack/orbit-docs';

@Module({
  imports: [
    DocsModule.forRoot({
      title: 'API của tôi',
      description: 'Tài liệu API',
      version: '1.0.0',
    }),
  ],
})
export class AppModule {}
```

## Sân chơi API

Truy cập sân chơi tương tác tại `/docs/playground`.

Tính năng:
- Thực thi yêu cầu API trực tiếp
- Xem thời gian phản hồi và header
- Lưu bộ sưu tập yêu cầu
- Quản lý header xác thực

## Tạo SDK

```typescript
import { SdkGenerator } from '@galaxy-stack/orbit-docs';

const generator = new SdkGenerator({
  input: './openapi.json',
  output: './sdk',
  language: 'typescript',
});

await generator.generate();
```

## Sử dụng SDK đã tạo

```typescript
import { ApiClient } from './sdk';

const client = new ApiClient({
  baseUrl: 'https://api.example.com',
  headers: {
    Authorization: 'Bearer token',
  },
});

const users = await client.users.findAll();
const user = await client.users.create({ name: 'John', email: 'john@example.com' });
```

## Cấu hình

```typescript
DocsModule.forRoot({
  title: 'API của tôi',
  version: '1.0.0',
  servers: [
    { url: 'https://api.example.com', description: 'Sản xuất' },
    { url: 'http://localhost:3000', description: 'Phát triển' },
  ],
  auth: {
    type: 'bearer',
    description: 'Token JWT',
  },
})
```