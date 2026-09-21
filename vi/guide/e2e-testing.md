# Kiểm thử E2E

Kiểm thử đầu cuối với `@galaxy-stack/orbit-testing`.

## Thiết lập

```typescript
import { E2ETestingModule, SupertestAgent } from '@galaxy-stack/orbit-testing';
import { AppModule } from '../src/app.module';

describe('API Người dùng (e2e)', () => {
  let app: E2ETestingModule;
  let agent: SupertestAgent;

  beforeAll(async () => {
    app = await E2ETestingModule.create(AppModule);
    agent = app.getHttpAgent();
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## Kiểm thử HTTP

```typescript
describe('GET /users', () => {
  it('nên trả về danh sách người dùng', async () => {
    const response = await agent
      .get('/users')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
  });
});

describe('POST /users', () => {
  it('nên tạo một người dùng', async () => {
    const response = await agent
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(201);

    expect(response.body.name).toBe('John');
    expect(response.body.id).toBeDefined();
  });

  it('nên xác thực đầu vào', async () => {
    await agent
      .post('/users')
      .send({ name: '' })
      .expect(400);
  });
});
```

## Xác thực

```typescript
describe('Route được bảo vệ', () => {
  let authToken: string;

  beforeAll(async () => {
    const response = await agent
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password' });
    
    authToken = response.body.accessToken;
  });

  it('nên truy cập route được bảo vệ', async () => {
    await agent
      .get('/admin/dashboard')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('nên từ chối khi không có token', async () => {
    await agent
      .get('/admin/dashboard')
      .expect(401);
  });
});
```

## Gieo dữ liệu cơ sở dữ liệu

```typescript
beforeEach(async () => {
  await app.getService(DatabaseService).reset();
  await app.getService(SeederService).seed();
});
```

## Kiểm thử kịch bản

```typescript
import { runScenario } from '@galaxy-stack/orbit-testing';

runScenario('Luồng đăng ký người dùng', async ({ agent }) => {
  const user = await agent.post('/auth/register').send({
    name: 'Người dùng kiểm thử',
    email: 'test@example.com',
    password: 'password123',
  });

  const login = await agent.post('/auth/login').send({
    email: 'test@example.com',
    password: 'password123',
  });

  const profile = await agent
    .get('/users/me')
    .set('Authorization', `Bearer ${login.body.token}`);

  expect(profile.body.email).toBe('test@example.com');
});
```