# @galaxy-stack/orbit-microservices-tcp

Native TCP transport for microservices - full implementation without external dependencies.

## Installation

```bash
bun add @galaxy-stack/orbit-microservices @galaxy-stack/orbit-microservices-tcp
```

## Features

- Length-prefixed binary protocol
- Request/response pattern
- Event pattern (fire-and-forget)
- Connection pooling
- Automatic reconnection

## Server

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.TCP,
  options: {
    host: '0.0.0.0',
    port: 3001,
  },
});

await app.listen();
console.log('TCP microservice listening on port 3001');
```

## Client

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { ClientsModule, Transport } from '@galaxy-stack/orbit-microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TCP_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `host` | string | `'localhost'` | Server host |
| `port` | number | `3000` | Server port |
| `retryAttempts` | number | `3` | Reconnection attempts |
| `retryDelay` | number | `1000` | Delay between retries (ms) |

## Protocol

TCP transport uses a length-prefixed protocol:
- 4-byte length header (big-endian)
- JSON-encoded message body
