# Logging

Structured logging with `@galaxy-stack/orbit-logger`.

## Installation

```bash
bun add @galaxy-stack/orbit-logger
```

## Setup

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { LoggerModule } from '@galaxy-stack/orbit-logger';

@Module({
  imports: [
    LoggerModule.forRoot({
      level: 'info',
      format: 'json',
      transports: ['console'],
    }),
  ],
})
export class AppModule {}
```

## Using Logger

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';
import { Logger } from '@galaxy-stack/orbit-logger';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  createUser(data: CreateUserDto) {
    this.logger.log('Creating user', { email: data.email });
    
    try {
      const user = this.userRepository.create(data);
      this.logger.log('User created', { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack);
      throw error;
    }
  }
}
```

## Log Levels

```typescript
this.logger.verbose('Verbose message');  // Level 0
this.logger.debug('Debug message');      // Level 1
this.logger.log('Info message');         // Level 2
this.logger.warn('Warning message');     // Level 3
this.logger.error('Error message');      // Level 4
this.logger.fatal('Fatal error');        // Level 5
```

## Structured Logging

```typescript
this.logger.log('Order processed', {
  orderId: order.id,
  userId: order.userId,
  total: order.total,
  processingTime: Date.now() - startTime,
});
```

Output:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Order processed",
  "context": "OrderService",
  "orderId": "ord_123",
  "userId": "usr_456",
  "total": 99.99,
  "processingTime": 45
}
```

## Configuration Options

```typescript
LoggerModule.forRoot({
  level: 'info',              // Minimum log level
  format: 'json',             // 'json' | 'pretty' | 'simple'
  timestamp: true,            // Include timestamps
  context: true,              // Include context name
  transports: ['console'],    // Output targets
  redact: ['password', 'token'], // Fields to redact
})
```

## File Transport

```typescript
LoggerModule.forRoot({
  transports: [
    'console',
    {
      type: 'file',
      filename: 'app.log',
      maxSize: '10m',      // 10 MB
      maxFiles: 5,         // Keep 5 files
      compress: true,      // Compress rotated files
    },
  ],
})
```

## Request Logging Middleware

```typescript
import { Injectable, NestMiddleware } from '@galaxy-stack/orbit-common';
import { Logger } from '@galaxy-stack/orbit-logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  async use(request: Request, next: () => Promise<Response>): Promise<Response> {
    const start = Date.now();
    
    const response = await next();
    
    const duration = Date.now() - start;
    
    this.logger.log(`${request.method} ${request.url}`, {
      status: response.status,
      duration,
    });
    
    return response;
  }
}
```

## Error Logging

```typescript
import { Catch, ExceptionFilter, ArgumentsHost } from '@galaxy-stack/orbit-common';
import { Logger } from '@galaxy-stack/orbit-logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    this.logger.error(
      `Exception on ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );
  }
}
```

## Environment-Based Logging

```typescript
const isProduction = process.env.NODE_ENV === 'production';

LoggerModule.forRoot({
  level: isProduction ? 'warn' : 'debug',
  format: isProduction ? 'json' : 'pretty',
})
```

## Injecting LoggerService

```typescript
import { LoggerService } from '@galaxy-stack/orbit-logger';

@Injectable()
export class AppService {
  constructor(private readonly logger: LoggerService) {}

  doSomething() {
    this.logger.log('Doing something', 'AppService');
  }
}
```

## See Also

- [Tracing](/guide/tracing) - Distributed tracing with OpenTelemetry
- [Metrics](/guide/metrics) - Prometheus metrics
- [@galaxy-stack/orbit-logger](/packages/logger) - API Reference

## Log Buffer + Live Tail (devtools)

Since logger 0.3.0, every `LoggerService` pushes entries into a shared in-memory
ring buffer (default capacity 5000). The devtools dashboard reads from it:

- `GET /__devtools/api/logs?level=&q=&requestId=&sinceMs=&limit=` — filtered history
- `GET /__devtools/api/logs/stream` — SSE live tail

Disable per-service with `LoggerModule.forRoot({ buffer: false })`, or supply a
custom buffer instance. `child()` loggers inherit the parent buffer.

For the React dashboard that consumes these endpoints, see `apps/dashboard`
(`bun run dev:dashboard`).
