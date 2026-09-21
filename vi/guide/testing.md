# Kiểm thử

Orbit cung cấp các tiện ích kiểm thử toàn diện cho kiểm thử đơn vị và tích hợp.

## Cài đặt

```bash
bun add -d @galaxy-stack/orbit-testing
```

## Kiểm thử đơn vị

### Kiểm thử Services

```typescript
import { Test } from '@galaxy-stack/orbit-testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get(UserService);
    userRepository = module.get(UserRepository);
  });

  it('nên trả về tất cả người dùng', async () => {
    const users = [{ id: 1, name: 'John' }];
    userRepository.findAll.mockResolvedValue(users);

    const result = await userService.findAll();

    expect(result).toEqual(users);
    expect(userRepository.findAll).toHaveBeenCalled();
  });

  it('nên tạo một người dùng', async () => {
    const newUser = { name: 'Jane', email: 'jane@example.com' };
    const createdUser = { id: 1, ...newUser };
    userRepository.create.mockResolvedValue(createdUser);

    const result = await userService.create(newUser);

    expect(result).toEqual(createdUser);
    expect(userRepository.create).toHaveBeenCalledWith(newUser);
  });
});
```

### Kiểm thử Controllers

```typescript
import { Test } from '@galaxy-stack/orbit-testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(UserController);
    userService = module.get(UserService);
  });

  it('nên trả về tất cả người dùng', async () => {
    const users = [{ id: 1, name: 'John' }];
    userService.findAll.mockResolvedValue(users);

    const result = await controller.findAll();

    expect(result).toEqual(users);
  });
});
```

## Mocking

### Sử dụng createMock

```typescript
import { createMock } from '@galaxy-stack/orbit-testing';

const mockUserService = createMock<UserService>({
  findAll: async () => [{ id: 1, name: 'John' }],
});
```

### Sử dụng createSpyOn

```typescript
import { createSpyOn } from '@galaxy-stack/orbit-testing';

const spy = createSpyOn(userService, 'findAll');
spy.mockResolvedValue([{ id: 1, name: 'John' }]);

// Sau đó
expect(spy).toHaveBeenCalled();
```

## Kiểm thử Guards

```typescript
import { Test } from '@galaxy-stack/orbit-testing';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthGuard],
    }).compile();

    guard = module.get(AuthGuard);
  });

  it('nên cho phép với token hợp lệ', async () => {
    const context = createMockExecutionContext({
      headers: { authorization: 'Bearer valid-token' },
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('nên từ chối khi không có token', async () => {
    const context = createMockExecutionContext({
      headers: {},
    });

    await expect(guard.canActivate(context)).rejects.toThrow();
  });
});
```

## Kiểm thử Pipes

```typescript
import { Test } from '@galaxy-stack/orbit-testing';
import { ValidationPipe } from './validation.pipe';

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ValidationPipe],
    }).compile();

    pipe = module.get(ValidationPipe);
  });

  it('nên cho phép dữ liệu hợp lệ', () => {
    const validData = { name: 'John', email: 'john@example.com' };
    const result = pipe.transform(validData, { type: 'body' });
    expect(result).toEqual(validData);
  });

  it('nên từ chối dữ liệu không hợp lệ', () => {
    const invalidData = { name: '' };
    expect(() => pipe.transform(invalidData, { type: 'body' })).toThrow();
  });
});
```

## Ghi đè Providers

```typescript
const module = await Test.createTestingModule({
  imports: [UserModule],
})
  .overrideProvider(UserRepository)
  .useValue(mockUserRepository)
  .overrideGuard(AuthGuard)
  .useValue({ canActivate: () => true })
  .compile();
```

## Kiểm thử với Cơ sở dữ liệu

```typescript
describe('UserService (Tích hợp)', () => {
  let userService: UserService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        DatabaseModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
        }),
        UserModule,
      ],
    }).compile();

    userService = module.get(UserService);

    // Chạy migration
    await module.get(DatabaseService).runMigrations();
  });

  afterEach(async () => {
    // Dọn dẹp dữ liệu
    await module.get(DatabaseService).clearTables();
  });

  it('nên tạo và truy xuất người dùng', async () => {
    const created = await userService.create({
      name: 'John',
      email: 'john@example.com',
    });

    const found = await userService.findOne(created.id);

    expect(found).toEqual(created);
  });
});
```

## Chạy Kiểm thử

```bash
# Chạy tất cả kiểm thử
bun test

# Chạy file cụ thể
bun test src/users/user.service.spec.ts

# Chế độ theo dõi
bun test --watch

# Báo cáo phủ
bun test --coverage
```