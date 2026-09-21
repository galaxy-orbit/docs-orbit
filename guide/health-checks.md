# Health Checks

Monitor your application's health with built-in indicators.

## Installation

```bash
bun add @galaxy-stack/orbit-terminus
```

## Setup

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { TerminusModule } from '@galaxy-stack/orbit-terminus';

@Module({
  imports: [TerminusModule],
})
export class AppModule {}
```

## Health Controller

```typescript
import { Controller, Get } from '@galaxy-stack/orbit-core';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  HttpHealthIndicator,
  DatabaseHealthIndicator,
} from '@galaxy-stack/orbit-terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private http: HttpHealthIndicator,
    private database: DatabaseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      () => this.database.pingCheck('database'),
    ]);
  }

  @Get('live')
  @HealthCheck()
  liveness() {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.database.pingCheck('database'),
    ]);
  }
}
```

## Health Indicators

### Memory Indicator

```typescript
// Check heap memory usage (< 150MB)
this.memory.checkHeap('memory_heap', 150 * 1024 * 1024);

// Check RSS memory usage (< 300MB)
this.memory.checkRSS('memory_rss', 300 * 1024 * 1024);
```

### HTTP Indicator

```typescript
// Check external service availability
this.http.pingCheck('api', 'https://api.example.com/health');

// With timeout
this.http.pingCheck('api', 'https://api.example.com/health', {
  timeout: 5000,
});
```

### Database Indicator

```typescript
// Simple ping check
this.database.pingCheck('database');

// With custom query
this.database.pingCheck('database', {
  query: 'SELECT 1',
  timeout: 3000,
});
```

### Redis Indicator

```typescript
import { RedisHealthIndicator } from '@galaxy-stack/orbit-terminus';

@Controller('health')
export class HealthController {
  constructor(private redis: RedisHealthIndicator) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.redis.pingCheck('redis'),
    ]);
  }
}
```

## Custom Indicators

```typescript
import { Injectable } from '@galaxy-stack/orbit-core';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@galaxy-stack/orbit-terminus';

@Injectable()
export class QueueHealthIndicator extends HealthIndicator {
  constructor(private queueService: QueueService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const queueSize = await this.queueService.getSize();
    const isHealthy = queueSize < 1000;

    const result = this.getStatus(key, isHealthy, { queueSize });

    if (!isHealthy) {
      throw new HealthCheckError('Queue is overloaded', result);
    }

    return result;
  }
}
```

## Response Format

Healthy response:

```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "redis": { "status": "up" }
  },
  "details": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "redis": { "status": "up" }
  }
}
```

Unhealthy response:

```json
{
  "status": "error",
  "info": {
    "memory_heap": { "status": "up" }
  },
  "error": {
    "database": { "status": "down", "message": "Connection refused" }
  },
  "details": {
    "memory_heap": { "status": "up" },
    "database": { "status": "down", "message": "Connection refused" }
  }
}
```

## Kubernetes Integration

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Graceful Shutdown

```typescript
import { OnApplicationShutdown } from '@galaxy-stack/orbit-core';

@Injectable()
export class AppService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    console.log('Received shutdown signal:', signal);
    
    // Close database connections
    await this.database.close();
    
    // Complete pending requests
    await this.waitForPendingRequests();
  }
}
```
