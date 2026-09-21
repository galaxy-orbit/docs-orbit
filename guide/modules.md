# Modules

Modules are the fundamental building blocks of Orbit applications. They help organize your code into cohesive blocks of functionality.

## Overview

A module is a class decorated with `@Module()` that provides metadata about how the application should be structured.

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

## Module Decorator Options

| Property | Description |
|----------|-------------|
| `imports` | List of modules to import |
| `controllers` | Controllers to be instantiated |
| `providers` | Providers to be instantiated by the DI container |
| `exports` | Providers to be available in other modules |

## Feature Modules

Organize your application by feature:

```typescript
// users/user.module.ts
@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}

// posts/post.module.ts
@Module({
  imports: [UserModule], // Import UserModule to use UserService
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
```

## Root Module

Every application has a root module:

```typescript
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(),
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
```

## Global Modules

Use `global: true` to make providers available everywhere:

```typescript
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
  global: true,
})
export class ConfigModule {}
```

## Dynamic Modules

Create configurable modules:

```typescript
@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
      global: true,
    };
  }
}
```

## Module Re-exporting

Re-export imported modules:

```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule], // Re-export so importers can use CommonModule
})
export class CoreModule {}
```

## Forward References

Handle circular dependencies:

```typescript
import { forwardRef } from '@galaxy-stack/orbit-core';

@Module({
  imports: [forwardRef(() => PostModule)],
})
export class UserModule {}
```
