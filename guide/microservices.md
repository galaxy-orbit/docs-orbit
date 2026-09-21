# Microservices

Orbit supports 6 microservice transports, all implemented natively without external dependencies.

## Transports Overview

| Transport | Package | Protocol |
|-----------|---------|----------|
| TCP | `@galaxy-stack/orbit-microservices-tcp` | Length-prefixed binary |
| Redis | `@galaxy-stack/orbit-microservices-redis` | RESP + Pub/Sub |
| NATS | `@galaxy-stack/orbit-microservices-nats` | Text protocol |
| RabbitMQ | `@galaxy-stack/orbit-microservices-rmq` | AMQP 0-9-1 |
| Kafka | `@galaxy-stack/orbit-microservices-kafka` | Binary protocol |
| gRPC | `@galaxy-stack/orbit-microservices-grpc` | HTTP/2 + Protobuf |

## Creating a Microservice

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { TcpTransport } from '@galaxy-stack/orbit-microservices-tcp';

async function bootstrap() {
  const app = await BunFactory.createMicroservice(AppModule, {
    transport: new TcpTransport({
      host: '0.0.0.0',
      port: 4000,
    }),
  });

  await app.listen();
  console.log('Microservice running on port 4000');
}
```

## Message Patterns

### Request-Response

```typescript
import { Controller, MessagePattern, Payload } from '@galaxy-stack/orbit-microservices';

@Controller()
export class MathController {
  @MessagePattern('sum')
  sum(@Payload() data: { a: number; b: number }) {
    return data.a + data.b;
  }

  @MessagePattern({ cmd: 'multiply' })
  multiply(@Payload() data: { a: number; b: number }) {
    return data.a * data.b;
  }
}
```

### Event-Based

```typescript
import { Controller, EventPattern, Payload } from '@galaxy-stack/orbit-microservices';

@Controller()
export class NotificationController {
  @EventPattern('user.created')
  handleUserCreated(@Payload() data: { userId: string }) {
    console.log('User created:', data.userId);
    // No response returned for events
  }

  @EventPattern('order.*')
  handleOrderEvents(@Payload() data: any, @Ctx() context: any) {
    console.log('Order event:', context.pattern, data);
  }
}
```

## Client Proxy

### Sending Messages

```typescript
import { Injectable, Inject } from '@galaxy-stack/orbit-core';
import { ClientProxy } from '@galaxy-stack/orbit-microservices';

@Injectable()
export class MathService {
  constructor(
    @Inject('MATH_SERVICE') private client: ClientProxy,
  ) {}

  async sum(a: number, b: number): Promise<number> {
    return this.client.send('sum', { a, b });
  }

  emitEvent(data: any): void {
    this.client.emit('user.created', data);
  }
}
```

### Registering Client

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { ClientsModule, Transport } from '@galaxy-stack/orbit-microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4000,
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Hybrid Applications

Run HTTP and microservice together:

```typescript
const app = await BunFactory.create(AppModule);

app.connectMicroservice({
  transport: new TcpTransport({ port: 4000 }),
});

await app.startAllMicroservices();
await app.listen(3000);
```

## Transport-Specific Features

### Redis Pub/Sub

```typescript
import { RedisTransport } from '@galaxy-stack/orbit-microservices-redis';

const transport = new RedisTransport({
  host: 'localhost',
  port: 6379,
  // Uses RESP protocol natively
});
```

### NATS Queue Groups

```typescript
import { NatsTransport } from '@galaxy-stack/orbit-microservices-nats';

const transport = new NatsTransport({
  servers: ['nats://localhost:4222'],
  queue: 'my-queue-group',
});
```

### Kafka Consumer Groups

```typescript
import { KafkaTransport } from '@galaxy-stack/orbit-microservices-kafka';

const transport = new KafkaTransport({
  brokers: ['localhost:9092'],
  groupId: 'my-consumer-group',
  clientId: 'my-client',
});
```

### RabbitMQ with Acknowledgments

```typescript
import { RmqTransport } from '@galaxy-stack/orbit-microservices-rmq';

const transport = new RmqTransport({
  urls: ['amqp://localhost:5672'],
  queue: 'my-queue',
  noAck: false, // Manual acknowledgment
});
```
