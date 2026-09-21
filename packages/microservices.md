# @galaxy-stack/orbit-microservices

Base package for microservice communication.

## Installation

```bash
bun add @galaxy-stack/orbit-microservices

# Choose transport(s)
bun add @galaxy-stack/orbit-microservices-tcp
bun add @galaxy-stack/orbit-microservices-redis
bun add @galaxy-stack/orbit-microservices-nats
bun add @galaxy-stack/orbit-microservices-rmq
bun add @galaxy-stack/orbit-microservices-kafka
bun add @galaxy-stack/orbit-microservices-grpc
```

## Available Transports

| Package | Transport | Protocol |
|---------|-----------|----------|
| `@galaxy-stack/orbit-microservices-tcp` | TCP | Length-prefixed binary |
| `@galaxy-stack/orbit-microservices-redis` | Redis | RESP + Pub/Sub |
| `@galaxy-stack/orbit-microservices-nats` | NATS | Text protocol |
| `@galaxy-stack/orbit-microservices-rmq` | RabbitMQ | AMQP 0-9-1 |
| `@galaxy-stack/orbit-microservices-kafka` | Kafka | Binary protocol |
| `@galaxy-stack/orbit-microservices-grpc` | gRPC | HTTP/2 + Protobuf |

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
}
```

## Message Handlers

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
import { EventPattern } from '@galaxy-stack/orbit-microservices';

@Controller()
export class NotificationController {
  @EventPattern('user.created')
  handleUserCreated(@Payload() data: { userId: string }) {
    console.log('User created:', data.userId);
    // No return value for events
  }

  @EventPattern('order.*')
  handleOrderEvents(@Payload() data: any, @Ctx() context: any) {
    console.log('Order event:', context.pattern);
  }
}
```

## Client Proxy

### Registration

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

## Hybrid Application

```typescript
const app = await BunFactory.create(AppModule);

app.connectMicroservice({
  transport: new TcpTransport({ port: 4000 }),
});

app.connectMicroservice({
  transport: new RedisTransport({ host: 'localhost', port: 6379 }),
});

await app.startAllMicroservices();
await app.listen(3000);
```

## Context Decorator

```typescript
import { Ctx, MessageContext } from '@galaxy-stack/orbit-microservices';

@MessagePattern('process')
async process(@Payload() data: any, @Ctx() ctx: MessageContext) {
  console.log('Pattern:', ctx.getPattern());
  console.log('Transport:', ctx.getTransport());
  return { processed: true };
}
```

## Serialization

```typescript
import { ClientsModule, JsonSerializer } from '@galaxy-stack/orbit-microservices';

ClientsModule.register([
  {
    name: 'SERVICE',
    transport: Transport.TCP,
    options: {
      serializer: new JsonSerializer(),
    },
  },
])
```

## Exports

```typescript
export {
  ClientsModule,
  ClientProxy,
  MessagePattern,
  EventPattern,
  Payload,
  Ctx,
  Transport,
  MessageContext,
};
```
