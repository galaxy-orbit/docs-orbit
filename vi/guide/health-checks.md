# Kiểm tra sức khỏe

Giám sát sức khỏe ứng dụng của bạn với các chỉ số tích hợp.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-terminus
```

## Thiết lập

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { TerminusModule } from '@galaxy-stack/orbit-terminus';

@Module({
  imports: [TerminusModule],
})
export class AppModule {}
```

## Controller kiểm tra sức khỏe

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

## Chỉ số sức khỏe

### Chỉ số bộ nhớ

```typescript
// Kiểm tra sử dụng bộ nhớ heap (< 150MB)
this.memory.checkHeap('memory_heap', 150 * 1024 * 1024);

// Kiểm tra sử dụng bộ nhớ RSS (< 300MB)
this.memory.checkRSS('memory_rss', 300 * 1024 * 1024);
```

### Chỉ số HTTP

```typescript
// Kiểm tra tính khả dụng của dịch vụ bên ngoài
this.http.pingCheck('api', 'https://api.example.com/health');

// Với thời gian chờ
this.http.pingCheck('api', 'https://api.example.com/health', {
  timeout: 5000,
});
```

### Chỉ số cơ sở dữ liệu

```typescript
// Kiểm tra ping đơn giản
this.database.pingCheck('database');

// Với truy vấn tùy chỉnh
this.database.pingCheck('database', {
  query: 'SELECT 1',
  timeout: 3000,
});
```

### Chỉ số Redis

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

## Chỉ số tùy chỉnh

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
      throw new HealthCheckError('Hàng đợi bị quá tải', result);
    }

    return result;
  }
}
```

## Định dạng phản hồi

Phản hồi khi khỏe mạnh:

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

Phản hồi khi không khỏe mạnh:

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

## Tích hợp Kubernetes

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

## Tắt ứng dụng đúng cách

```typescript
import { OnApplicationShutdown } from '@galaxy-stack/orbit-core';

@Injectable()
export class AppService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    console.log('Nhận tín hiệu tắt:', signal);
    
    // Đóng kết nối cơ sở dữ liệu
    await this.database.close();
    
    // Hoàn thành các yêu cầu đang chờ
    await this.waitForPendingRequests();
  }
}
```