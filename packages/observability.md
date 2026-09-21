# @galaxy-stack/orbit-observability

OpenTelemetry tracing and Prometheus metrics for distributed systems.

::: tip
For standalone logging, use [@galaxy-stack/orbit-logger](/packages/logger). This package provides `StructuredLogger` with **correlation ID** integration for distributed tracing.
:::

## Installation

```bash
bun add @galaxy-stack/orbit-observability
```

## Tracing

### Setup

```typescript
import { TracingModule, Tracer } from '@galaxy-stack/orbit-observability';

@Module({
  imports: [
    TracingModule.forRoot({
      serviceName: 'my-service',
      exporter: 'console', // or 'otlp', 'jaeger'
      sampler: { type: 'ratio', ratio: 0.1 }, // Sample 10%
    }),
  ],
})
export class AppModule {}
```

### Using Tracer

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

### @Trace Decorator

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

## Metrics

### Setup

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

### Creating Metrics

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
      help: 'Total HTTP requests',
      labelNames: ['method', 'path', 'status'],
    });

    this.activeConnections = metrics.createGauge({
      name: 'active_connections',
      help: 'Active connections',
    });

    this.responseTime = metrics.createHistogram({
      name: 'http_response_time_seconds',
      help: 'HTTP response time',
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

### Prometheus Exposition

```
GET /metrics

# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/users",status="200"} 1234

# HELP active_connections Active connections
# TYPE active_connections gauge
active_connections 42

# HELP http_response_time_seconds HTTP response time
# TYPE http_response_time_seconds histogram
http_response_time_seconds_bucket{le="0.01"} 100
http_response_time_seconds_bucket{le="0.05"} 500
http_response_time_seconds_sum 45.67
http_response_time_seconds_count 1000
```

## Correlation ID Logger

For distributed tracing, use `StructuredLogger` which automatically includes correlation IDs:

```typescript
import { StructuredLogger } from '@galaxy-stack/orbit-observability';

const logger = new StructuredLogger({
  level: 'info',
  format: 'json',
  correlationId: true, // Auto-inject correlation ID from trace context
});

logger.info('User logged in', {
  userId: '123',
  email: 'user@example.com',
});
```

Output (with trace context):

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "User logged in",
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
For general-purpose logging without tracing, use [@galaxy-stack/orbit-logger](/packages/logger).
:::

## Correlation IDs

```typescript
import { CorrelationMiddleware } from '@galaxy-stack/orbit-observability';

app.use(new CorrelationMiddleware({
  header: 'x-correlation-id',
  generator: () => crypto.randomUUID(),
}));
```

## Exports

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
