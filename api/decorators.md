# Decorators Reference

Complete reference for all Orbit decorators.

## Module Decorators

### @Module

Defines a module with its dependencies.

```typescript
@Module({
  imports: [OtherModule],      // Modules to import
  controllers: [MyController], // HTTP controllers
  providers: [MyService],      // Injectable providers
  exports: [MyService],        // Providers to share
})
class MyModule {}
```

### @Global

Makes a module global (providers available everywhere).

```typescript
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}
```

## Controller Decorators

### @Controller

Declares a class as an HTTP controller.

```typescript
@Controller()              // No prefix
@Controller('users')       // With prefix
@Controller({ path: 'users', host: 'admin.example.com' })
```

## Route Decorators

### HTTP Methods

```typescript
@Get()                    // GET /
@Get('path')              // GET /path
@Get(':id')               // GET /:id

@Post()
@Put()
@Patch()
@Delete()
@Options()
@Head()
@All()                    // All methods
```

### @HttpCode

Set response status code.

```typescript
@Post()
@HttpCode(201)
create() {}
```

### @Header

Set response header.

```typescript
@Get()
@Header('Cache-Control', 'max-age=3600')
getData() {}
```

### @Redirect

Redirect to another URL.

```typescript
@Get('old')
@Redirect('/new', 301)
redirect() {}
```

### @Render

Render a view template.

```typescript
@Get()
@Render('index')
index() {
  return { title: 'Home' };
}
```

## Parameter Decorators

### Request Data

```typescript
@Get(':id')
handler(
  @Param() params: object,           // All params
  @Param('id') id: string,           // Single param
  @Query() query: object,            // All query params
  @Query('page') page: string,       // Single query param
  @Body() body: object,              // Request body
  @Body('name') name: string,        // Body property
  @Headers() headers: object,        // All headers
  @Headers('auth') auth: string,     // Single header
) {}
```

### Request/Response Objects

```typescript
@Get()
handler(
  @Req() request: Request,
  @Res() response: Response,
) {}
```

### Custom Decorators

```typescript
const CurrentUser = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

@Get()
handler(@CurrentUser() user: User) {}
```

## Injectable Decorators

### @Injectable

Marks a class as injectable.

```typescript
@Injectable()
class MyService {}

@Injectable({ scope: Scope.REQUEST })
class RequestScopedService {}

@Injectable({ scope: Scope.TRANSIENT })
class TransientService {}
```

### @Inject

Inject by token.

```typescript
constructor(
  @Inject('CONFIG') config: Config,
  @Inject(DATABASE_TOKEN) db: Database,
) {}
```

### @Optional

Mark dependency as optional.

```typescript
constructor(
  @Optional() logger?: LoggerService,
) {}
```

## Pipeline Decorators

### @UseGuards

Apply guards.

```typescript
@UseGuards(AuthGuard)
@UseGuards(AuthGuard, RolesGuard)
```

### @UsePipes

Apply pipes.

```typescript
@UsePipes(ValidationPipe)
@UsePipes(new ValidationPipe({ transform: true }))
```

### @UseInterceptors

Apply interceptors.

```typescript
@UseInterceptors(LoggingInterceptor)
@UseInterceptors(CacheInterceptor, TransformInterceptor)
```

### @UseFilters

Apply exception filters.

```typescript
@UseFilters(HttpExceptionFilter)
```

## Metadata Decorators

### @SetMetadata

Set custom metadata.

```typescript
@SetMetadata('roles', ['admin'])
@Get()
adminOnly() {}

// Or create custom decorator
const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Roles('admin', 'moderator')
@Get()
handler() {}
```

## Lifecycle Decorators

```typescript
class MyService implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    console.log('Module initialized');
  }

  onModuleDestroy() {
    console.log('Module destroyed');
  }
}
```

## Versioning Decorators

### @Version

Set API version.

```typescript
@Controller('users')
class UserController {
  @Get()
  @Version('1')
  findAllV1() {}

  @Get()
  @Version('2')
  findAllV2() {}

  @Get()
  @Version(VERSION_NEUTRAL)
  findAllNeutral() {}
}
```
