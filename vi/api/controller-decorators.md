# Decorator Controller

Decorator để định nghĩa controller và metadata của chúng.

## @Controller

Đánh dấu một class là controller với tiền tố route tùy chọn.

```typescript
import { Controller } from '@galaxy-stack/orbit-common';

@Controller()
export class AppController {}

@Controller('users')
export class UsersController {}

@Controller({ path: 'api/v1/users', host: 'api.example.com' })
export class ApiUsersController {}
```

### Tùy chọn

| Tùy chọn | Kiểu | Mô tả |
|----------|------|------|
| `path` | string | Tiền tố route |
| `host` | string | Khớp header host |
| `scope` | Scope | Phạm vi yêu cầu |
| `version` | string | Phiên bản API |

## @UseGuards

Áp dụng guard cho controller hoặc phương thức.

```typescript
import { UseGuards } from '@galaxy-stack/orbit-common';
import { AuthGuard } from './auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {}

@Controller('posts')
export class PostsController {
  @Get()
  @UseGuards(AuthGuard)
  findAll() {}
}
```

## @UseInterceptors

Áp dụng interceptor cho controller hoặc phương thức.

```typescript
import { UseInterceptors } from '@galaxy-stack/orbit-common';

@Controller('users')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UsersController {}
```

## @UsePipes

Áp dụng pipe cho controller hoặc phương thức.

```typescript
import { UsePipes, ValidationPipe } from '@galaxy-stack/orbit-common';

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {}
```

## @UseFilters

Áp dụng bộ lọc ngoại lệ.

```typescript
import { UseFilters } from '@galaxy-stack/orbit-common';

@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {}
```

## @Version

Đặt phiên bản API cho controller.

```typescript
import { Controller, Version } from '@galaxy-stack/orbit-common';

@Controller('users')
@Version('1')
export class UsersV1Controller {}

@Controller('users')
@Version('2')
export class UsersV2Controller {}
```