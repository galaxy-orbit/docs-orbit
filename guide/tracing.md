# Distributed Tracing

OpenTelemetry-based tracing with `@galaxy-stack/orbit-observability`.

## Setup

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { ObservabilityModule } from '@galaxy-stack/orbit-observability';

@Module({
  imports: [
    ObservabilityModule.forRoot({
      tracing: {
        serviceName: 'my-service',
        exporter: 'jaeger',
        endpoint: 'http://localhost:14268/api/traces',
      },
    }),
  ],
})
export class AppModule {}
```

## Automatic Tracing

HTTP requests, database queries, and external calls are traced automatically.

```typescript
@Injectable()
export class UsersService {
  async getUser(id: number) {
    // This method call is automatically traced
    return this.usersRepo.findById(id);
  }
}
```

## Custom Spans

```typescript
import { Span, InjectTracer, Tracer } from '@galaxy-stack/orbit-observability';

@Injectable()
export class OrdersService {
  constructor(@InjectTracer() private tracer: Tracer) {}

  @Span('processOrder')
  async processOrder(orderId: number) {
    const span = this.tracer.startSpan('validateOrder');
    await this.validate(orderId);
    span.end();

    const paymentSpan = this.tracer.startSpan('processPayment');
    await this.processPayment(orderId);
    paymentSpan.end();
  }
}
```

## Adding Attributes

```typescript
@Span('fetchUser')
async fetchUser(id: number) {
  const span = this.tracer.getCurrentSpan();
  span?.setAttribute('user.id', id);
  
  const user = await this.usersRepo.findById(id);
  
  span?.setAttribute('user.role', user.role);
  return user;
}
```

## Error Recording

```typescript
try {
  await this.riskyOperation();
} catch (error) {
  const span = this.tracer.getCurrentSpan();
  span?.recordException(error);
  span?.setStatus({ code: SpanStatusCode.ERROR });
  throw error;
}
```

## Exporters

- **Jaeger**: `exporter: 'jaeger'`
- **Zipkin**: `exporter: 'zipkin'`
- **OTLP**: `exporter: 'otlp'`
- **Console**: `exporter: 'console'` (development)
