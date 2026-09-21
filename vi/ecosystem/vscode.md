# Tiện ích VS Code

Hỗ trợ IDE với đoạn mã, tự động hoàn thành và xác thực cho Orbit.

## Cài đặt

Tìm kiếm "Orbit" trong kho tiện ích VS Code, hoặc cài đặt từ VSIX:

```bash
code --install-extension orbit-vscode-0.1.0.vsix
```

## Tính năng

### Đoạn mã

Nhập tiền tố và nhấn Tab để chèn đoạn mã:

| Tiền tố | Mô tả |
|---------|------|
| `bg-module` | Tạo một module |
| `bg-controller` | Tạo một controller |
| `bg-service` | Tạo một service |
| `bg-guard` | Tạo một guard |
| `bg-pipe` | Tạo một pipe |
| `bg-interceptor` | Tạo một interceptor |
| `bg-middleware` | Tạo middleware |
| `bg-filter` | Tạo bộ lọc ngoại lệ |

#### Đoạn mã Module

```typescript
// Nhập: bg-module + Tab
@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class ${1:Name}Module {}
```

#### Đoạn mã Controller

```typescript
// Nhập: bg-controller + Tab
@Controller('${1:path}')
export class ${2:Name}Controller {
  constructor(private readonly ${3:service}: ${4:Service}) {}

  @Get()
  findAll() {
    return this.${3:service}.findAll();
  }
}
```

### Tự động hoàn thành Decorator

Nhấn `@` để xem các decorator có sẵn:

- `@Module` - Decorator module
- `@Controller` - Decorator controller
- `@Injectable` - Decorator injectable
- `@Get`, `@Post`, `@Put`, `@Delete`, `@Patch` - Decorator route
- `@UseGuards`, `@UsePipes`, `@UseInterceptors` - Decorator pipeline

### Chẩn đoán

Xác thực decorator theo thời gian thực:

- Cảnh báo khi controller không có provider
- Xác thực cấu trúc module
- Kiểm tra các lỗi phổ biến

### Lệnh

Truy cập qua Bảng lệnh (Ctrl+Shift+P / Cmd+Shift+P):

| Lệnh | Mô tả |
|------|------|
| `Orbit: Generate Module` | Tạo một module mới |
| `Orbit: Generate Controller` | Tạo một controller mới |
| `Orbit: Generate Service` | Tạo một service mới |
| `Orbit: Show DI Graph` | Hiển thị đồ thị tiêm phụ thuộc |
| `Orbit: Show Routes` | Xem tất cả route của ứng dụng |

### Cấu hình

Cài đặt (File > Preferences > Settings):

```json
{
  "orbit.enableDiagnostics": true,
  "orbit.showInlineHints": true,
  "orbit.formatOnSave": false
}
```

## Thêm đoạn mã

### GraphQL

| Tiền tố | Mô tả |
|---------|------|
| `bg-resolver` | Tạo một resolver |
| `bg-objecttype` | Tạo một ObjectType |
| `bg-inputtype` | Tạo một InputType |

### Microservices

| Tiền tố | Mô tả |
|---------|------|
| `bg-handler` | Tạo bộ xử lý tin nhắn |
| `bg-gateway` | Tạo WebSocket gateway |

### Kiểm thử

| Tiền tố | Mô tả |
|---------|------|
| `bg-test` | Tạo kiểm thử đơn vị |
| `bg-e2e-test` | Tạo kiểm thử e2e |

## Phím tắt bàn phím

- `Ctrl+Shift+G` (Windows/Linux) hoặc `Cmd+Shift+G` (Mac): Tạo thành phần
- `Ctrl+Shift+R` (Windows/Linux) hoặc `Cmd+Shift+R` (Mac): Hiển thị route

## Mẹo

1. **Tạo Module nhanh**: Sử dụng đoạn mã `bg-module` và điền tên
2. **Thêm Route**: Đặt con trỏ trong controller, sử dụng `bg-get` hoặc `bg-post`
3. **Xem Phụ thuộc**: Sử dụng "Show DI Graph" để hiển thị cấu trúc module
4. **Gỡ lỗi Route**: Sử dụng "Show Routes" để xem tất cả endpoint đã đăng ký