# @galaxy-stack/orbit-queue

Job queue — pluggable drivers (memory included), retries with exponential backoff, delayed jobs.

```bash
bun add @galaxy-stack/orbit-queue
```

## Usage

```ts
import { QueueModule, QueueService, Module } from '@galaxy-stack/orbit-queue';

@Module({
  imports: [QueueModule.forRoot({ concurrency: 2, retryDelayMs: 500 })],
})
export class AppModule {}

// anywhere with DI:
constructor(private queue: QueueService) {}

this.queue.register('send-email', {
  process: async (job) => { /* job.data */ },
  onFailed: (job, err) => { /* dead-letter */ },
  maxAttempts: 5,
});
this.queue.start();
await this.queue.add('send-email', { to: 'user@x.test' }, { delayMs: 5000 });
```

Memory driver included for local development; implement `QueueDriver` for Redis backends.

## Redis driver

Uses Bun's native Redis client — no extra dependency:

```ts
QueueModule.forRoot({ driver: 'redis', redisUrl: 'redis://localhost:6379', redisPrefix: 'orbit:queue' })
```

Atomic claims via Lua EVAL so multiple workers never receive the same job. Jobs live in a Redis ZSET scored by `runAt` (delayed jobs supported natively). Memory driver included for local development; implement `QueueDriver` for other backends.
