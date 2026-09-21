# @galaxy-stack/orbit-swagger

Trình tạo tài liệu OpenAPI/Swagger.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-swagger
```

## Thiết lập

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { SwaggerModule, DocumentBuilder } from '@galaxy-stack/orbit-swagger';

const app = await BunFactory.create(AppModule);

const config = new DocumentBuilder()
  .setTitle('API của tôi')
  .setDescription('Tài liệu API')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('users')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);

await app.listen(3000);
```

## Decorator

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@galaxy-stack/orbit-swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Lấy tất cả người dùng' })
  @ApiResponse({ status: 200, description: 'Danh sách người dùng' })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Người dùng đã tạo' })
  @ApiResponse({ status: 400, description: 'Lỗi xác thực' })
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }
}
```

## Tài liệu DTO

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

## Xác thực

```typescript
const config = new DocumentBuilder()
  .addBearerAuth()
  .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' })
  .build();

@Controller('admin')
@ApiBearerAuth()
export class AdminController {}
```

## Kiểu phản hồi

```typescript
@Get(':id')
@ApiResponse({ 
  status: 200, 
  description: 'Người dùng được tìm thấy',
  type: UserDto,
})
@ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
findOne(@Param('id') id: number) {
  return this.usersService.findById(id);
}
```

Truy cập tài liệu tại: `http://localhost:3000/api-docs`