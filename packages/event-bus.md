# @galaxy-stack/orbit-event-bus

In-process event bus — `@OnEvent` decorators, wildcard patterns, priorities, sync/async emission. Equivalent of `@nestjs/event-emitter`.

```bash
bun add @galaxy-stack/orbit-event-bus
```

## Usage

```ts
import { EventBusModule, EventBus, OnEvent, Injectable, Module } from '@galaxy-stack/orbit-event-bus';

@Injectable()
export class UserHandlers {
  @OnEvent('user.created')
  onCreated(payload: { id: string }) { /* ... */ }

  @OnEvent('order.**')   // any depth under order.*
  async onOrderEvent(payload: any, event: string) { /* ... */ }
}

@Module({
  imports: [EventBusModule.forRoot({ handlers: [new UserHandlers()] })],
})
export class AppModule {}

// anywhere with DI:
constructor(private bus: EventBus) {}
await this.bus.emitAsync('user.created', { id: 'u1' });
```

Features: `user.*` matches one segment, `order.**` matches any depth, priority ordering, `once` handlers, error isolation (or `throwErrors: true`).
