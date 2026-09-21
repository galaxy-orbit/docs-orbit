# Controllers

Controllers handle incoming requests and return responses to the client.

## Basic Controller

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

## Route Parameters

### Path Parameters

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

### Query Parameters

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

### Request Body

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

## Request & Response

```typescript
@Get()
handleRequest(@Req() request: Request, @Res() response: Response) {
  // Access raw Request and Response objects
}
```

## Headers

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

## Status Codes

```typescript
@Post()
@HttpCode(201)
create(@Body() body: CreateUserDto) {
  return body;
}
```

## Redirects

```typescript
@Get('old-path')
@Redirect('/new-path', 301)
redirectToNew() {
  // Optional: return { url, statusCode } to override
}
```

## Wildcards

```typescript
@Get('ab*cd')
wildcardRoute() {
  return { matched: 'ab*cd' };
}
```

## Sub-domain Routing

```typescript
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  adminIndex() {
    return { admin: true };
  }
}
```
