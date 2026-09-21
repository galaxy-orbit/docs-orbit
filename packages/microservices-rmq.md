# @galaxy-stack/orbit-microservices-rmq

RabbitMQ transport with complete AMQP 0-9-1 protocol.

## Installation

```bash
bun add @galaxy-stack/orbit-microservices @galaxy-stack/orbit-microservices-rmq
```

## Features

- Complete AMQP 0-9-1 protocol implementation
- Connection handshake with PLAIN auth
- Channel management and heartbeats
- Queue declaration (durable/exclusive)
- Message ACK/NACK acknowledgments
- RPC with exclusive reply queues

## Server

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'my_queue',
    queueOptions: { durable: true },
  },
});

await app.listen();
```

## Client

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'my_queue',
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Manual Acknowledgment

```typescript
@MessagePattern('process')
async handle(@Payload() data: any, @Ctx() context: RmqContext) {
  const channel = context.getChannelRef();
  const msg = context.getMessage();
  
  try {
    await this.process(data);
    channel.ack(msg);
  } catch {
    channel.nack(msg, false, true);
  }
}
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `urls` | string[] | AMQP connection URLs |
| `queue` | string | Queue name |
| `prefetchCount` | number | Consumer prefetch |
| `queueOptions.durable` | boolean | Survive restarts |
| `noAck` | boolean | Auto-acknowledge |
