# Controller Decorators

Decorators for defining controllers and their metadata.

## @Controller

Mark a class as a controller with optional route prefix.

```typescript
import { Controller } from '@galaxy-stack/orbit-common';

@Controller()
export class AppController {}

@Controller('users')
export class UsersController {}

@Controller({ path: 'api/v1/users', host: 'api.example.com' })
export class ApiUsersController {}
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `path` | string | Route prefix |
| `host` | string | Host header matching |
| `scope` | Scope | Request scope |
| `version` | string | API version |

## @UseGuards

Apply guards to controller or method.

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

Apply interceptors to controller or method.

```typescript
import { UseInterceptors } from '@galaxy-stack/orbit-common';

@Controller('users')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UsersController {}
```

## @UsePipes

Apply pipes to controller or method.

```typescript
import { UsePipes, ValidationPipe } from '@galaxy-stack/orbit-common';

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {}
```

## @UseFilters

Apply exception filters.

```typescript
import { UseFilters } from '@galaxy-stack/orbit-common';

@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {}
```

## @Version

Set API version for controller.

```typescript
import { Controller, Version } from '@galaxy-stack/orbit-common';

@Controller('users')
@Version('1')
export class UsersV1Controller {}

@Controller('users')
@Version('2')
export class UsersV2Controller {}
```
