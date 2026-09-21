# Truy vết phân tán

Truy vết dựa trên OpenTelemetry với `@galaxy-stack/orbit-observability`.

## Thiết lập

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

## Truy vết tự động

Các yêu cầu HTTP, truy vấn cơ sở dữ liệu và cuộc gọi bên ngoài được truy vết tự động.

```typescript
@Injectable()
export class UsersService {
  async getUser(id: number) {
    // Cuộc gọi phương thức này được truy vết tự động
    return this.usersRepo.findById(id);
  }
}
```

## Span tùy chỉnh

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

## Thêm thuộc tính

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

## Ghi lại lỗi

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

## Trình xuất

- **Jaeger**: `exporter: 'jaeger'`
- **Zipkin**: `exporter: 'zipkin'`
- **OTLP**: `exporter: 'otlp'`
- **Console**: `exporter: 'console'` (phát triển)