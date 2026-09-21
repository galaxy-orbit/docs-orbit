# @galaxy-stack/orbit-security

Security utilities including rate limiting, sanitization, and API key management.

## Installation

```bash
bun add @galaxy-stack/orbit-security
```

## Features

- Sliding window rate limiting
- Input sanitization (XSS, SQL injection)
- API key management with rotation
- Helmet security headers
- CSRF protection
- Crypto utilities

## Rate Limiting

### Sliding Window Algorithm

```typescript
import { SlidingWindowRateLimiter } from '@galaxy-stack/orbit-security';

const limiter = new SlidingWindowRateLimiter({
  windowMs: 60000,      // 1 minute window
  maxRequests: 100,     // 100 requests per window
  bucketCount: 6,       // 6 sub-buckets for precision
});

// Check if request allowed
const allowed = limiter.check(clientId);
if (!allowed) {
  throw new TooManyRequestsException();
}

// Get remaining requests
const remaining = limiter.getRemaining(clientId);
```

### Rate Limit Middleware

```typescript
import { RateLimitMiddleware } from '@galaxy-stack/orbit-security';

app.use(new RateLimitMiddleware({
  windowMs: 60000,
  maxRequests: 100,
  keyGenerator: (request) => {
    return request.headers.get('x-forwarded-for') || 'anonymous';
  },
}));
```

## Input Sanitization

### XSS Sanitization

```typescript
import { SanitizeHtmlPipe } from '@galaxy-stack/orbit-security';

@Post()
create(@Body('content', SanitizeHtmlPipe) content: string) {
  // content is sanitized from XSS
  return { content };
}
```

### SQL Injection Protection

```typescript
import { SqlSanitizePipe } from '@galaxy-stack/orbit-security';

@Get()
search(@Query('q', SqlSanitizePipe) query: string) {
  // query is sanitized from SQL injection patterns
  return this.searchService.search(query);
}
```

### Sanitization Service

```typescript
import { SanitizationService } from '@galaxy-stack/orbit-security';

@Injectable()
export class ContentService {
  constructor(private sanitizer: SanitizationService) {}

  process(input: string) {
    const safe = this.sanitizer.sanitizeHtml(input, {
      allowedTags: ['p', 'b', 'i', 'u', 'a'],
      allowedAttributes: {
        a: ['href'],
      },
    });
    return safe;
  }
}
```

## API Key Management

```typescript
import { ApiKeyService, ApiKeyStorage } from '@galaxy-stack/orbit-security';

const apiKeyService = new ApiKeyService(new MemoryApiKeyStorage());

// Generate new API key
const { key, hash } = await apiKeyService.generate({
  name: 'My API Key',
  expiresIn: '30d',
  scopes: ['read', 'write'],
});

// Store hash in database, give key to user
console.log('API Key (show once):', key);

// Validate API key
const isValid = await apiKeyService.validate(key, hash);

// Rotate API key
const { newKey, newHash } = await apiKeyService.rotate(oldHash);
```

## Helmet Middleware

Security headers:

```typescript
import { HelmetMiddleware } from '@galaxy-stack/orbit-security';

app.use(new HelmetMiddleware({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));
```

## CSRF Protection

```typescript
import { CsrfMiddleware, CsrfGuard } from '@galaxy-stack/orbit-security';

// Add middleware to generate tokens
app.use(new CsrfMiddleware({
  cookie: {
    name: 'csrf-token',
    httpOnly: true,
    secure: true,
  },
}));

// Protect routes
@Post()
@UseGuards(CsrfGuard)
create(@Body() data: CreateDto) {
  return data;
}
```

## Crypto Utilities

```typescript
import { CryptoService } from '@galaxy-stack/orbit-security';

const crypto = new CryptoService();

// Generate random bytes
const token = crypto.randomBytes(32);

// Hash data
const hash = await crypto.hash('data', 'sha256');

// HMAC
const signature = await crypto.hmac('data', secretKey, 'sha256');

// Encrypt/Decrypt
const encrypted = await crypto.encrypt(plaintext, key);
const decrypted = await crypto.decrypt(encrypted, key);
```

## Exports

```typescript
export {
  SlidingWindowRateLimiter,
  RateLimitMiddleware,
  SanitizeHtmlPipe,
  SqlSanitizePipe,
  SanitizationService,
  ApiKeyService,
  HelmetMiddleware,
  CsrfMiddleware,
  CsrfGuard,
  CryptoService,
};
```
