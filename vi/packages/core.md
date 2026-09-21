# @galaxy-stack/orbit-core

Gói lõi cung cấp nền tảng cho các ứng dụng Orbit.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-core reflect-metadata
```

## Tính năng

- **BunFactory**: Factory khởi tạo ứng dụng
- **Hệ thống Module**: Decorator @Module với imports/exports
- **Controller**: Bộ xử lý yêu cầu HTTP
- **Provider**: Tiêm phụ thuộc
- **Decorator**: Decorator route, tham số và vòng đời
- **Pipeline Yêu cầu**: Guard, Pipe, Interceptor, Filter

## Sử dụng cơ bản

```typescript
import 'reflect-metadata';
import { BunFactory, Module, Controller, Get, Injectable } from '@galaxy-stack/orbit-core';

@Injectable()
class AppService {
  getHello() {
    return 'Xin chào Thế giới!';
  }
}

@Controller()
class AppController {
  constructor(private appService: AppService) {}

  @Get()
  hello() {
    return this.appService.getHello();
  }
}

@Module({
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

const app = await BunFactory.create(AppModule);
await app.listen(3000);
```

## Decorator Module

```typescript
@Module({
  imports: [],      // Các module khác để import
  controllers: [],  // Controller HTTP
  providers: [],    // Dịch vụ có thể tiêm
  exports: [],      // Provider để chia sẻ
})
```

## Decorator Controller

```typescript
@Controller('prefix')
class MyController {
  @Get('path')
  @Post('path')
  @Put('path')
  @Patch('path')
  @Delete('path')
  @Options('path')
  @Head('path')
  @All('path')
}
```

## Decorator Tham số

```typescript
@Get(':id')
findOne(
  @Param('id') id: string,
  @Query('filter') filter: string,
  @Body() body: any,
  @Headers('authorization') auth: string,
  @Req() request: Request,
  @Res() response: Response,
) {}
```

## Phạm vi Injectable

```typescript
import { Scope } from '@galaxy-stack/orbit-core';

@Injectable()                          // Singleton (mặc định)
@Injectable({ scope: Scope.REQUEST })  // Mỗi yêu cầu
@Injectable({ scope: Scope.TRANSIENT }) // Instance mới mỗi lần tiêm
```

## Pipeline

```typescript
@UseGuards(AuthGuard)
@UsePipes(ValidationPipe)
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller()
class MyController {}
```

## Hook Vòng đời

```typescript
@Injectable()
class MyService implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    console.log('Module đã khởi tạo');
  }

  onModuleDestroy() {
    console.log('Module đã hủy');
  }
}
```

## Tham chiếu API

### BunFactory

```typescript
BunFactory.create(AppModule)           // Tạo ứng dụng HTTP
BunFactory.create(AppModule, options)  // Với tùy chọn
BunFactory.createMicroservice(AppModule, transport)
```

### BunApplication

```typescript
app.listen(port)              // Khởi động server
app.use(middleware)           // Thêm middleware toàn cục
app.useGlobalGuards(guard)    // Thêm guard toàn cục
app.useGlobalPipes(pipe)      // Thêm pipe toàn cục
app.useGlobalInterceptors(interceptor)
app.useGlobalFilters(filter)
app.getUrl()                  // Lấy URL server
app.close()                   // Tắt server
```

## Xuất khẩu

```typescript
// Decorator
export {
  Module,
  Controller,
  Injectable,
  Inject,
  Optional,
  Get, Post, Put, Patch, Delete, Options, Head, All,
  Param, Query, Body, Headers, Req, Res,
  UseGuards, UsePipes, UseInterceptors, UseFilters,
  SetMetadata,
  Version,
};

// Interface
export {
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  CanActivate,
  PipeTransform,
  NestInterceptor,
  ExceptionFilter,
};

// Class
export { BunFactory, Logger };

// Enum
export { Scope, RequestMethod };
```