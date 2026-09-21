# @galaxy-stack/orbit-logger

Module ghi log có cấu trúc cho framework Orbit.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-logger
```

## Thiết lập

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

## Sử dụng Logger

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';
import { Logger } from '@galaxy-stack/orbit-logger';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async createUser(data: CreateUserDto) {
    this.logger.log('Đang tạo người dùng', { email: data.email });
    
    try {
      const user = await this.usersRepo.create(data);
      this.logger.log('Người dùng đã tạo', { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error('Không thể tạo người dùng', error.stack, { email: data.email });
      throw error;
    }
  }
}
```

## Mức độ Log

```typescript
this.logger.verbose('Thông tin debug chi tiết');  // Mức 0
this.logger.debug('Thông tin debug');             // Mức 1
this.logger.log('Thông tin chung');               // Mức 2
this.logger.warn('Thông báo cảnh báo');           // Mức 3
this.logger.error('Lỗi xảy ra', stack);          // Mức 4
this.logger.fatal('Lỗi nghiêm trọng');            // Mức 5
```

## Ghi log có cấu trúc

```typescript
this.logger.log('Đơn hàng đã xử lý', {
  orderId: order.id,
  userId: order.userId,
  total: order.total,
  processingTime: Date.now() - startTime,
});
```

## Tùy chọn cấu hình

```typescript
LoggerModule.forRoot({
  level: 'info',              // Mức log tối thiểu
  format: 'json',             // 'json' | 'pretty' | 'simple'
  timestamp: true,            // Bao gồm dấu thời gian
  context: true,              // Bao gồm tên ngữ cảnh
  transports: ['console'],    // Đầu ra mục tiêu
  redact: ['password', 'token'], // Trường cần che giấu
})
```

## Transport tùy chỉnh

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

## Định dạng đầu ra JSON

```json
{
  "level": "info",
  "message": "Người dùng đã tạo",
  "context": "UsersService",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "userId": 123
}
```

## Tiêm Logger

```typescript
import { LoggerService } from '@galaxy-stack/orbit-logger';

@Injectable()
export class AppService {
  constructor(private readonly logger: LoggerService) {}

  doSomething() {
    this.logger.log('Đang thực hiện một việc gì đó', 'AppService');
  }
}
```