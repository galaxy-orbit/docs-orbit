# Introduction

## What is Orbit?

Orbit is a progressive backend framework optimized 100% for the [Bun](https://bun.sh) runtime. It follows NestJS-style patterns - modular architecture, decorator-based routing, and dependency injection - while leveraging Bun's native performance capabilities.

## Why Orbit?

### Native Bun Performance

Unlike frameworks that run on Node.js and use adapters, Orbit is built specifically for Bun:

- **Bun.serve()**: Native HTTP server without Express or Fastify overhead
- **Bun.password**: Built-in password hashing using Argon2
- **Native TCP sockets**: All microservice transports use Bun's native socket APIs
- **Bun.Transpiler**: Hot reload with near-instant TypeScript compilation

### Familiar Patterns

If you've used NestJS, you'll feel right at home:

```typescript
@Controller('users')
class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
```

### Complete Feature Set

Orbit provides everything you need to build production-ready applications:

- **Core**: Modules, Controllers, Providers, DI Container
- **Pipeline**: Middleware, Guards, Pipes, Interceptors, Exception Filters
- **Database**: Drizzle ORM integration with Repository pattern
- **GraphQL**: Code-first with DataLoader and Subscriptions
- **Microservices**: 6 transport protocols (TCP, Redis, NATS, RabbitMQ, Kafka, gRPC)
- **WebSocket**: Gateway with decorators
- **Security**: JWT, Rate Limiting, Helmet, CSRF, Sanitization
- **Observability**: Tracing, Metrics, Structured Logging
- **DevTools**: CLI, VS Code Extension, Dashboard

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Application                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   HTTP   │  │ WebSocket│  │   Microservice   │  │
│  │ Requests │  │ Messages │  │     Messages     │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │             │                  │            │
│       └─────────────┴──────────────────┘            │
│                     │                               │
│       ┌─────────────▼─────────────┐                │
│       │     Request Pipeline      │                │
│       │  Middleware → Guards →    │                │
│       │  Pipes → Interceptors     │                │
│       └─────────────┬─────────────┘                │
│                     │                               │
│       ┌─────────────▼─────────────┐                │
│       │       Controllers         │                │
│       └─────────────┬─────────────┘                │
│                     │                               │
│       ┌─────────────▼─────────────┐                │
│       │        Services           │                │
│       └─────────────┬─────────────┘                │
│                     │                               │
│       ┌─────────────▼─────────────┐                │
│       │      Repositories         │                │
│       └─────────────┬─────────────┘                │
│                     │                               │
│       ┌─────────────▼─────────────┐                │
│       │        Database           │                │
│       └───────────────────────────┘                │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Comparison with NestJS

| Feature | Orbit | NestJS |
|---------|-----------|--------|
| Runtime | Bun | Node.js |
| HTTP Server | Bun.serve() | Express/Fastify |
| Module System | ✅ | ✅ |
| Dependency Injection | ✅ | ✅ |
| Decorators | ✅ | ✅ |
| Guards/Pipes/Interceptors | ✅ | ✅ |
| Microservices | Native TCP | External libs |
| GraphQL | ✅ | ✅ |
| WebSocket | ✅ | ✅ |
| Cold Start | ~10ms | ~100ms |
| External Dependencies | Minimal | Many |

## Requirements

- **Bun** >= 1.0.0
- **TypeScript** >= 5.0.0

TypeScript configuration must include:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Next Steps

Ready to get started? Head to the [Quick Start](/guide/quick-start) guide to create your first Orbit application.
