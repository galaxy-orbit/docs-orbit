# @galaxy-stack/orbit-validation

Xác thực yêu cầu sử dụng schema Zod với decorator chuyển đổi.

## Cài đặt

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

## Decorator chuyển đổi

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

## Pipe tích hợp

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

## Thông báo lỗi tùy chỉnh

```typescript
const schema = z.object({
  email: z.string().email({ message: 'Vui lòng cung cấp email hợp lệ' }),
  password: z.string().min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }),
});
```