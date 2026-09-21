# Pipe

Pipe chuyển đổi và xác thực dữ liệu đầu vào trước khi đến bộ xử lý route.

## Pipe tích hợp

Orbit cung cấp một số pipe tích hợp:

### ParseIntPipe

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  // id chắc chắn là số
  return { id };
}
```

### ParseBoolPipe

```typescript
@Get()
findAll(@Query('active', ParseBoolPipe) active: boolean) {
  return { active };
}
```

### ParseFloatPipe

```typescript
@Get()
findByPrice(@Query('price', ParseFloatPipe) price: number) {
  return { price };
}
```

### ParseArrayPipe

```typescript
@Get()
findByIds(@Query('ids', ParseArrayPipe) ids: string[]) {
  return { ids };
}
```

### DefaultValuePipe

```typescript
@Get()
findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
) {
  return { page, limit };
}
```

### TrimPipe

```typescript
@Post()
create(@Body('name', TrimPipe) name: string) {
  // name đã được cắt khoảng trắng
  return { name };
}
```

## Pipe xác thực với Zod

```typescript
import { z } from 'zod';
import { ZodValidationPipe } from '@galaxy-stack/orbit-validation';

const CreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().min(18).optional(),
});

type CreateUserDto = z.infer<typeof CreateUserSchema>;

@Controller('users')
export class UserController {
  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  create(@Body() dto: CreateUserDto) {
    return dto;
  }
}
```

## Pipe tùy chỉnh

```typescript
import { PipeTransform, Injectable, BadRequestException } from '@galaxy-stack/orbit-core';

@Injectable()
export class ParseUUIDPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(value)) {
      throw new BadRequestException('Định dạng UUID không hợp lệ');
    }
    
    return value;
  }
}

// Sử dụng
@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string) {
  return { id };
}
```

## Pipe bất đồng bộ

```typescript
@Injectable()
export class UserExistsPipe implements PipeTransform {
  constructor(private userService: UserService) {}

  async transform(value: string): Promise<User> {
    const user = await this.userService.findOne(value);
    
    if (!user) {
      throw new NotFoundException(`Người dùng ${value} không tồn tại`);
    }
    
    return user;
  }
}

// Sử dụng
@Get(':id')
findOne(@Param('id', UserExistsPipe) user: User) {
  return user;
}
```

## Pipe toàn cục

```typescript
const app = await BunFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe());
```

## Ngữ cảnh Pipe

Truy cập metadata trong pipe tùy chỉnh:

```typescript
@Injectable()
export class ContextAwarePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    console.log('Loại:', metadata.type); // 'body', 'query', 'param'
    console.log('Dữ liệu:', metadata.data); // tên tham số
    console.log('Kiểu:', metadata.metatype); // kiểu mong đợi
    
    return value;
  }
}
```

## Kết hợp Pipe

Pipe thực thi theo thứ tự:

```typescript
@Get()
findAll(
  @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number
) {
  // DefaultValuePipe đặt '1' nếu thiếu
  // ParseIntPipe chuyển đổi sang số
  return { page };
}
```