# @galaxy-stack/orbit-microservices-nats

NATS transport with queue groups and wildcard subscriptions.

## Installation

```bash
bun add @galaxy-stack/orbit-microservices @galaxy-stack/orbit-microservices-nats
```

## Features

- Complete NATS text protocol
- Queue groups for load balancing
- Wildcard subject matching (`*`, `>`)
- Request/reply pattern

## Server

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.NATS,
  options: {
    servers: ['nats://localhost:4222'],
    queue: 'my-service',
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
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Wildcard Subscriptions

```typescript
@MessagePattern('orders.*')
handleOrderEvents(@Payload() data: any) {
  // Matches: orders.created, orders.updated, orders.deleted
}

@MessagePattern('events.>')
handleAllEvents(@Payload() data: any) {
  // Matches: events.user.created, events.order.shipped, etc.
}
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `servers` | string[] | `['nats://localhost:4222']` | NATS servers |
| `queue` | string | - | Queue group name |
| `maxReconnectAttempts` | number | `10` | Max reconnection attempts |
| `reconnectTimeWait` | number | `2000` | Wait time between reconnects |
