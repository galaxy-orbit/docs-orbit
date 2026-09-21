# Giao thức Redis

Giao thức Redis pub/sub cho microservices.

## Thiết lập máy chủ

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
    password: process.env.REDIS_PASSWORD,
  },
});

await app.listen();
```

## Trình xử lý tin nhắn

```typescript
@Controller()
export class OrdersHandler {
  @MessagePattern('orders.process')
  async processOrder(@Payload() data: ProcessOrderDto) {
    const result = await this.ordersService.process(data);
    return { success: true, orderId: result.id };
  }

  @EventPattern('payments.completed')
  async handlePaymentCompleted(@Payload() payment: Payment) {
    await this.ordersService.markPaid(payment.orderId);
  }
}
```

## Cấu hình Client

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
          retryAttempts: 5,
          retryDelay: 1000,
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Yêu cầu/Phản hồi

```typescript
@Injectable()
export class PaymentsService {
  constructor(@Inject('ORDERS_SERVICE') private client: ClientProxy) {}

  async processPayment(orderId: number) {
    const order = await firstValueFrom(
      this.client.send('orders.get', { orderId })
    );
    
    const payment = await this.createPayment(order);
    
    this.client.emit('payments.completed', payment);
    
    return payment;
  }
}
```

## Tùy chọn kết nối

```typescript
{
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
    password: 'secret',
    db: 0,
    retryAttempts: 5,
    retryDelay: 3000,
  },
}
```