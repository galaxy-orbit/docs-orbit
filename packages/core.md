# @galaxy-stack/orbit-core

The core package provides the foundation for Orbit applications.

## Installation

```bash
bun add @galaxy-stack/orbit-core reflect-metadata
```

## Features

- **BunFactory**: Application bootstrap factory
- **Module System**: @Module decorator with imports/exports
- **Controllers**: HTTP request handlers
- **Providers**: Dependency injection
- **Decorators**: Route, parameter, and lifecycle decorators
- **Request Pipeline**: Guards, Pipes, Interceptors, Filters

## Basic Usage

```typescript
import 'reflect-metadata';
import { BunFactory, Module, Controller, Get, Injectable } from '@galaxy-stack/orbit-core';

@Injectable()
class AppService {
  getHello() {
    return 'Hello World!';
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

## Module Decorator

```typescript
@Module({
  imports: [],      // Other modules to import
  controllers: [],  // HTTP controllers
  providers: [],    // Injectable services
  exports: [],      // Providers to share
})
```

## Controller Decorators

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

## Parameter Decorators

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

## Injectable Scopes

```typescript
import { Scope } from '@galaxy-stack/orbit-core';

@Injectable()                          // Singleton (default)
@Injectable({ scope: Scope.REQUEST })  // Per request
@Injectable({ scope: Scope.TRANSIENT }) // New instance each injection
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

## Lifecycle Hooks

```typescript
@Injectable()
class MyService implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    console.log('Module initialized');
  }

  onModuleDestroy() {
    console.log('Module destroyed');
  }
}
```

## API Reference

### BunFactory

```typescript
BunFactory.create(AppModule)           // Create HTTP app
BunFactory.create(AppModule, options)  // With options
BunFactory.createMicroservice(AppModule, transport)
```

### BunApplication

```typescript
app.listen(port)              // Start server
app.use(middleware)           // Add global middleware
app.useGlobalGuards(guard)    // Add global guards
app.useGlobalPipes(pipe)      // Add global pipes
app.useGlobalInterceptors(interceptor)
app.useGlobalFilters(filter)
app.getUrl()                  // Get server URL
app.close()                   // Shutdown
```

## Exports

```typescript
// Decorators
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

// Interfaces
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

// Classes
export { BunFactory, Logger };

// Enums
export { Scope, RequestMethod };
```
