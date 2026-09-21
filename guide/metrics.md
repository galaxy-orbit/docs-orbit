# Prometheus Metrics

Expose metrics for monitoring with `@galaxy-stack/orbit-observability`.

## Setup

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

## Built-in Metrics

Default metrics exposed:

- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request duration histogram
- `http_request_size_bytes` - Request size
- `http_response_size_bytes` - Response size
- `process_cpu_seconds_total` - CPU usage
- `process_resident_memory_bytes` - Memory usage

## Custom Counters

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';
import { Counter, InjectMetrics } from '@galaxy-stack/orbit-observability';

@Injectable()
export class OrdersService {
  private ordersCounter: Counter;

  constructor(@InjectMetrics() private metrics: MetricsService) {
    this.ordersCounter = this.metrics.createCounter({
      name: 'orders_total',
      help: 'Total number of orders',
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

## Histograms

```typescript
private responseTime = this.metrics.createHistogram({
  name: 'external_api_duration_seconds',
  help: 'External API call duration',
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

## Gauges

```typescript
private activeConnections = this.metrics.createGauge({
  name: 'websocket_connections_active',
  help: 'Active WebSocket connections',
});

onConnect() {
  this.activeConnections.inc();
}

onDisconnect() {
  this.activeConnections.dec();
}
```
