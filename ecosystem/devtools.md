# Devtools Dashboard

Web-based developer dashboard for Orbit applications.

## Overview

The devtools dashboard provides real-time visibility into your application:

- **Routes**: View all registered HTTP endpoints
- **DI Graph**: Visualize dependency injection relationships
- **Modules**: Inspect module structure and exports
- **Metrics**: Monitor performance in real-time

## Setup

```typescript
import { createDevtools } from '@galaxy-stack/orbit-devtools';

const devtools = createDevtools({
  title: 'My App Devtools',
  path: '/__devtools',
  theme: 'auto',
});

// Mount the dashboard
app.get('/__devtools*', devtools.createHandler());
```

Access at: `http://localhost:3000/__devtools`

## Providing Data

### Routes

```typescript
devtools.setRoutes([
  {
    method: 'GET',
    path: '/users',
    controller: 'UserController',
    handler: 'findAll',
    guards: ['AuthGuard'],
    pipes: ['ValidationPipe'],
  },
  {
    method: 'POST',
    path: '/users',
    controller: 'UserController',
    handler: 'create',
    guards: ['AuthGuard'],
    pipes: ['ValidationPipe'],
    interceptors: ['LoggingInterceptor'],
  },
]);
```

### Providers

```typescript
devtools.setProviders([
  {
    name: 'UserService',
    scope: 'singleton',
    dependencies: ['UserRepository', 'CacheService'],
    module: 'UserModule',
  },
  {
    name: 'UserRepository',
    scope: 'singleton',
    dependencies: ['DatabaseService'],
    module: 'UserModule',
  },
]);
```

### Modules

```typescript
devtools.setModules([
  {
    name: 'AppModule',
    controllers: ['AppController'],
    providers: ['AppService'],
    imports: ['UserModule', 'AuthModule'],
    exports: [],
  },
  {
    name: 'UserModule',
    controllers: ['UserController'],
    providers: ['UserService', 'UserRepository'],
    imports: [],
    exports: ['UserService'],
  },
]);
```

### Real-time Metrics

```typescript
setInterval(() => {
  devtools.pushMetrics({
    requestsPerSecond: calculateRPS(),
    avgLatency: calculateLatency(),
    errorRate: calculateErrorRate(),
    activeConnections: getActiveConnections(),
    memoryUsage: process.memoryUsage().heapUsed,
    cpuUsage: getCpuUsage(),
  });
}, 1000);
```

## Dashboard Tabs

### Overview

Quick stats showing:
- Total routes
- Total providers
- Total modules
- Requests per second
- Average latency
- Error rate

### Routes

Table view of all registered routes:

| Method | Path | Handler | Guards | Pipes |
|--------|------|---------|--------|-------|
| GET | /users | UserController.findAll | AuthGuard | - |
| POST | /users | UserController.create | AuthGuard | ValidationPipe |

### DI Graph

Visual representation of provider dependencies:

```
┌─────────────┐     ┌─────────────┐
│ UserService │────▶│ UserRepo    │
│ (singleton) │     │ (singleton) │
└─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│ CacheService│
│ (singleton) │
└─────────────┘
```

Color coding:
- Blue: Singleton scope
- Orange: Request scope
- Green: Transient scope

### Modules

Card view of each module showing:
- Controllers
- Providers
- Imports
- Exports

### Metrics

Real-time charts and history table:
- Requests per second over time
- Latency distribution
- Error rate trend
- Memory usage
- Active connections

## Configuration Options

```typescript
createDevtools({
  title: 'My Devtools',       // Dashboard title
  port: 9229,                  // Standalone server port
  path: '/__devtools',         // Mount path
  theme: 'auto',               // 'light' | 'dark' | 'auto'
  refreshInterval: 1000,       // Metrics refresh rate (ms)
  auth: {
    enabled: true,
    username: 'admin',
    password: 'secret',
  },
});
```

## Security

In production, consider:

1. Disable devtools completely
2. Use authentication
3. Restrict to internal network

```typescript
if (process.env.NODE_ENV !== 'production') {
  app.get('/__devtools*', devtools.createHandler());
}
```
