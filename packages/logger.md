# @galaxy-stack/orbit-logger

Structured logging module for Orbit framework.

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
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async createUser(data: CreateUserDto) {
    this.logger.log('Creating user', { email: data.email });
    
    try {
      const user = await this.usersRepo.create(data);
      this.logger.log('User created', { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack, { email: data.email });
      throw error;
    }
  }
}
```

## Log Levels

```typescript
this.logger.verbose('Detailed debug info');  // Level 0
this.logger.debug('Debug information');       // Level 1
this.logger.log('General information');       // Level 2
this.logger.warn('Warning message');          // Level 3
this.logger.error('Error occurred', stack);   // Level 4
this.logger.fatal('Critical failure');        // Level 5
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

## Custom Transports

```typescript
LoggerModule.forRoot({
  transports: [
    'console',
    {
      type: 'file',
      filename: 'app.log',
      maxSize: '10m',
      maxFiles: 5,
    },
  ],
})
```

## JSON Output Format

```json
{
  "level": "info",
  "message": "User created",
  "context": "UsersService",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "userId": 123
}
```

## Injecting Logger

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
