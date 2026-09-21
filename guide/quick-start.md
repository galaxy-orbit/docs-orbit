# Quick Start

This guide will help you create your first Orbit application in minutes.

## Prerequisites

Make sure you have [Bun](https://bun.sh) installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

Verify the installation:

```bash
bun --version
# Should output 1.0.0 or higher
```

## Create New Project

### Using CLI (Recommended)

The fastest way to start is using the Orbit CLI:

```bash
orbit new my-app
cd my-app
bun install
bun run dev
```

This creates a complete project structure with TypeScript configuration, sample modules, and development scripts.

### Manual Setup

If you prefer to set up manually:

```bash
mkdir my-app && cd my-app
bun init -y

# Install Orbit packages
bun add @galaxy-stack/orbit-core @galaxy-stack/orbit-common reflect-metadata

# Install dev dependencies
bun add -d typescript @types/bun
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true
  }
}
```

## Your First Application

Create `src/main.ts`:

```typescript
import 'reflect-metadata';
import { BunFactory, Module, Controller, Get, Injectable } from '@galaxy-stack/orbit-core';

// 1. Create a service
@Injectable()
class AppService {
  getHello(): string {
    return 'Hello Orbit!';
  }
}

// 2. Create a controller
@Controller()
class AppController {
  constructor(private appService: AppService) {}

  @Get()
  getHello() {
    return { message: this.appService.getHello() };
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}

// 3. Create the root module
@Module({
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

// 4. Bootstrap the application
async function bootstrap() {
  const app = await BunFactory.create(AppModule);
  await app.listen(3000);
  console.log('🚀 Server running at http://localhost:3000');
}

bootstrap();
```

Run the application:

```bash
bun run src/main.ts
```

Test it:

```bash
curl http://localhost:3000
# {"message":"Hello Orbit!"}

curl http://localhost:3000/health
# {"status":"ok"}
```

## Adding More Features

### Add a User Module

```typescript
// src/users/user.service.ts
import { Injectable } from '@galaxy-stack/orbit-core';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(data: Omit<User, 'id'>): User {
    const user = { id: this.users.length + 1, ...data };
    this.users.push(user);
    return user;
  }
}
```

```typescript
// src/users/user.controller.ts
import { Controller, Get, Post, Param, Body } from '@galaxy-stack/orbit-core';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id, 10));
  }

  @Post()
  create(@Body() body: { name: string; email: string }) {
    return this.userService.create(body);
  }
}
```

```typescript
// src/users/user.module.ts
import { Module } from '@galaxy-stack/orbit-core';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

Update your root module:

```typescript
// src/main.ts
@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}
```

### Add Validation

```bash
bun add @galaxy-stack/orbit-validation zod
```

```typescript
import { z } from 'zod';
import { UsePipes, ZodValidationPipe } from '@galaxy-stack/orbit-validation';

const CreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
});

@Controller('users')
export class UserController {
  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  create(@Body() body: z.infer<typeof CreateUserSchema>) {
    return this.userService.create(body);
  }
}
```

### Add Database

```bash
bun add @galaxy-stack/orbit-database drizzle-orm
```

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { DatabaseModule } from '@galaxy-stack/orbit-database';

@Module({
  imports: [
    DatabaseModule.forRoot({
      type: 'postgresql',
      url: process.env.DATABASE_URL,
    }),
  ],
})
class AppModule {}
```

### Add Authentication

```bash
bun add @galaxy-stack/orbit-auth
```

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { AuthModule } from '@galaxy-stack/orbit-auth';

@Module({
  imports: [
    AuthModule.register({
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    }),
  ],
})
class AppModule {}
```

## Project Structure

A typical Orbit project structure:

```
my-app/
├── src/
│   ├── main.ts              # Application entry point
│   ├── app.module.ts        # Root module
│   ├── app.controller.ts    # Root controller
│   ├── app.service.ts       # Root service
│   ├── users/
│   │   ├── user.module.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── dto/
│   │       └── create-user.dto.ts
│   └── common/
│       ├── guards/
│       ├── pipes/
│       └── interceptors/
├── test/
├── tsconfig.json
├── package.json
└── bun.lockb
```

## Development Mode

For hot reload during development:

```bash
orbit dev
# or
bun --watch run src/main.ts
```

## Next Steps

- Learn about [Modules](/guide/modules) for organizing your code
- Understand [Dependency Injection](/guide/dependency-injection)
- Add [Guards](/guide/guards) for authentication
- Integrate a [Database](/guide/database)
