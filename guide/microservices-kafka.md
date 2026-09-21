# Kafka Transport

Apache Kafka transport with consumer groups.

## Server Setup

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'],
      clientId: 'orders-service',
    },
    consumer: {
      groupId: 'orders-consumer-group',
    },
  },
});

await app.listen();
```

## Message Handlers

```typescript
@Controller()
export class OrdersHandler {
  @MessagePattern('orders.topic')
  async handleOrder(@Payload() message: KafkaMessage, @Ctx() context: KafkaContext) {
    const { offset, partition, topic } = context.getMessage();
    
    console.log(`Processing message from ${topic}[${partition}]:${offset}`);
    
    const order = JSON.parse(message.value.toString());
    await this.ordersService.process(order);
    
    return { processed: true };
  }
}
```

## Client Configuration

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
            clientId: 'api-gateway',
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Producing Messages

```typescript
@Injectable()
export class EventsService {
  constructor(@Inject('KAFKA_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('orders.topic');
    await this.client.connect();
  }

  async sendOrder(order: CreateOrderDto) {
    return this.client.send('orders.topic', {
      key: order.userId.toString(),
      value: JSON.stringify(order),
    });
  }

  async emitEvent(event: any) {
    this.client.emit('events.topic', {
      key: event.type,
      value: JSON.stringify(event),
    });
  }
}
```

## Consumer Options

```typescript
{
  consumer: {
    groupId: 'my-group',
    sessionTimeout: 30000,
    rebalanceTimeout: 60000,
    heartbeatInterval: 3000,
  },
}
```
