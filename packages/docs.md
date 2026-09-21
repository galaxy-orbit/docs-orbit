# @galaxy-stack/orbit-docs

Interactive API playground and TypeScript SDK generator.

## Installation

```bash
bun add @galaxy-stack/orbit-docs
```

## Features

- Interactive API playground
- TypeScript SDK generation
- OpenAPI integration
- Request/response examples
- Authentication testing

## Setup

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { DocsModule } from '@galaxy-stack/orbit-docs';

@Module({
  imports: [
    DocsModule.forRoot({
      title: 'My API',
      description: 'API documentation',
      version: '1.0.0',
    }),
  ],
})
export class AppModule {}
```

## API Playground

Access the interactive playground at `/docs/playground`.

Features:
- Execute API requests directly
- View response times and headers
- Save request collections
- Authentication header management

## SDK Generation

```typescript
import { SdkGenerator } from '@galaxy-stack/orbit-docs';

const generator = new SdkGenerator({
  input: './openapi.json',
  output: './sdk',
  language: 'typescript',
});

await generator.generate();
```

## Generated SDK Usage

```typescript
import { ApiClient } from './sdk';

const client = new ApiClient({
  baseUrl: 'https://api.example.com',
  headers: {
    Authorization: 'Bearer token',
  },
});

const users = await client.users.findAll();
const user = await client.users.create({ name: 'John', email: 'john@example.com' });
```

## Configuration

```typescript
DocsModule.forRoot({
  title: 'My API',
  version: '1.0.0',
  servers: [
    { url: 'https://api.example.com', description: 'Production' },
    { url: 'http://localhost:3000', description: 'Development' },
  ],
  auth: {
    type: 'bearer',
    description: 'JWT token',
  },
})
```
