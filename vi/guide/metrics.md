# Số liệu Prometheus

Hiển thị số liệu để giám sát với `@galaxy-stack/orbit-observability`.

## Thiết lập

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { ObservabilityModule } from '@galaxy-stack/orbit-observability';

@Module({
  imports: [
    ObservabilityModule.forRoot({
      metrics: {
        enabled: true,
        path: '/metrics',
        defaultLabels: {
          app: 'my-service',
          env: process.env.NODE_ENV,
        },
      },
    }),
  ],
})
export class AppModule {}
```

## Số liệu tích hợp

Các số liệu mặc định được hiển thị:

- `http_requests_total` - Tổng số yêu cầu HTTP
- `http_request_duration_seconds` - Biểu đồ thời gian yêu cầu
- `http_request_size_bytes` - Kích thước yêu cầu
- `http_response_size_bytes` - Kích thước phản hồi
- `process_cpu_seconds_total` - Sử dụng CPU
- `process_resident_memory_bytes` - Sử dụng bộ nhớ

## Bộ đếm tùy chỉnh

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';
import { Counter, InjectMetrics } from '@galaxy-stack/orbit-observability';

@Injectable()
export class OrdersService {
  private ordersCounter: Counter;

  constructor(@InjectMetrics() private metrics: MetricsService) {
    this.ordersCounter = this.metrics.createCounter({
      name: 'orders_total',
      help: 'Tổng số đơn hàng',
      labelNames: ['status'],
    });
  }

  async createOrder(data: CreateOrderDto) {
    const order = await this.ordersRepo.create(data);
    this.ordersCounter.inc({ status: 'created' });
    return order;
  }
}
```

## Biểu đồ Histogram

```typescript
private responseTime = this.metrics.createHistogram({
  name: 'external_api_duration_seconds',
  help: 'Thời gian gọi API bên ngoài',
  labelNames: ['endpoint'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

async callExternalApi() {
  const timer = this.responseTime.startTimer({ endpoint: '/users' });
  const result = await fetch('https://api.example.com/users');
  timer();
  return result;
}
```

## Đồng hồ đo (Gauges)

```typescript
private activeConnections = this.metrics.createGauge({
  name: 'websocket_connections_active',
  help: 'Số kết nối WebSocket hoạt động',
});

onConnect() {
  this.activeConnections.inc();
}

onDisconnect() {
  this.activeConnections.dec();
}
```