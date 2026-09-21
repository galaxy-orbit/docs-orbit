# Migrating from NestJS

Orbit provides a migration tool to help you transition from NestJS projects.

## Automatic Migration

### Analyze Your Project

First, analyze your project for compatibility:

```bash
orbit migrate analyze ./my-nestjs-app
```

This will show:
- NestJS dependencies and their Orbit equivalents
- TypeScript files that need updating
- Items requiring manual review

### Run Migration

Migrate your project:

```bash
# Preview changes (dry run)
orbit migrate ./my-nestjs-app --dry-run

# Apply changes
orbit migrate ./my-nestjs-app
```

The migration tool will:
- Update import statements from `@nestjs/*` to `@galaxy-stack/orbit-*`
- Change `NestFactory` to `BunFactory`
- Update `package.json` dependencies
- Create backup files (`.bak`)

### Update Imports Only

If you prefer to update only imports:

```bash
orbit migrate imports ./my-nestjs-app
```

## Import Mappings

| NestJS | Orbit |
|--------|-----------|
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

## Manual Migrations

### Database (TypeORM → Drizzle)

Orbit uses Drizzle ORM instead of TypeORM:

```typescript
// Before (TypeORM)
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

// After (Drizzle)
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});
```

Repository pattern:

```typescript
// Before (TypeORM)
@InjectRepository(User)
private userRepository: Repository<User>

// After (Drizzle)
@InjectDatabase()
private db: Database

async findAll() {
  return this.db.select().from(users);
}
```

### Authentication (Passport → @galaxy-stack/orbit-auth)

```typescript
// Before (Passport)
@UseGuards(AuthGuard('jwt'))

// After
import { JwtAuthGuard } from '@galaxy-stack/orbit-auth';

@UseGuards(JwtAuthGuard)
```

JWT service:

```typescript
// Before
import { JwtService } from '@nestjs/jwt';

// After
import { JwtService } from '@galaxy-stack/orbit-auth';
```

### Password Hashing (bcrypt → Bun.password)

```typescript
// Before
import * as bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hash);

// After (native Bun)
const hash = await Bun.password.hash(password);
const isValid = await Bun.password.verify(password, hash);
```

### Validation (class-validator → Zod)

```typescript
// Before
import { IsEmail, MinLength } from 'class-validator';

class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

// After
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type CreateUserDto = z.infer<typeof CreateUserSchema>;
```

### Bootstrap

```typescript
// Before
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

const app = await NestFactory.create<NestExpressApplication>(AppModule);

// After
import { BunFactory } from '@galaxy-stack/orbit-core';

const app = await BunFactory.create(AppModule);
```

## Post-Migration Steps

1. Install dependencies:
   ```bash
   bun install
   ```

2. Update TypeScript config if needed:
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

## Compatibility Notes

### Fully Compatible
- Module system (`@Module`)
- Controllers and routing
- Dependency injection
- Guards, Pipes, Interceptors
- Exception filters
- GraphQL resolvers
- Microservice patterns
- WebSocket gateways
- Scheduling
- Health checks

### Requires Manual Update
- TypeORM/Mongoose → Drizzle
- Passport strategies → Orbit guards
- bcrypt → Bun.password
- class-validator → Zod
- Platform-specific features

### Not Supported
- Nest CLI schematics (use `orbit generate`)
- Nest DevTools (use `@galaxy-stack/orbit-devtools`)
