# E2E Testing

End-to-end testing with `@galaxy-stack/orbit-testing`.

## Setup

```typescript
import { E2ETestingModule, SupertestAgent } from '@galaxy-stack/orbit-testing';
import { AppModule } from '../src/app.module';

describe('Users API (e2e)', () => {
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

## HTTP Testing

```typescript
describe('GET /users', () => {
  it('should return users list', async () => {
    const response = await agent
      .get('/users')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
  });
});

describe('POST /users', () => {
  it('should create a user', async () => {
    const response = await agent
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(201);

    expect(response.body.name).toBe('John');
    expect(response.body.id).toBeDefined();
  });

  it('should validate input', async () => {
    await agent
      .post('/users')
      .send({ name: '' })
      .expect(400);
  });
});
```

## Authentication

```typescript
describe('Protected Routes', () => {
  let authToken: string;

  beforeAll(async () => {
    const response = await agent
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password' });
    
    authToken = response.body.accessToken;
  });

  it('should access protected route', async () => {
    await agent
      .get('/admin/dashboard')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('should reject without token', async () => {
    await agent
      .get('/admin/dashboard')
      .expect(401);
  });
});
```

## Database Seeding

```typescript
beforeEach(async () => {
  await app.getService(DatabaseService).reset();
  await app.getService(SeederService).seed();
});
```

## Scenario Testing

```typescript
import { runScenario } from '@galaxy-stack/orbit-testing';

runScenario('User Registration Flow', async ({ agent }) => {
  const user = await agent.post('/auth/register').send({
    name: 'Test User',
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
