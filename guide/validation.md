# Validation

Request validation with `@galaxy-stack/orbit-validation` using Zod schemas.

## ValidationPipe

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { ValidationPipe } from '@galaxy-stack/orbit-validation';

const app = await BunFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe());
```

## Zod Schema Validation

```typescript
import { z } from 'zod';
import { ZodValidationPipe } from '@galaxy-stack/orbit-validation';

const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().min(18).optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

type CreateUserDto = z.infer<typeof createUserSchema>;

@Controller('users')
export class UsersController {
  @Post()
  createUser(
    @Body(new ZodValidationPipe(createUserSchema)) data: CreateUserDto,
  ) {
    return this.usersService.create(data);
  }
}
```

## Transform Decorators

```typescript
import { Transform, Trim, ToLowerCase, ToNumber } from '@galaxy-stack/orbit-validation';

class SearchDto {
  @Trim()
  @ToLowerCase()
  query: string;

  @ToNumber()
  page: number;

  @Transform(({ value }) => value.split(','))
  tags: string[];
}
```

## Custom Validators

```typescript
const passwordSchema = z.string()
  .min(8)
  .regex(/[A-Z]/, 'Must contain uppercase')
  .regex(/[a-z]/, 'Must contain lowercase')
  .regex(/[0-9]/, 'Must contain number');

const registrationSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});
```

## Error Response

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "age",
      "message": "Must be at least 18"
    }
  ]
}
```
