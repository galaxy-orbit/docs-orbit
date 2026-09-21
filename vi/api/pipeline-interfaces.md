# Interface Pipeline

Interface cho guard, pipe, interceptor và filter.

## CanActivate (Guard)

```typescript
interface CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return !!request.user;
  }
}
```

## PipeTransform (Pipe)

```typescript
interface PipeTransform<T = any, R = any> {
  transform(value: T, metadata: ArgumentMetadata): R;
}

interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: Type<any>;
  data?: string;
}

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Xác thực thất bại');
    }
    return val;
  }
}
```

## NestInterceptor (Interceptor)

```typescript
interface NestInterceptor<T = any, R = any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R>;
}

interface CallHandler<T = any> {
  handle(): Observable<T>;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`Yêu cầu mất ${Date.now() - now}ms`)),
    );
  }
}
```

## ExceptionFilter (Filter)

```typescript
interface ExceptionFilter<T = any> {
  catch(exception: T, host: ArgumentsHost): void;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
```

## ExecutionContext

```typescript
interface ExecutionContext extends ArgumentsHost {
  getClass<T = any>(): Type<T>;
  getHandler(): Function;
}

interface ArgumentsHost {
  getArgs<T extends any[] = any[]>(): T;
  getArgByIndex<T = any>(index: number): T;
  switchToHttp(): HttpArgumentsHost;
  switchToWs(): WsArgumentsHost;
  switchToRpc(): RpcArgumentsHost;
  getType<T extends string = string>(): T;
}
```