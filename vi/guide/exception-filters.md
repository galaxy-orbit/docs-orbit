# Bộ lọc ngoại lệ

Bộ lọc ngoại lệ xử lý các lỗi được ném ra trong quá trình xử lý yêu cầu và chuyển đổi chúng thành phản hồi HTTP phù hợp.

## Ngoại lệ tích hợp

```typescript
import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@galaxy-stack/orbit-core';

@Get(':id')
findOne(@Param('id') id: string) {
  const user = this.userService.findOne(id);
  
  if (!user) {
    throw new NotFoundException(`Người dùng ${id} không tìm thấy`);
  }
  
  return user;
}
```

## Bộ lọc ngoại lệ tùy chỉnh

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@galaxy-stack/orbit-core';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    return new Response(
      JSON.stringify({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      }),
      {
        status,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
```

## Sử dụng Bộ lọc ngoại lệ

### Cấp độ Phương thức

```typescript
@Get()
@UseFilters(HttpExceptionFilter)
findAll() {
  return [];
}
```

### Cấp độ Controller

```typescript
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UserController {}
```

### Bộ lọc toàn cục

```typescript
const app = await BunFactory.create(AppModule);
app.useGlobalFilters(new HttpExceptionFilter());
```

## Bắt tất cả các ngoại lệ

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;

    const message = exception instanceof Error
      ? exception.message
      : 'Lỗi máy chủ nội bộ';

    console.error('Ngoại lệ chưa xử lý:', exception);

    return new Response(
      JSON.stringify({
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      }),
      {
        status,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
```

## Bắt ngoại lệ cụ thể

```typescript
@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    return new Response(
      JSON.stringify({
        statusCode: 400,
        message: 'Xác thực thất bại',
        errors: exception.errors,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
```

## Ngoại lệ tùy chỉnh

```typescript
export class BusinessException extends HttpException {
  constructor(
    public code: string,
    message: string,
    status: number = 400
  ) {
    super(message, status);
  }
}

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException, host: ArgumentsHost) {
    return new Response(
      JSON.stringify({
        statusCode: exception.getStatus(),
        code: exception.code,
        message: exception.message,
      }),
      {
        status: exception.getStatus(),
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
```

## Bộ lọc ngoại lệ với DI

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error('Ngoại lệ HTTP', {
      status: exception.getStatus(),
      message: exception.message,
    });
    
    // Xử lý phản hồi...
  }
}
```