# Parameter Decorators

Extract data from requests using parameter decorators.

## Request Data

```typescript
import { 
  Body, Query, Param, Headers, Req, Res, 
  Ip, Session, HostParam 
} from '@galaxy-stack/orbit-common';

@Controller('users')
export class UsersController {
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Param() params: { id: string },
  ) {}

  @Get()
  findAll(
    @Query('page') page: string,
    @Query() query: { page: string; limit: string },
  ) {}

  @Post()
  create(
    @Body() body: CreateUserDto,
    @Body('name') name: string,
  ) {}

  @Get()
  withHeaders(
    @Headers('authorization') auth: string,
    @Headers() headers: Record<string, string>,
  ) {}

  @Get()
  withRequest(@Req() request: Request) {}

  @Get()
  withIp(@Ip() ip: string) {}
}
```

## @Body

Extract request body.

```typescript
@Post()
create(@Body() data: CreateUserDto) {}

@Post()
createWithValidation(@Body(ValidationPipe) data: CreateUserDto) {}

@Patch()
update(@Body('name') name: string) {}
```

## @Query

Extract query parameters.

```typescript
@Get()
search(@Query('q') query: string) {}

@Get()
paginate(
  @Query('page', ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
) {}
```

## @Param

Extract route parameters.

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {}

@Get(':userId/posts/:postId')
getPost(
  @Param('userId') userId: string,
  @Param('postId') postId: string,
) {}
```

## @Headers

Extract request headers.

```typescript
@Get()
withAuth(@Headers('authorization') token: string) {}

@Get()
allHeaders(@Headers() headers: Record<string, string>) {}
```

## Custom Decorators

```typescript
import { createParamDecorator, ExecutionContext } from '@galaxy-stack/orbit-common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

@Get('profile')
getProfile(@User() user: UserEntity) {}

@Get('profile')
getUserId(@User('id') userId: number) {}
```
