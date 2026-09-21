# Configuration

Environment-based configuration with `@galaxy-stack/orbit-config`.

## Setup

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { ConfigModule } from '@galaxy-stack/orbit-config';

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

## Using ConfigService

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';
import { ConfigService } from '@galaxy-stack/orbit-config';

@Injectable()
export class DatabaseService {
  constructor(private config: ConfigService) {}

  connect() {
    const url = this.config.get<string>('DATABASE_URL');
    const poolSize = this.config.get<number>('DB_POOL_SIZE', 10);
  }
}
```

## Typed Configuration

```typescript
import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string().optional(),
});

type Config = z.infer<typeof configSchema>;

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config) => configSchema.parse(config),
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
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, redisConfig, authConfig],
    }),
  ],
})
export class AppModule {}

// Usage
const dbHost = this.config.get<string>('database.host');
```

## Environment Expansion

```bash
# .env
BASE_URL=https://api.example.com
API_URL=${BASE_URL}/v1
CALLBACK_URL=${BASE_URL}/auth/callback
```
