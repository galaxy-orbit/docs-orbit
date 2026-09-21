# Orbit CLI

The official command-line interface for Orbit.

## Installation

```bash
# Global installation
bun add -g orbit

# Or use with bunx
orbit <command>
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `orbit new <name>` | Create new project |
| `orbit generate <type> <name>` | Generate component |
| `orbit dev` | Start development server |
| `orbit build` | Build for production |
| `orbit test` | Run tests |

## Creating Projects

```bash
orbit new my-app
cd my-app
bun run dev
```

Options:
- `--skip-git` - Skip git initialization
- `--skip-install` - Skip installing dependencies

## Code Generation

### Controllers

```bash
orbit generate controller users
# Creates: src/users/users.controller.ts
```

### Services

```bash
orbit generate service users
# Creates: src/users/users.service.ts
```

### Modules

```bash
orbit generate module users
# Creates: src/users/users.module.ts
```

### Resources (CRUD)

```bash
orbit generate resource users
# Creates:
#   src/users/users.module.ts
#   src/users/users.controller.ts
#   src/users/users.service.ts
#   src/users/dto/create-user.dto.ts
#   src/users/dto/update-user.dto.ts
#   src/users/entities/user.entity.ts
```

### Other Components

```bash
orbit generate guard auth
orbit generate pipe validation
orbit generate interceptor logging
orbit generate middleware logger
orbit generate filter http-exception
```

### Generation Options

```bash
# Specify path
orbit g controller users --path src/modules/users

# Flat structure (no subfolder)
orbit g service users --flat

# Skip test file
orbit g controller users --no-spec

# Dry run (preview)
orbit g module users --dry-run
```

## Development Server

```bash
orbit dev
```

Features:
- Hot Module Replacement (HMR)
- Fast transpilation with Bun.Transpiler
- Automatic restart on changes

Options:
- `--port <number>` - Port number (default: 3000)
- `--host <string>` - Host address (default: localhost)

## Building

```bash
orbit build
```

Options:
- `--outdir <path>` - Output directory (default: dist)
- `--minify` - Minify output

## Testing

```bash
orbit test
```

Options:
- `--watch` - Watch mode
- `--coverage` - Generate coverage report

## GraphQL Components

```bash
# Generate resolver
orbit generate resolver users

# Generate complete GraphQL resource
orbit generate graphql-resource users
```

## Microservice Components

```bash
# Generate message handler
orbit generate handler notifications

# Generate microservice resource
orbit generate microservice-resource orders
```

## Aliases

| Full Command | Alias |
|--------------|-------|
| `generate` | `g` |
| `controller` | `co` |
| `service` | `s` |
| `module` | `mo` |
| `resource` | `res` |
| `guard` | `gu` |
| `pipe` | `pi` |
| `interceptor` | `itc` |
| `middleware` | `mi` |
| `filter` | `f` |

Example:

```bash
orbit g res users  # Same as: orbit generate resource users
```

## NestJS Migration Tool

The CLI includes a powerful migration tool to help you transition from NestJS projects to Orbit.

### Analyze Project

Before migrating, analyze your project for compatibility:

```bash
orbit migrate analyze ./my-nestjs-app
```

This will show:
- NestJS dependencies found and their Orbit equivalents
- Number of TypeScript files to process
- Items requiring manual review (TypeORM, Passport, bcrypt, etc.)
- Overall migration compatibility score

### Full Migration

Migrate your entire project:

```bash
# Preview changes without modifying files
orbit migrate ./my-nestjs-app --dry-run

# Apply migration
orbit migrate ./my-nestjs-app

# Skip backup file creation
orbit migrate ./my-nestjs-app --skip-backup

# Verbose output
orbit migrate ./my-nestjs-app --verbose
```

### Import-Only Migration

If you only want to update import statements:

```bash
orbit migrate imports ./my-nestjs-app
orbit migrate imports ./my-nestjs-app --dry-run
```

### What Gets Migrated

#### Automatic Transformations

| Before | After |
|--------|-------|
| `@nestjs/common` | `@galaxy-stack/orbit-common` |
| `@nestjs/core` | `@galaxy-stack/orbit-core` |
| `@nestjs/config` | `@galaxy-stack/orbit-config` |
| `@nestjs/graphql` | `@galaxy-stack/orbit-graphql` |
| `@nestjs/microservices` | `@galaxy-stack/orbit-microservices` |
| `@nestjs/websockets` | `@galaxy-stack/orbit-websockets` |
| `@nestjs/schedule` | `@galaxy-stack/orbit-schedule` |
| `@nestjs/terminus` | `@galaxy-stack/orbit-terminus` |
| `@nestjs/throttler` | `@galaxy-stack/orbit-throttler` |
| `@nestjs/jwt` | `@galaxy-stack/orbit-auth` |
| `@nestjs/passport` | `@galaxy-stack/orbit-auth` |
| `@nestjs/cache-manager` | `@galaxy-stack/orbit-cache` |
| `@nestjs/swagger` | `@galaxy-stack/orbit-swagger` |
| `@nestjs/testing` | `@galaxy-stack/orbit-testing` |
| `@nestjs/platform-express` | `@galaxy-stack/orbit-platform-bun` |
| `@nestjs/platform-fastify` | `@galaxy-stack/orbit-platform-bun` |
| `NestFactory.create()` | `BunFactory.create()` |
| `NestFactory.createMicroservice()` | `BunFactory.createMicroservice()` |

#### Code Transformations

```typescript
// Before
import { NestFactory } from '@nestjs/core';
const app = await NestFactory.create(AppModule);

// After
import { BunFactory } from '@galaxy-stack/orbit-core';
const app = await BunFactory.create(AppModule);
```

```typescript
// Before
import * as bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 10);
const valid = await bcrypt.compare(password, hash);

// After
const hash = await Bun.password.hash(password);
const valid = await Bun.password.verify(password, hash);
```

#### Package.json Updates

The migration tool will:
- Replace `@nestjs/*` dependencies with `@galaxy-stack/orbit-*` equivalents
- Add `reflect-metadata` if not present
- Remove `@nestjs/cli` and `@nestjs/schematics`
- Add `@galaxy-stack/orbit-testing` as dev dependency

### Items Requiring Manual Review

The migration tool will warn you about these patterns:

| Pattern | Recommended Action |
|---------|-------------------|
| TypeORM usage | Migrate to Drizzle ORM with `@galaxy-stack/orbit-database` |
| Mongoose usage | Migrate to Drizzle MongoDB |
| PassportStrategy | Use `@galaxy-stack/orbit-auth` guards instead |
| class-validator | Use Zod with `@galaxy-stack/orbit-validation` |
| Platform-specific types | Review Bun.serve() usage |

### Post-Migration Steps

1. Install dependencies:
   ```bash
   bun install
   ```

2. Update `tsconfig.json` if needed:
   ```json
   {
     "compilerOptions": {
       "target": "ESNext",
       "module": "ESNext",
       "moduleResolution": "bundler",
       "experimentalDecorators": true,
       "emitDecoratorMetadata": true
     }
   }
   ```

3. Start development server:
   ```bash
   bun run dev
   ```

4. Run tests:
   ```bash
   bun test
   ```

### Migration Examples

#### Complete Module Migration

```typescript
// Before (NestJS)
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({...}),
  ],
})
export class AppModule {}

// After (Orbit)
import { Module } from '@galaxy-stack/orbit-core';
import { ConfigModule } from '@galaxy-stack/orbit-config';
import { DatabaseModule } from '@galaxy-stack/orbit-database';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot({...}),
  ],
})
export class AppModule {}
```

#### Authentication Migration

```typescript
// Before (NestJS + Passport)
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {}

// After (Orbit)
import { UseGuards } from '@galaxy-stack/orbit-common';
import { JwtAuthGuard } from '@galaxy-stack/orbit-auth';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {}
```

See the [Migration Guide](/guide/migration) for more detailed instructions.
