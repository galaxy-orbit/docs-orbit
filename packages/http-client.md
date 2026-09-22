# @galaxy-stack/orbit-http-client

Typed HTTP client — fetch wrapper with retries, timeouts, interceptors. Equivalent of `@nestjs/axios`.

```bash
bun add @galaxy-stack/orbit-http-client
```

## Usage

```ts
import { HttpClientModule, HttpClient, Module } from '@galaxy-stack/orbit-http-client';

@Module({
  imports: [HttpClientModule.forRoot({ baseUrl: 'https://api.example.com', retries: 2, timeoutMs: 5000 })],
})
export class AppModule {}

// anywhere with DI:
constructor(private http: HttpClient) {}

const res = await this.http.get<User[]>('/users', { query: { page: 1 } });
await this.http.post('/users', { name: 'orbit' });
```

Features: JSON serialization/parsing, query params, request/response interceptors, exponential-backoff retries (5xx + 429), timeout via AbortController, `throwOnError` toggle.
