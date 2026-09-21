# @galaxy-stack/orbit-validation

Request validation using Zod schemas with transform decorators.

## Installation

```bash
bun add @galaxy-stack/orbit-validation
```

## ValidationPipe

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { ValidationPipe } from '@galaxy-stack/orbit-validation';

const app = await BunFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
}));
```

## ZodValidationPipe

```typescript
import { z } from 'zod';
import { ZodValidationPipe } from '@galaxy-stack/orbit-validation';

const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

type CreateUserDto = z.infer<typeof createUserSchema>;

@Controller('users')
export class UsersController {
  @Post()
  create(@Body(new ZodValidationPipe(createUserSchema)) data: CreateUserDto) {
    return this.usersService.create(data);
  }
}
```

## Transform Decorators

```typescript
import { Trim, ToLowerCase, ToNumber, Transform } from '@galaxy-stack/orbit-validation';

class SearchDto {
  @Trim()
  @ToLowerCase()
  query: string;

  @ToNumber()
  page: number;

  @ToNumber()
  limit: number;

  @Transform(({ value }) => value.split(','))
  tags: string[];
}
```

## Built-in Pipes

```typescript
import { ParseIntPipe, ParseBoolPipe, DefaultValuePipe } from '@galaxy-stack/orbit-validation';

@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.service.findById(id);
}

@Get()
findAll(
  @Query('active', new DefaultValuePipe(true), ParseBoolPipe) active: boolean,
) {
  return this.service.findAll({ active });
}
```

## Custom Error Messages

```typescript
const schema = z.object({
  email: z.string().email({ message: 'Please provide a valid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});
```
