# Tham chiếu Decorator

Tham chiếu đầy đủ cho tất cả các decorator Orbit.

## Decorator Module

### @Module

Định nghĩa một module với các phụ thuộc của nó.

```typescript
@Module({
  imports: [OtherModule],      // Module để import
  controllers: [MyController], // Controller HTTP
  providers: [MyService],      // Provider có thể tiêm
  exports: [MyService],        // Provider để chia sẻ
})
class MyModule {}
```

### @Global

Làm cho module trở thành toàn cục (provider có sẵn ở mọi nơi).

```typescript
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}
```

## Decorator Controller

### @Controller

Khai báo một class là controller HTTP.

```typescript
@Controller()              // Không có tiền tố
@Controller('users')       // Với tiền tố
@Controller({ path: 'users', host: 'admin.example.com' })
```

## Decorator Route

### Phương thức HTTP

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
@All()                    // Tất cả phương thức
```

### @HttpCode

Đặt mã trạng thái phản hồi.

```typescript
@Post()
@HttpCode(201)
create() {}
```

### @Header

Đặt header phản hồi.

```typescript
@Get()
@Header('Cache-Control', 'max-age=3600')
getData() {}
```

### @Redirect

Chuyển hướng đến URL khác.

```typescript
@Get('old')
@Redirect('/new', 301)
redirect() {}
```

### @Render

Hiển thị template view.

```typescript
@Get()
@Render('index')
index() {
  return { title: 'Home' };
}
```

## Decorator Tham số

### Dữ liệu Yêu cầu

```typescript
@Get(':id')
handler(
  @Param() params: object,           // Tất cả tham số
  @Param('id') id: string,           // Một tham số
  @Query() query: object,            // Tất cả tham số truy vấn
  @Query('page') page: string,       // Một tham số truy vấn
  @Body() body: object,              // Nội dung yêu cầu
  @Body('name') name: string,        // Thuộc tính nội dung
  @Headers() headers: object,        // Tất cả header
  @Headers('auth') auth: string,     // Một header
) {}
```

### Đối tượng Yêu cầu/Phản hồi

```typescript
@Get()
handler(
  @Req() request: Request,
  @Res() response: Response,
) {}
```

### Decorator Tùy chỉnh

```typescript
const CurrentUser = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

@Get()
handler(@CurrentUser() user: User) {}
```

## Decorator Có thể tiêm

### @Injectable

Đánh dấu một class là có thể tiêm.

```typescript
@Injectable()
class MyService {}

@Injectable({ scope: Scope.REQUEST })
class RequestScopedService {}

@Injectable({ scope: Scope.TRANSIENT })
class TransientService {}
```

### @Inject

Tiêm bằng token.

```typescript
constructor(
  @Inject('CONFIG') config: Config,
  @Inject(DATABASE_TOKEN) db: Database,
) {}
```

### @Optional

Đánh dấu phụ thuộc là tùy chọn.

```typescript
constructor(
  @Optional() logger?: LoggerService,
) {}
```

## Decorator Pipeline

### @UseGuards

Áp dụng guard.

```typescript
@UseGuards(AuthGuard)
@UseGuards(AuthGuard, RolesGuard)
```

### @UsePipes

Áp dụng pipe.

```typescript
@UsePipes(ValidationPipe)
@UsePipes(new ValidationPipe({ transform: true }))
```

### @UseInterceptors

Áp dụng interceptor.

```typescript
@UseInterceptors(LoggingInterceptor)
@UseInterceptors(CacheInterceptor, TransformInterceptor)
```

### @UseFilters

Áp dụng bộ lọc ngoại lệ.

```typescript
@UseFilters(HttpExceptionFilter)
```

## Decorator Metadata

### @SetMetadata

Đặt metadata tùy chỉnh.

```typescript
@SetMetadata('roles', ['admin'])
@Get()
adminOnly() {}

// Hoặc tạo decorator tùy chỉnh
const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Roles('admin', 'moderator')
@Get()
handler() {}
```

## Decorator Vòng đời

```typescript
class MyService implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    console.log('Module đã khởi tạo');
  }

  onModuleDestroy() {
    console.log('Module đã hủy');
  }
}
```

## Decorator Phiên bản

### @Version

Đặt phiên bản API.

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