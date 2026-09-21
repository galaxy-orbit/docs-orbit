# Ghi nhật ký

Ghi nhật ký có cấu trúc với `@galaxy-stack/orbit-logger`.

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
export class UserService {
  private readonly logger = new Logger(UserService.name);

  createUser(data: CreateUserDto) {
    this.logger.log('Đang tạo người dùng', { email: data.email });
    
    try {
      const user = this.userRepository.create(data);
      this.logger.log('Người dùng đã được tạo', { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error('Không thể tạo người dùng', error.stack);
      throw error;
    }
  }
}
```

## Cấp độ nhật ký

```typescript
this.logger.verbose('Thông báo chi tiết');  // Cấp độ 0
this.logger.debug('Thông báo gỡ lỗi');      // Cấp độ 1
this.logger.log('Thông báo thông tin');     // Cấp độ 2
this.logger.warn('Cảnh báo');               // Cấp độ 3
this.logger.error('Lỗi');                   // Cấp độ 4
this.logger.fatal('Lỗi nghiêm trọng');      // Cấp độ 5
```

## Ghi nhật ký có cấu trúc

```typescript
this.logger.log('Đơn hàng đã xử lý', {
  orderId: order.id,
  userId: order.userId,
  total: order.total,
  processingTime: Date.now() - startTime,
});
```

Đầu ra:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Đơn hàng đã xử lý",
  "context": "OrderService",
  "orderId": "ord_123",
  "userId": "usr_456",
  "total": 99.99,
  "processingTime": 45
}
```

## Tùy chọn cấu hình

```typescript
LoggerModule.forRoot({
  level: 'info',              // Cấp độ nhật ký tối thiểu
  format: 'json',             // 'json' | 'pretty' | 'simple'
  timestamp: true,            // Bao gồm dấu thời gian
  context: true,              // Bao gồm tên ngữ cảnh
  transports: ['console'],    // Đầu ra đích
  redact: ['password', 'token'], // Các trường cần che giấu
})
```

## Truyền tải tệp

```typescript
LoggerModule.forRoot({
  transports: [
    'console',
    {
      type: 'file',
      filename: 'app.log',
      maxSize: '10m',      // 10 MB
      maxFiles: 5,         // Giữ 5 tệp
      compress: true,      // Nén tệp xoay vòng
    },
  ],
})
```

## Middleware ghi nhật ký yêu cầu

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

## Ghi nhật ký lỗi

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
      `Ngoại lệ trên ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );
  }
}
```

## Ghi nhật ký dựa trên môi trường

```typescript
const isProduction = process.env.NODE_ENV === 'production';

LoggerModule.forRoot({
  level: isProduction ? 'warn' : 'debug',
  format: isProduction ? 'json' : 'pretty',
})
```

## Tiêm LoggerService

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

## Xem thêm

- [Truy vết](/vi/guide/tracing) - Truy vết phân tán với OpenTelemetry
- [Số liệu](/vi/guide/metrics) - Số liệu Prometheus
- [@galaxy-stack/orbit-logger](/packages/logger) - Tài liệu tham khảo API