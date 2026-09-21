# Lifecycle Hooks

Orbit provides lifecycle hooks for initialization and cleanup.

## Available Hooks

| Hook | Description |
|------|-------------|
| `OnModuleInit` | Called after module providers are resolved |
| `OnModuleDestroy` | Called before module is destroyed |
| `OnApplicationBootstrap` | Called after all modules initialized |
| `OnApplicationShutdown` | Called on application shutdown |

## OnModuleInit

```typescript
import { Injectable, OnModuleInit } from '@galaxy-stack/orbit-common';

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    await this.connect();
    console.log('Database connected');
  }
}
```

## OnModuleDestroy

```typescript
@Injectable()
export class DatabaseService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.disconnect();
    console.log('Database disconnected');
  }
}
```

## OnApplicationBootstrap

```typescript
@Injectable()
export class AppService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    console.log('Application fully initialized');
    this.startBackgroundJobs();
  }
}
```

## OnApplicationShutdown

```typescript
@Injectable()
export class CacheService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    console.log(`Shutting down due to ${signal}`);
    await this.flush();
    await this.close();
  }
}
```

## Graceful Shutdown

```typescript
const app = await BunFactory.create(AppModule);

app.enableShutdownHooks();

await app.listen(3000);
```

## Execution Order

1. `OnModuleInit` (per module, depth-first)
2. `OnApplicationBootstrap` (all modules)
3. Application runs...
4. `OnApplicationShutdown` (all modules)
5. `OnModuleDestroy` (per module, reverse order)
