# Decorator Route

Decorator phương thức HTTP để định nghĩa route.

## Phương thức HTTP

```typescript
import { Get, Post, Put, Patch, Delete, Head, Options, All } from '@galaxy-stack/orbit-common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Post()
  create(@Body() data: CreateUserDto) {}

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {}

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() data: Partial<UpdateUserDto>) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}

  @Head(':id')
  checkExists(@Param('id') id: string) {}

  @Options()
  options() {}

  @All('*')
  handleAll() {}
}
```

## Tham số Route

```typescript
@Get('users/:userId/posts/:postId')
getPost(
  @Param('userId') userId: string,
  @Param('postId') postId: string,
) {}

@Get('files/*')
getFile(@Param('*') filePath: string) {}
```

## @HttpCode

Đặt mã trạng thái phản hồi.

```typescript
import { HttpCode } from '@galaxy-stack/orbit-common';

@Post()
@HttpCode(201)
create() {}

@Delete(':id')
@HttpCode(204)
remove() {}
```

## @Header

Đặt header phản hồi.

```typescript
import { Header } from '@galaxy-stack/orbit-common';

@Get()
@Header('Cache-Control', 'max-age=3600')
@Header('X-Custom-Header', 'value')
findAll() {}
```

## @Redirect

Chuyển hướng đến URL khác.

```typescript
import { Redirect } from '@galaxy-stack/orbit-common';

@Get('old-path')
@Redirect('new-path', 301)
redirect() {}

@Get('dynamic')
@Redirect()
dynamicRedirect() {
  return { url: '/target', statusCode: 302 };
}
```

## @Render

Hiển thị template view.

```typescript
import { Render } from '@galaxy-stack/orbit-common';

@Get()
@Render('index')
root() {
  return { title: 'Home' };
}
```