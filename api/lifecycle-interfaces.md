# Lifecycle Interfaces

Interfaces for application and module lifecycle hooks.

## OnModuleInit

Called after module providers are resolved.

```typescript
interface OnModuleInit {
  onModuleInit(): any;
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    await this.connect();
    console.log('Database connected');
  }
}
```

## OnModuleDestroy

Called before module is destroyed.

```typescript
interface OnModuleDestroy {
  onModuleDestroy(): any;
}

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.disconnect();
    console.log('Database disconnected');
  }
}
```

## OnApplicationBootstrap

Called after all modules are initialized.

```typescript
interface OnApplicationBootstrap {
  onApplicationBootstrap(): any;
}

@Injectable()
export class CacheWarmupService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    await this.warmupCache();
    console.log('Cache warmed up');
  }
}
```

## OnApplicationShutdown

Called on application shutdown.

```typescript
interface OnApplicationShutdown {
  onApplicationShutdown(signal?: string): any;
}

@Injectable()
export class CleanupService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    console.log(`Shutting down on signal: ${signal}`);
    await this.cleanup();
  }
}
```

## BeforeApplicationShutdown

Called before shutdown hooks.

```typescript
interface BeforeApplicationShutdown {
  beforeApplicationShutdown(signal?: string): any;
}

@Injectable()
export class GracefulShutdownService implements BeforeApplicationShutdown {
  async beforeApplicationShutdown(signal?: string) {
    await this.stopAcceptingRequests();
    await this.waitForPendingRequests();
  }
}
```

## Lifecycle Order

1. `OnModuleInit` (per module, depth-first)
2. `OnApplicationBootstrap` (all providers)
3. Application runs...
4. `BeforeApplicationShutdown` (all providers)
5. `OnApplicationShutdown` (all providers)
6. `OnModuleDestroy` (per module, reverse order)

## Enabling Shutdown Hooks

```typescript
const app = await BunFactory.create(AppModule);
app.enableShutdownHooks();
await app.listen(3000);
```
