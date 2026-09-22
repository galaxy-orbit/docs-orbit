---
layout: home

hero:
  name: "Orbit"
  text: "NestJS-style Framework for Bun"
  tagline: Fast, modular, and fully optimized for the Bun runtime
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/galaxy-orbit

features:
  - icon: ⚡
    title: Bun Native
    details: Built from the ground up for Bun runtime. Uses Bun.serve(), Bun.password, and native TCP sockets for maximum performance.
  
  - icon: 🧩
    title: Modular Architecture
    details: Organize your code with modules, controllers, and providers. Full dependency injection with 3 scopes - singleton, request, transient.
  
  - icon: 🎨
    title: Decorator-based
    details: Familiar NestJS-style decorators for routing, validation, caching, and more. @Controller, @Get, @Injectable, @Module.
  
  - icon: 📡
    title: 6 Microservice Transports
    details: TCP, Redis, NATS, RabbitMQ, Kafka, and gRPC - all with native implementations without external dependencies.
  
  - icon: 🔮
    title: GraphQL Ready
    details: Code-first GraphQL with DataLoader, subscriptions, and Federation v2 support for distributed schemas.
  
  - icon: 🗄️
    title: Database Integration
    details: Drizzle ORM support for PostgreSQL, MySQL, SQLite, and MongoDB with Repository pattern and transactions.
  
  - icon: 🔐
    title: Security Built-in
    details: JWT authentication, rate limiting, Helmet headers, CSRF protection, and input sanitization out of the box.
  
  - icon: 📊
    title: Observability
    details: OpenTelemetry tracing, Prometheus metrics, and structured logging with correlation IDs.
  
  - icon: 🛠️
    title: Developer Tools
    details: CLI for scaffolding, VS Code extension, devtools dashboard, and beautiful error messages with hints.
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
}
</style>

## Quick Example

```typescript
import { BunFactory, Module, Controller, Get, Injectable } from '@galaxy-stack/orbit-core';

@Injectable()
class UserService {
  getUsers() {
    return [{ id: 1, name: 'John' }];
  }
}

@Controller('users')
class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.getUsers();
  }
}

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class AppModule {}

const app = await BunFactory.create(AppModule);
await app.listen(3000);
```

## Why Orbit?

| Feature | Orbit | NestJS |
|---------|-----------|--------|
| Runtime | Bun (native) | Node.js |
| HTTP Server | Bun.serve() | Express/Fastify |
| Password Hashing | Bun.password | bcrypt |
| Microservices | Native TCP | External libs |
| Cold Start | ~10ms | ~100ms |
| Memory Usage | Lower | Higher |

## Packages Overview

Orbit is a monorepo with **32 packages** organized by functionality:

- **Core**: @galaxy-stack/orbit-core, @galaxy-stack/orbit-common, @galaxy-stack/orbit-config, @galaxy-stack/orbit-validation
- **Database**: @galaxy-stack/orbit-database, @galaxy-stack/orbit-cache
- **Microservices**: @galaxy-stack/orbit-microservices-tcp, redis, nats, rmq, kafka, grpc
- **GraphQL**: @galaxy-stack/orbit-graphql, @galaxy-stack/orbit-graphql-federation
- **Security**: @galaxy-stack/orbit-auth, @galaxy-stack/orbit-security, @galaxy-stack/orbit-throttler
- **Observability**: @galaxy-stack/orbit-observability, @galaxy-stack/orbit-logger, @galaxy-stack/orbit-telemetry
- **Tools**: orbit, @galaxy-stack/orbit-testing, @galaxy-stack/orbit-devtools
