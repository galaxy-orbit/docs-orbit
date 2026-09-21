# Project Structure

A typical Orbit project follows a modular structure similar to NestJS.

## Basic Structure

```
my-app/
├── src/
│   ├── app.module.ts       # Root module
│   ├── app.controller.ts   # Root controller
│   ├── app.service.ts      # Root service
│   ├── main.ts             # Application entry point
│   └── modules/
│       ├── users/
│       │   ├── users.module.ts
│       │   ├── users.controller.ts
│       │   ├── users.service.ts
│       │   └── dto/
│       │       └── create-user.dto.ts
│       └── posts/
│           ├── posts.module.ts
│           ├── posts.controller.ts
│           └── posts.service.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── package.json
├── tsconfig.json
└── bunfig.toml
```

## Entry Point

```typescript
// src/main.ts
import { BunFactory } from '@galaxy-stack/orbit-core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await BunFactory.create(AppModule);
  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
}

bootstrap();
```

## Root Module

```typescript
// src/app.module.ts
import { Module } from '@galaxy-stack/orbit-common';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [UsersModule, PostsModule],
})
export class AppModule {}
```

## Feature Module

```typescript
// src/modules/users/users.module.ts
import { Module } from '@galaxy-stack/orbit-common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

## Best Practices

1. **One module per feature** - Keep related functionality together
2. **Shared modules** - Create a shared module for common utilities
3. **DTOs** - Use Data Transfer Objects for input validation
4. **Separation of concerns** - Controllers handle HTTP, services handle business logic
