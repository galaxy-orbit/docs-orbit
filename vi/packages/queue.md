# @galaxy-stack/orbit-queue

Hàng đợi job — driver cắm thêm (có sẵn memory), retry backoff, job trễ

```bash
bun add @galaxy-stack/orbit-queue
```

Xem README trên [npm](https://www.npmjs.com/package/@galaxy-stack/orbit-queue) để biết ví dụ đầy đủ.

## Redis driver

Dùng Redis client native của Bun — không thêm dependency:

```ts
QueueModule.forRoot({ driver: 'redis', redisUrl: 'redis://localhost:6379', redisPrefix: 'orbit:queue' })
```

Claim atomic qua Lua EVAL để nhiều worker không bao giờ nhận cùng một job. Job nằm trong Redis ZSET với score là `runAt` (hỗ trợ job trễ). Memory driver đi kèm cho dev local; implement `QueueDriver` cho backend khác.
