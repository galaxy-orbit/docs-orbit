# @galaxy-stack/orbit-testing

Testing utilities and mock module builder.

## Installation

```bash
bun add -d @galaxy-stack/orbit-testing
```

## Test Module Builder

### Create Testing Module

```typescript
import { Test, TestingModule } from '@galaxy-stack/orbit-testing';

describe('UserService', () => {
  let module: TestingModule;
  let userService: UserService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
```

### Override Providers

```typescript
const module = await Test.createTestingModule({
  imports: [UserModule],
})
  .overrideProvider(UserRepository)
  .useValue({
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn(),
  })
  .compile();
```

### Override Guards

```typescript
const module = await Test.createTestingModule({
  controllers: [UserController],
})
  .overrideGuard(AuthGuard)
  .useValue({ canActivate: () => true })
  .compile();
```

### Override Pipes

```typescript
const module = await Test.createTestingModule({
  controllers: [UserController],
})
  .overridePipe(ValidationPipe)
  .useValue({ transform: (v) => v })
  .compile();
```

### Override Interceptors

```typescript
const module = await Test.createTestingModule({
  controllers: [UserController],
})
  .overrideInterceptor(LoggingInterceptor)
  .useValue({ intercept: (_, next) => next.handle() })
  .compile();
```

## Mock Utilities

### createMock

```typescript
import { createMock } from '@galaxy-stack/orbit-testing';

const mockUserService = createMock<UserService>({
  findAll: async () => [{ id: 1, name: 'John' }],
  findOne: async (id) => ({ id, name: 'John' }),
});
```

### createSpyOn

```typescript
import { createSpyOn } from '@galaxy-stack/orbit-testing';

const spy = createSpyOn(userService, 'findAll');
spy.mockResolvedValue([{ id: 1, name: 'John' }]);

await userService.findAll();

expect(spy).toHaveBeenCalled();
expect(spy).toHaveBeenCalledTimes(1);
```

## HTTP Testing

### TestHttpServer

```typescript
import { TestHttpServer } from '@galaxy-stack/orbit-testing';

describe('UserController (e2e)', () => {
  let httpServer: TestHttpServer;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = module.createApplication();
    httpServer = new TestHttpServer(app);
  });

  it('GET /users', async () => {
    const response = await httpServer.get('/users');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('POST /users', async () => {
    const response = await httpServer
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('John');
  });

  it('GET /users/:id', async () => {
    const response = await httpServer.get('/users/1');
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });
});
```

### Request Methods

```typescript
httpServer.get('/path');
httpServer.post('/path').send(body);
httpServer.put('/path').send(body);
httpServer.patch('/path').send(body);
httpServer.delete('/path');

// With headers
httpServer
  .get('/protected')
  .set('Authorization', 'Bearer token');

// With query parameters
httpServer.get('/users').query({ page: 1, limit: 10 });
```

## E2E Testing

```typescript
import { E2ETestingModule, e2eTest, runScenario } from '@galaxy-stack/orbit-testing';

describe('App E2E', () => {
  const { module, app } = e2eTest(AppModule);

  it('should handle user flow', async () => {
    await runScenario(app, [
      {
        name: 'Create user',
        request: {
          method: 'POST',
          path: '/users',
          body: { name: 'John', email: 'john@test.com' },
        },
        expect: {
          status: 201,
          body: { name: 'John' },
        },
      },
      {
        name: 'Get user',
        request: {
          method: 'GET',
          path: '/users/1',
        },
        expect: {
          status: 200,
        },
      },
    ]);
  });
});
```

## Execution Context Mock

```typescript
import { createMockExecutionContext } from '@galaxy-stack/orbit-testing';

const context = createMockExecutionContext({
  method: 'GET',
  url: '/users',
  headers: {
    authorization: 'Bearer token',
  },
  body: {},
  params: { id: '1' },
  query: { page: '1' },
  user: { id: 1, email: 'test@example.com' },
});

const result = await guard.canActivate(context);
```

## Exports

```typescript
export {
  Test,
  TestingModule,
  TestHttpServer,
  TestResponse,
  E2ETestingModule,
  e2eTest,
  runScenario,
  createMock,
  createSpyOn,
  createMockExecutionContext,
};
```
