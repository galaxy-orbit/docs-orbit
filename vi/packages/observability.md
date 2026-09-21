# @galaxy-stack/orbit-observability

Truy vết OpenTelemetry và metric Prometheus cho hệ thống phân tán.

::: tip
Để ghi log độc lập, sử dụng [@galaxy-stack/orbit-logger](/packages/logger). Gói này cung cấp `StructuredLogger` với tích hợp **ID tương quan** cho truy vết phân tán.
:::

## Cài đặt

```bash
bun add @galaxy-stack/orbit-observability
```

## Truy vết

### Thiết lập

```typescript
import { TracingModule, Tracer } from '@galaxy-stack/orbit-observability';

@Module({
  imports: [
    TracingModule.forRoot({
      serviceName: 'my-service',
      exporter: 'console', // hoặc 'otlp', 'jaeger'
      sampler: { type: 'ratio', ratio: 0.1 }, // Lấy mẫu 10%
    }),
  ],
})
export class AppModule {}
```

### Sử dụng Tracer

```typescript
import { Injectable } from '@galaxy-stack/orbit-core';
import { Tracer, Span } from '@galaxy-stack/orbit-observability';

@Injectable()
export class UserService {
  constructor(private tracer: Tracer) {}

  async findUser(id: string) {
    return this.tracer.startActiveSpan('findUser', async (span: Span) => {
      span.setAttribute('user.id', id);
      
      try {
        const user = await this.repository.findById(id);
        span.setStatus({ code: SpanStatusCode.OK });
        return user;
      } catch (error) {
        span.recordException(error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}
```

### Decorator @Trace

```typescript
import { Trace } from '@galaxy-stack/orbit-observability';

@Injectable()
export class UserService {
  @Trace('findAllUsers')
  async findAll() {
    return this.repository.findAll();
  }
}
```

## Metric

### Thiết lập

```typescript
import { MetricsModule } from '@galaxy-stack/orbit-observability';

@Module({
  imports: [
    MetricsModule.forRoot({
      path: '/metrics',
      defaultLabels: {
        app: 'my-service',
        env: process.env.NODE_ENV,
      },
    }),
  ],
})
export class AppModule {}
```

### Tạo Metric

```typescript
import { Counter, Gauge, Histogram, MetricsService } from '@galaxy-stack/orbit-observability';

@Injectable()
export class MetricsCollector {
  private requestCounter: Counter;
  private activeConnections: Gauge;
  private responseTime: Histogram;

  constructor(private metrics: MetricsService) {
    this.requestCounter = metrics.createCounter({
      name: 'http_requests_total',
      help: 'Tổng số yêu cầu HTTP',
      labelNames: ['method', 'path', 'status'],
    });

    this.activeConnections = metrics.createGauge({
      name: 'active_connections',
      help: 'Kết nối đang hoạt động',
    });

    this.responseTime = metrics.createHistogram({
      name: 'http_response_time_seconds',
      help: 'Thời gian phản hồi HTTP',
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 5],
    });
  }

  recordRequest(method: string, path: string, status: number) {
    this.requestCounter.inc({ method, path, status: String(status) });
  }

  recordResponseTime(duration: number) {
    this.responseTime.observe(duration);
  }
}
```

### Hiển thị Prometheus

```
GET /metrics

# HELP http_requests_total Tổng số yêu cầu HTTP
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/users",status="200"} 1234

# HELP active_connections Kết nối đang hoạt động
# TYPE active_connections gauge
active_connections 42

# HELP http_response_time_seconds Thời gian phản hồi HTTP
# TYPE http_response_time_seconds histogram
http_response_time_seconds_bucket{le="0.01"} 100
http_response_time_seconds_bucket{le="0.05"} 500
http_response_time_seconds_sum 45.67
http_response_time_seconds_count 1000
```

## Logger ID tương quan

Để truy vết phân tán, sử dụng `StructuredLogger` sẽ tự động bao gồm ID tương quan:

```typescript
import { StructuredLogger } from '@galaxy-stack/orbit-observability';

const logger = new StructuredLogger({
  level: 'info',
  format: 'json',
  correlationId: true, // Tự động tiêm ID tương quan từ ngữ cảnh truy vết
});

logger.info('Người dùng đã đăng nhập', {
  userId: '123',
  email: 'user@example.com',
});
```

Đầu ra (với ngữ cảnh truy vết):

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Người dùng đã đăng nhập",
  "correlationId": "abc-123",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
  "spanId": "00f067aa0ba902b7",
  "context": {
    "userId": "123",
    "email": "user@example.com"
  }
}
```

::: info
Để ghi log mục đích chung mà không có truy vết, sử dụng [@galaxy-stack/orbit-logger](/packages/logger).
:::

## ID tương quan

```typescript
import { CorrelationMiddleware } from '@galaxy-stack/orbit-observability';

app.use(new CorrelationMiddleware({
  header: 'x-correlation-id',
  generator: () => crypto.randomUUID(),
}));
```

## Xuất khẩu

```typescript
export {
  TracingModule,
  MetricsModule,
  Tracer,
  Span,
  Trace,
  Counter,
  Gauge,
  Histogram,
  MetricsService,
  StructuredLogger,
  CorrelationMiddleware,
};
```