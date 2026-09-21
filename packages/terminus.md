# @galaxy-stack/orbit-terminus

Health check module with indicators for monitoring.

## Installation

```bash
bun add @galaxy-stack/orbit-terminus
```

## Setup

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { TerminusModule } from '@galaxy-stack/orbit-terminus';

@Module({
  imports: [TerminusModule],
})
export class AppModule {}
```

## Health Controller

```typescript
import { Controller, Get } from '@galaxy-stack/orbit-common';
import { 
  HealthCheck, 
  HealthCheckService,
  MemoryHealthIndicator,
  HttpHealthIndicator,
} from '@galaxy-stack/orbit-terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
      () => this.http.pingCheck('api', 'https://api.example.com/health'),
    ]);
  }
}
```

## Database Health

```typescript
import { DatabaseHealthIndicator } from '@galaxy-stack/orbit-terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: DatabaseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
```

## Custom Indicators

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';
import { HealthIndicator, HealthIndicatorResult } from '@galaxy-stack/orbit-terminus';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private redis: RedisService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = await this.redis.ping();
    
    if (isHealthy) {
      return this.getStatus(key, true);
    }
    
    throw new HealthCheckError('Redis check failed', this.getStatus(key, false));
  }
}
```

## Response Format

```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "redis": { "status": "up" }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "redis": { "status": "up" }
  }
}
```
