# Controller

Controller xử lý các yêu cầu đến và trả về phản hồi cho client.

## Controller cơ bản

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@galaxy-stack/orbit-core';

@Controller('users')
export class UserController {
  @Get()
  findAll() {
    return { users: [] };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id };
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return { created: body };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return { updated: id, data: body };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return { deleted: id };
  }
}
```

## Tham số Route

### Tham số đường dẫn

```typescript
@Get(':id')
findOne(@Param('id') id: string) {
  return { id };
}

@Get(':category/:id')
findByCategory(
  @Param('category') category: string,
  @Param('id') id: string
) {
  return { category, id };
}
```

### Tham số truy vấn

```typescript
@Get()
findAll(
  @Query('page') page: string = '1',
  @Query('limit') limit: string = '10',
  @Query() allQueries: Record<string, string>
) {
  return { page, limit, allQueries };
}
```

### Nội dung yêu cầu

```typescript
@Post()
create(@Body() body: CreateUserDto) {
  return body;
}

@Post()
createPartial(@Body('name') name: string) {
  return { name };
}
```

## Yêu cầu & Phản hồi

```typescript
@Get()
handleRequest(@Req() request: Request, @Res() response: Response) {
  // Truy cập đối tượng Request và Response gốc
}
```

## Header

```typescript
@Get()
getWithHeaders(@Headers('authorization') auth: string) {
  return { auth };
}

@Get()
@Header('Cache-Control', 'max-age=3600')
cachedResponse() {
  return { data: 'cached' };
}
```

## Mã trạng thái

```typescript
@Post()
@HttpCode(201)
create(@Body() body: CreateUserDto) {
  return body;
}
```

## Chuyển hướng

```typescript
@Get('old-path')
@Redirect('/new-path', 301)
redirectToNew() {
  // Tùy chọn: return { url, statusCode } để ghi đè
}
```

## Ký tự đại diện

```typescript
@Get('ab*cd')
wildcardRoute() {
  return { matched: 'ab*cd' };
}
```

## Định tuyến sub-domain

```typescript
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  adminIndex() {
    return { admin: true };
  }
}
```