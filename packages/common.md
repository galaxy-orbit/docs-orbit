# @galaxy-stack/orbit-common

Shared decorators, pipes, guards, and exceptions for Orbit applications.

## Installation

```bash
bun add @galaxy-stack/orbit-common
```

## HTTP Exceptions

```typescript
import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  GoneException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  InternalServerErrorException,
  NotImplementedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
} from '@galaxy-stack/orbit-common';

throw new NotFoundException('User not found');
throw new BadRequestException('Invalid input');
throw new UnauthorizedException();
```

## Built-in Pipes

### ParseIntPipe

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return { id }; // id is guaranteed to be number
}
```

### ParseBoolPipe

```typescript
@Get()
findAll(@Query('active', ParseBoolPipe) active: boolean) {
  return { active };
}
```

### ParseFloatPipe

```typescript
@Get()
findByPrice(@Query('price', ParseFloatPipe) price: number) {
  return { price };
}
```

### ParseArrayPipe

```typescript
@Get()
findByIds(@Query('ids', ParseArrayPipe) ids: string[]) {
  return { ids };
}
```

### DefaultValuePipe

```typescript
@Get()
findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number
) {
  return { page };
}
```

### TrimPipe

```typescript
@Post()
create(@Body('name', TrimPipe) name: string) {
  return { name: name.trim() };
}
```

## File Upload

```typescript
import { UploadedFile, FileInterceptor } from '@galaxy-stack/orbit-common';

@Post('upload')
@UseInterceptors(FileInterceptor('file'))
upload(@UploadedFile() file: File) {
  return { filename: file.name, size: file.size };
}
```

## Utility Decorators

### SetMetadata

```typescript
import { SetMetadata } from '@galaxy-stack/orbit-common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Get()
@Roles('admin', 'moderator')
adminOnly() {}
```

### Reflector

```typescript
import { Reflector } from '@galaxy-stack/orbit-common';

@Injectable()
class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // Check roles...
  }
}
```

## Execution Context

```typescript
interface ExecutionContext {
  switchToHttp(): HttpArgumentsHost;
  getHandler(): Function;
  getClass(): Function;
  getType(): string;
}

interface HttpArgumentsHost {
  getRequest<T = Request>(): T;
  getResponse<T = Response>(): T;
  getNext(): Function;
}
```

## Argument Metadata

```typescript
interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: Type<unknown>;
  data?: string;
}
```

## All Exports

```typescript
// Exceptions
export {
  HttpException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  // ... more
};

// Pipes
export {
  ParseIntPipe,
  ParseBoolPipe,
  ParseFloatPipe,
  ParseArrayPipe,
  DefaultValuePipe,
  TrimPipe,
  ValidationPipe,
};

// Decorators
export {
  SetMetadata,
  UseGuards,
  UsePipes,
  UseInterceptors,
  UseFilters,
};

// Utilities
export { Reflector };

// Interfaces
export {
  ExecutionContext,
  ArgumentsHost,
  ArgumentMetadata,
  CanActivate,
  PipeTransform,
  NestInterceptor,
  ExceptionFilter,
};
```
