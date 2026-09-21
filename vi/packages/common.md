# @galaxy-stack/orbit-common

Decorator, pipe, guard và exception được chia sẻ cho các ứng dụng Orbit.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-common
```

## Ngoại lệ HTTP

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

throw new NotFoundException('Không tìm thấy người dùng');
throw new BadRequestException('Dữ liệu đầu vào không hợp lệ');
throw new UnauthorizedException();
```

## Pipe tích hợp

### ParseIntPipe

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return { id }; // id chắc chắn là số
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

## Tải lên tệp

```typescript
import { UploadedFile, FileInterceptor } from '@galaxy-stack/orbit-common';

@Post('upload')
@UseInterceptors(FileInterceptor('file'))
upload(@UploadedFile() file: File) {
  return { filename: file.name, size: file.size };
}
```

## Decorator tiện ích

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
    // Kiểm tra vai trò...
  }
}
```

## Ngữ cảnh thực thi

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

## Metadata tham số

```typescript
interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: Type<unknown>;
  data?: string;
}
```

## Tất cả Xuất khẩu

```typescript
// Ngoại lệ
export {
  HttpException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  // ... thêm nữa
};

// Pipe
export {
  ParseIntPipe,
  ParseBoolPipe,
  ParseFloatPipe,
  ParseArrayPipe,
  DefaultValuePipe,
  TrimPipe,
  ValidationPipe,
};

// Decorator
export {
  SetMetadata,
  UseGuards,
  UsePipes,
  UseInterceptors,
  UseFilters,
};

// Tiện ích
export { Reflector };

// Interface
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