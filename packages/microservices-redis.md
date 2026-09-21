# @galaxy-stack/orbit-microservices-redis

Redis pub/sub transport with complete RESP protocol implementation.

## Installation

```bash
bun add @galaxy-stack/orbit-microservices @galaxy-stack/orbit-microservices-redis
```

## Features

- Complete RESP protocol encoder/decoder
- Pub/Sub with automatic reconnection
- Connection pooling for pub and sub
- Request/response pattern via channels

## Server

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

## Client

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
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
| `host` | string | `'localhost'` | Redis host |
| `port` | number | `6379` | Redis port |
| `password` | string | - | Redis password |
| `db` | number | `0` | Database index |
| `retryAttempts` | number | `5` | Reconnection attempts |
| `retryDelay` | number | `3000` | Delay between retries |

## RESP Protocol

Native implementation of Redis Serialization Protocol:
- Simple Strings, Errors, Integers
- Bulk Strings, Arrays
- Full pub/sub command support
