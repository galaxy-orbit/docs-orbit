# Exception Filters

Exception filters handle errors thrown during request processing and transform them into appropriate HTTP responses.

## Built-in Exceptions

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
    throw new NotFoundException(`User ${id} not found`);
  }
  
  return user;
}
```

## Custom Exception Filter

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

## Using Exception Filters

### Method Level

```typescript
@Get()
@UseFilters(HttpExceptionFilter)
findAll() {
  return [];
}
```

### Controller Level

```typescript
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UserController {}
```

### Global Filters

```typescript
const app = await BunFactory.create(AppModule);
app.useGlobalFilters(new HttpExceptionFilter());
```

## Catch All Exceptions

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
      : 'Internal server error';

    console.error('Unhandled exception:', exception);

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

## Catch Specific Exceptions

```typescript
@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    return new Response(
      JSON.stringify({
        statusCode: 400,
        message: 'Validation failed',
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

## Custom Exceptions

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

## Exception Filter with DI

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error('HTTP Exception', {
      status: exception.getStatus(),
      message: exception.message,
    });
    
    // Handle response...
  }
}
```
