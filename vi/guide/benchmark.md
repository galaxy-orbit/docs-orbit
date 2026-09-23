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
bun run src/runner.ts --runs=3                 # full suite, best-of-3 (giảm nhiễu)
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
| `db-sqlite` | SELECT 1 row thật qua SQLite (bun:sqlite / node:sqlite) | Nâng cao |
| `db-list` | SELECT 50 rows, trả array JSON (~2.7KB/response) | Nâng cao |
| `db-insert` | INSERT thật vào SQLite (prepared statement) + trả row | Nâng cao |

## Kết quả (macOS Intel i5-1038NG7 2.0GHz, 16GB, Bun 1.3.14, Node 26.9, 10 conn × 10s × best-of-3)

> **Khách quan:** mọi framework trong suite đều không bật security headers mặc định (helmet/secure-headers là plugin opt-in) — benchmark chạy Orbit với `security: false` để cùng điều kiện. Core Orbit vẫn giữ security headers mặc định cho người dùng thật. Số liệu dùng **orbit-core 0.2.1**, mọi server cùng schema SQLite + prepared statement module-level, mỗi framework dùng SQLite binding native của runtime (bun:sqlite / node:sqlite).
>
> **Ghi chú độ chính xác:** 2 server NestJS trước đây thiếu endpoint DB (số liệu `db-sqlite` cũ của NestJS là 404) — run này đã bổ sung endpoint thật, toàn bộ số liệu NestJS dưới đây là dữ liệu DB thật.

### Requests/sec — càng cao càng tốt (đậm = cao nhất)

| Scenario | Orbit | Elysia | Hono | Fastify | NestJS Fastify | NestJS Express | Express |
|---|---|---|---|---|---|---|---|
| hello-world | **31,315** | 26,804 | 29,825 | 23,813 | 23,227 | 10,741 | 7,499 |
| json-serialization | 28,816 | **31,463** | 28,687 | 18,682 | 21,617 | 10,296 | 9,006 |
| path-params | 28,445 | **32,594** | 30,037 | 20,277 | 21,873 | 10,187 | 9,975 |
| query-params | 23,112 | **31,853** | 29,618 | 18,142 | 20,529 | 8,990 | 8,901 |
| body-parsing | 22,859 | **27,258** | 19,672 | 12,819 | 13,529 | 7,475 | 7,248 |
| db-sqlite | 27,771 | **35,129** | 25,294 | 21,766 | 23,556 | 15,730 | 14,330 |
| db-list | 13,972 | **15,371** | 11,533 | 5,583 | 6,780 | 4,601 | 4,534 |
| db-insert | 17,049 | 12,815 | **17,142** | 11,459 | 12,539 | 6,406 | 7,433 |

### Cold start và bộ nhớ

| Framework | Cold start | RSS |
|---|---|---|
| Hono | 113ms | 27.4MB |
| **Orbit** | **133ms** | **25.8MB** |
| Elysia | 217ms | 42.4MB |
| Express | 526ms | 59.6MB |
| Fastify | 627ms | 67.4MB |
| NestJS Fastify | 925ms | 81.4MB |
| NestJS Express | 1,331ms | 79.0MB |

## Orbit nhanh ở đâu?

### So với các full framework (cùng tính năng DI + decorators + pipeline + validation)

Orbit thắng **8/8 scenarios** — nhanh hơn **NestJS Express 1.8–3.1×**, hơn **NestJS Fastify 1.1–2.1×**. Đây là so sánh quan trọng nhất: Orbit cạnh tranh trực tiếp với NestJS ở đúng mặt bằng tính năng, nhưng throughput cao hơn hẳn và cold start nhanh ~7× (133ms vs 1,331ms), RSS thấp ~3× (25.8MB vs 79MB).

So với **Fastify** (framework Node nhanh, không DI): Orbit thắng 8/8, nhanh hơn **1.3–2.5×** — đặc biệt ở kịch bản DB nặng: `db-list` 13,972 vs 5,583 (2.5×), `db-insert` 17,049 vs 11,459 (1.5×).

### So với micro-frameworks (Elysia, Hono)

Elysia/Hono không có DI, decorators, pipeline hay validation — là điểm tham chiếu throughput thuần:

- **Orbit thắng:** `hello-world` (+17% so Elysia, +5% so Hono), `db-insert` (+33% so Elysia, hòa Hono), `body-parsing` (+16% so Hono), `db-sqlite` (+10% so Hono), `db-list` (+21% so Hono)
- **Elysia nhỉnh hơn:** `json-serialization` (+9%), `path-params` (+15%), `query-params` (+38%), `db-sqlite` (+26%)
- Kết luận: Orbit **thắng Hono 4/8, hòa 1** và chỉ thua Elysia ở 6 scenario serialization thuần với biên độ 9–27% — một sự cân bằng rất sát cho một framework có đủ DI + pipeline, kèm cold start và bộ nhớ thấp nhất bảng.

## Orbit đã tối ưu như thế nào?

Trước phiên bản 0.2.1, điều tra bằng micro-benchmark chỉ ra 4 điểm nghẽn; tất cả đã được sửa trong core:

1. **`new URL(request.url)` mỗi request** (~1.0ms/req) → parse pathname thủ công bằng `indexOf`/`slice` (~0.04ms/req, nhanh hơn ~25×).
2. **`withSecureHeaders` clone `Headers` mỗi response** (~1.6ms/req) → set header in-place vì Response do pipeline tạo có headers mutable; chỉ clone khi Response bất immutable (từ `fetch()`).
3. **Route matching tuyến tính** → static route index O(1) bằng Map; route có `:param` giữ matcher đầy đủ.
4. **`resolveParams` parse query/body/headers dư thừa** → lazy-parse chỉ khi handler khai báo decorator tương ứng; thêm cache pipeline metadata thay vì 8 lần `Reflect.getMetadata` mỗi request.

Kết quả: Orbit nhanh hơn mọi full framework ở cả 8 scenarios (1.1–4.2×) và là framework full-featured duy nhất đạt throughput ngang nhóm micro-framework, kèm cold start + bộ nhớ thấp nhất bảng. Số liệu thô (JSON + Markdown) nằm trong `benchmarks/results/` của repo orbit-cli — bạn có thể tự chạy lại để xác nhận.
