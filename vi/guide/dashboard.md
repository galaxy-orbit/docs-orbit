# Dashboard (orbit-devtools)

Orbit đi kèm **dashboard web** hiển thị thời gian thực: routes, metrics, logs, đồ thị module và event-bus. Dashboard nằm trong repo chính tại `apps/dashboard` (Vite + React SPA) và phục vụ dữ liệu từ package `@galaxy-stack/orbit-devtools`.

## Cài đặt và chạy (phát triển)

```bash
# Bước 1: bật devtools trong ứng dụng Orbit của bạn (xem bên dưới)
# Bước 2: chạy dashboard ở chế độ dev
cd apps/dashboard
bun install
bun run dev
```

Dashboard chạy tại `http://localhost:5174`, tự proxy API tới ứng dụng Orbit tại `http://localhost:3000` (cấu hình sẵn trong `vite.config.ts`).

## Bật devtools trong ứng dụng

```typescript
import { createDevtools } from '@galaxy-stack/orbit-devtools';

const devtools = createDevtools({
  title: 'Devtools ứng dụng của tôi',
  path: '/__devtools',
  theme: 'auto',
});

// Gắn handler vào app Orbit của bạn
app.get('/__devtools*', devtools.createHandler());
```

Truy cập bản dựng tích hợp sẵn tại `http://localhost:3000/__devtools` (không cần chạy Vite).

## Cung cấp dữ liệu cho dashboard

Dashboard đọc dữ liệu từ các endpoint `/__devtools/api/*` mà package devtools cung cấp. Bạn cần "gắn" dữ liệu vào devtools:

### Routes

```typescript
devtools.setRoutes(app.getRoutes()); // RouteDefinition[] từ OrbitApplication
```

### Module graph

```typescript
devtools.setModules(app.modules); // cây module đã compile
```

### Request telemetry

Mỗi request được xử lý qua `OrbitFactory.create()` tự động phát telemetry (method, path, status, durationMs). Devtools thu thập qua listener `onRequestTelemetry()` — bạn không cần làm gì thêm nếu dùng `BunFactory.create()`.

## Các tính năng dashboard

| Tab | Chức năng |
|---|---|
| **Overview** | req/s, latency trung bình, error rate, memory, CPU theo thời gian thực (ECharts) |
| **Routes** | Danh sách endpoint, số lần gọi, avg duration, status cuối |
| **Logs** | Log stream thời gian thực qua EventSource |
| **Explorer** | Đồ thị module (module graph), event-bus wiring, GraphQL schema graph |
| **GraphQL** | Trực quan schema và resolver |

## Build production

```bash
cd apps/dashboard
bun run build     # xuất dist/ — nhúng vào app Orbit hoặc host tĩnh
```

Build output tại `apps/dashboard/dist/` — bạn có thể phục vụ bằng `app.useStaticAssets()` của Orbit hoặc bất kỳ CDN/静态 host nào.

## Khắc phục sự cố

**Dashboard trắng / không có dữ liệu:** kiểm tra devtools đã được gắn vào app với đúng `path: '/__devtools'` và ứng dụng Orbit đang chạy ở port 3000 (hoặc sửa `target` trong `vite.config.ts` cho khớp port của bạn).

**EventSource logs không kết nối:** proxy Vite chỉ hoạt động ở chế độ dev. Ở production, đảm bảo app Orbit serve cả SPA và API cùng origin.
