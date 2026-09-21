# @galaxy-stack/orbit-swagger

OpenAPI/Swagger documentation generator.

## Installation

```bash
bun add @galaxy-stack/orbit-swagger
```

## Setup

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { SwaggerModule, DocumentBuilder } from '@galaxy-stack/orbit-swagger';

const app = await BunFactory.create(AppModule);

const config = new DocumentBuilder()
  .setTitle('My API')
  .setDescription('API documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('users')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);

await app.listen(3000);
```

## Decorators

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@galaxy-stack/orbit-swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }
}
```

## DTO Documentation

```typescript
import { ApiProperty, ApiPropertyOptional } from '@galaxy-stack/orbit-swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ minLength: 8 })
  password: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  name?: string;
}
```

## Authentication

```typescript
const config = new DocumentBuilder()
  .addBearerAuth()
  .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' })
  .build();

@Controller('admin')
@ApiBearerAuth()
export class AdminController {}
```

## Response Types

```typescript
@Get(':id')
@ApiResponse({ 
  status: 200, 
  description: 'User found',
  type: UserDto,
})
@ApiResponse({ status: 404, description: 'User not found' })
findOne(@Param('id') id: number) {
  return this.usersService.findById(id);
}
```

Access docs at: `http://localhost:3000/api-docs`
