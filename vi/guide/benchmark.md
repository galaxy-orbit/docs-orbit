# Benchmark hiệu năng

Orbit được đo hiệu năng thực tế so với các framework JS phổ biến: **Elysia, Hono, Fastify, Express, NestJS (Express/Fastify)**. Bộ benchmark hoàn chỉnh nằm trong repo [orbit-cli](https://github.com/galaxy-orbit/orbit-cli) — bạn có thể tải về và tự chạy trên máy của mình.

## Yêu cầu

- **Bun ≥ 1.2** (khuyến nghị 1.3.x) — chạy Orbit, Elysia, Hono
- **Node.js ≥ 22.5** — chạy Express, Fastify, NestJS (cần module `node:sqlite` tích hợp sẵn)
- `autocannon` tự tải qua `npx` ở lần chạy đầu

## Cài đặt và chạy

```bash
git clone https://github.com/galaxy-orbit/orbit-cli.git
cd orbit-cli/benchmarks
bun install
bun run src/runner.ts                          # full suite
bun run src/runner.ts --duration=5             # chạy nhanh 5s/scenario
bun run src/runner.ts --scenario=db-sqlite     # một scenario cụ thể
bun run src/runner.ts --connections=50 --duration=5  # tải cao hơn
```

Kết quả được lưu vào `benchmarks/results/` dạng JSON + Markdown, bao gồm cả cold start và bộ nhớ (RSS).

## Các kịch bản đo

| Scenario | Mô tả | Mức độ |
|---|---|---|
| `hello-world` | JSON response đơn giản | Đơn giản |
| `json-serialization` | Object lồng nhau phức tạp | Đơn giản |
| `path-params` | Route động `/users/:id` | Trung bình |
| `query-params` | Parse nhiều query string | Trung bình |
| `body-parsing` | POST với JSON body | Trung bình |
| `db-sqlite` | SELECT thật qua SQLite (bun:sqlite / node:sqlite) | Nâng cao |

## Kết quả sau tối ưu (macOS, Bun 1.3.14, Node 24.1)

> **Khách quan:** mọi framework trong suite đều không bật security headers mặc định (helmet/secure-headers là plugin opt-in) — benchmark chạy Orbit với `security: false` để cùng điều kiện. Core Orbit vẫn giữ security headers mặc định cho người dùng thật. Số liệu dưới đây dùng **orbit-core 0.2.1**.

### Requests/sec — càng cao càng tốt (đậm = cao nhất)

| Scenario | Orbit | Elysia | Hono | Fastify | NestJS Fastify | NestJS Express | Express |
|---|---|---|---|---|---|---|---|
| hello-world | **25,320** | 20,695 | 19,591 | 14,321 | 12,139 | 8,974 | 9,269 |
| json-serialization | **25,211** | 13,738 | 16,980 | 7,978 | 15,666 | 8,881 | 8,616 |
| path-params | **21,945** | 18,278 | 15,536 | 10,918 | 13,995 | 8,828 | 10,487 |
| query-params | **21,438** | 16,788 | 17,574 | 12,302 | 14,404 | 8,016 | 8,817 |
| body-parsing | **18,622** | 17,560 | 10,514 | 9,782 | 10,932 | 6,421 | 6,295 |
| db-sqlite | **23,528** | 14,444 | 12,306 | 10,502 | 11,482 | 9,870 | 9,737 |

### Cold start và bộ nhớ

| Framework | Cold start | RSS |
|---|---|---|
| Hono | 109ms | 27.3MB |
| **Orbit** | **136ms** | **26.8MB** |
| Elysia | 217ms | 41.7MB |
| Express | 426ms | 50.4MB |
| Fastify | 625ms | 59.7MB |
| NestJS Fastify | 1,031ms | 86.1MB |
| NestJS Express | 1,134ms | 84.3MB |

## Orbit đã tối ưu như thế nào?

Trước phiên bản 0.2.1, điều tra bằng micro-benchmark chỉ ra 4 điểm nghẽn; tất cả đã được sửa trong core:

1. **`new URL(request.url)` mỗi request** (~1.0ms/req) → parse pathname thủ công bằng `indexOf`/`slice` (~0.04ms/req, nhanh hơn ~25×).
2. **`withSecureHeaders` clone `Headers` mỗi response** (~1.6ms/req) → set header in-place vì Response do pipeline tạo có headers mutable; chỉ clone khi Response bất immutable (từ `fetch()`).
3. **Route matching tuyến tính** → static route index O(1) bằng Map; route có `:param` giữ matcher đầy đủ.
4. **`resolveParams` parse query/body/headers dư thừa** → lazy-parse chỉ khi handler khai báo decorator tương ứng; thêm cache pipeline metadata thay vì 8 lần `Reflect.getMetadata` mỗi request.

Kết quả: +6% đến +47% req/s tùy scenario so với bản trước, dẫn đầu 6/6 scenarios trong lần chạy mới nhất — nhanh hơn NestJS Express ~2.3–3.2×, hơn NestJS Fastify ~1.7–2.1×, và vượt cả các micro framework (Elysia, Hono).
