# RabbitMQ Transport

AMQP 0-9-1 protocol transport for RabbitMQ.

## Server Setup

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'orders_queue',
    queueOptions: {
      durable: true,
    },
  },
});

await app.listen();
```

## Message Handlers

```typescript
@Controller()
export class OrdersHandler {
  @MessagePattern('order.create')
  async createOrder(@Payload() data: CreateOrderDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    
    try {
      const order = await this.ordersService.create(data);
      channel.ack(originalMsg);
      return order;
    } catch (error) {
      channel.nack(originalMsg, false, true);
      throw error;
    }
  }
}
```

## Client Configuration

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'orders_queue',
          queueOptions: {
            durable: true,
          },
          prefetchCount: 10,
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Exchange Configuration

```typescript
{
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'orders_queue',
    exchange: 'orders_exchange',
    exchangeType: 'topic',
    routingKey: 'orders.*',
  },
}
```

## Manual Acknowledgment

```typescript
@MessagePattern('tasks.process')
async processTask(@Payload() data: Task, @Ctx() ctx: RmqContext) {
  const channel = ctx.getChannelRef();
  const msg = ctx.getMessage();
  
  await this.taskService.process(data);
  
  channel.ack(msg);
}
```
