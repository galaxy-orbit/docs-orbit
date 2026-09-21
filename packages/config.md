# @galaxy-stack/orbit-config

Configuration management with environment variable loading and Zod validation.

## Installation

```bash
bun add @galaxy-stack/orbit-config
```

## Basic Usage

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { ConfigModule, ConfigService } from '@galaxy-stack/orbit-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

## ConfigService API

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';
import { ConfigService } from '@galaxy-stack/orbit-config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  getPort(): number {
    return this.config.get<number>('PORT', 3000);
  }

  getDatabaseUrl(): string {
    return this.config.getOrThrow<string>('DATABASE_URL');
  }
}
```

## Zod Validation

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
    }),
  ],
})
export class AppModule {}
```

## Configuration Namespaces

```typescript
// config/database.config.ts
export default () => ({
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
  ],
})
export class AppModule {}

// Usage
const host = this.config.get<string>('database.host');
```

## Multiple .env Files

```typescript
ConfigModule.forRoot({
  envFilePath: ['.env.local', '.env'],
  expandVariables: true,
})
```
