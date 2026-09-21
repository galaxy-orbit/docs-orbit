# Xác thực

Xác thực yêu cầu với `@galaxy-stack/orbit-validation` sử dụng schema Zod.

## ValidationPipe

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { ValidationPipe } from '@galaxy-stack/orbit-validation';

const app = await BunFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe());
```

## Xác thực Schema Zod

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

## Decorator biến đổi

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

## Trình xác thực tùy chỉnh

```typescript
const passwordSchema = z.string()
  .min(8)
  .regex(/[A-Z]/, 'Phải chứa chữ hoa')
  .regex(/[a-z]/, 'Phải chứa chữ thường')
  .regex(/[0-9]/, 'Phải chứa số');

const registrationSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu phải khớp',
  path: ['confirmPassword'],
});
```

## Phản hồi lỗi

```json
{
  "statusCode": 400,
  "message": "Xác thực thất bại",
  "errors": [
    {
      "field": "email",
      "message": "Định dạng email không hợp lệ"
    },
    {
      "field": "age",
      "message": "Phải ít nhất 18 tuổi"
    }
  ]
}
```