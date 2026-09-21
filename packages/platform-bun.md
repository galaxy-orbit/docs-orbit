# @galaxy-stack/orbit-platform-bun

HTTP adapter using Bun.serve() for maximum performance.

## Installation

```bash
bun add @galaxy-stack/orbit-platform-bun
```

## Overview

This package provides the HTTP adapter that integrates Orbit with Bun's native `Bun.serve()` API. It's automatically used when creating applications with `BunFactory`.

## Features

- Native Bun.serve() integration
- Zero external HTTP dependencies
- Maximum performance
- Built-in WebSocket support
- Static file serving

## Usage

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { BunAdapter } from '@galaxy-stack/orbit-platform-bun';

const app = await BunFactory.create(AppModule, {
  adapter: new BunAdapter(),
});

await app.listen(3000);
```

## Configuration Options

```typescript
const app = await BunFactory.create(AppModule, {
  adapter: new BunAdapter({
    maxRequestBodySize: 1024 * 1024 * 10,
    development: process.env.NODE_ENV !== 'production',
    tls: {
      cert: Bun.file('cert.pem'),
      key: Bun.file('key.pem'),
    },
  }),
});
```

## Static Files

```typescript
import { StaticMiddleware } from '@galaxy-stack/orbit-platform-bun';

app.use(StaticMiddleware({
  root: './public',
  prefix: '/static',
  maxAge: 86400,
}));
```

## WebSocket Support

```typescript
const server = app.getHttpServer();

server.upgrade(request, {
  data: { userId: request.headers.get('x-user-id') },
});
```

## Performance

The BunAdapter leverages Bun's optimized HTTP implementation:

- Direct memory access
- No Node.js compatibility layer
- Native TLS support
- Efficient request parsing
