# Testing

Orbit provides comprehensive testing utilities for unit and integration tests.

## Installation

```bash
bun add -d @galaxy-stack/orbit-testing
```

## Unit Testing

### Testing Services

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

  it('should return all users', async () => {
    const users = [{ id: 1, name: 'John' }];
    userRepository.findAll.mockResolvedValue(users);

    const result = await userService.findAll();

    expect(result).toEqual(users);
    expect(userRepository.findAll).toHaveBeenCalled();
  });

  it('should create a user', async () => {
    const newUser = { name: 'Jane', email: 'jane@example.com' };
    const createdUser = { id: 1, ...newUser };
    userRepository.create.mockResolvedValue(createdUser);

    const result = await userService.create(newUser);

    expect(result).toEqual(createdUser);
    expect(userRepository.create).toHaveBeenCalledWith(newUser);
  });
});
```

### Testing Controllers

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

  it('should return all users', async () => {
    const users = [{ id: 1, name: 'John' }];
    userService.findAll.mockResolvedValue(users);

    const result = await controller.findAll();

    expect(result).toEqual(users);
  });
});
```

## Mocking

### Using createMock

```typescript
import { createMock } from '@galaxy-stack/orbit-testing';

const mockUserService = createMock<UserService>({
  findAll: async () => [{ id: 1, name: 'John' }],
});
```

### Using createSpyOn

```typescript
import { createSpyOn } from '@galaxy-stack/orbit-testing';

const spy = createSpyOn(userService, 'findAll');
spy.mockResolvedValue([{ id: 1, name: 'John' }]);

// Later
expect(spy).toHaveBeenCalled();
```

## Testing Guards

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

  it('should allow with valid token', async () => {
    const context = createMockExecutionContext({
      headers: { authorization: 'Bearer valid-token' },
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny without token', async () => {
    const context = createMockExecutionContext({
      headers: {},
    });

    await expect(guard.canActivate(context)).rejects.toThrow();
  });
});
```

## Testing Pipes

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

  it('should pass valid data', () => {
    const validData = { name: 'John', email: 'john@example.com' };
    const result = pipe.transform(validData, { type: 'body' });
    expect(result).toEqual(validData);
  });

  it('should reject invalid data', () => {
    const invalidData = { name: '' };
    expect(() => pipe.transform(invalidData, { type: 'body' })).toThrow();
  });
});
```

## Override Providers

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

## Testing with Database

```typescript
describe('UserService (Integration)', () => {
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

    // Run migrations
    await module.get(DatabaseService).runMigrations();
  });

  afterEach(async () => {
    // Clean up data
    await module.get(DatabaseService).clearTables();
  });

  it('should create and retrieve user', async () => {
    const created = await userService.create({
      name: 'John',
      email: 'john@example.com',
    });

    const found = await userService.findOne(created.id);

    expect(found).toEqual(created);
  });
});
```

## Running Tests

```bash
# Run all tests
bun test

# Run specific file
bun test src/users/user.service.spec.ts

# Watch mode
bun test --watch

# Coverage
bun test --coverage
```
