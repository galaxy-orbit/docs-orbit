# Pipes

Pipes transform and validate input data before it reaches the route handler.

## Built-in Pipes

Orbit provides several built-in pipes:

### ParseIntPipe

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  // id is guaranteed to be a number
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
  // name is trimmed
  return { name };
}
```

## Validation Pipe with Zod

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

## Custom Pipes

```typescript
import { PipeTransform, Injectable, BadRequestException } from '@galaxy-stack/orbit-core';

@Injectable()
export class ParseUUIDPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(value)) {
      throw new BadRequestException('Invalid UUID format');
    }
    
    return value;
  }
}

// Usage
@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string) {
  return { id };
}
```

## Async Pipes

```typescript
@Injectable()
export class UserExistsPipe implements PipeTransform {
  constructor(private userService: UserService) {}

  async transform(value: string): Promise<User> {
    const user = await this.userService.findOne(value);
    
    if (!user) {
      throw new NotFoundException(`User ${value} not found`);
    }
    
    return user;
  }
}

// Usage
@Get(':id')
findOne(@Param('id', UserExistsPipe) user: User) {
  return user;
}
```

## Global Pipes

```typescript
const app = await BunFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe());
```

## Pipe Context

Access metadata in custom pipes:

```typescript
@Injectable()
export class ContextAwarePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    console.log('Type:', metadata.type); // 'body', 'query', 'param'
    console.log('Data:', metadata.data); // param name
    console.log('Metatype:', metadata.metatype); // expected type
    
    return value;
  }
}
```

## Combining Pipes

Pipes execute in order:

```typescript
@Get()
findAll(
  @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number
) {
  // DefaultValuePipe sets '1' if missing
  // ParseIntPipe converts to number
  return { page };
}
```
