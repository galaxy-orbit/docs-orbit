# @galaxy-stack/orbit-security

Tiện ích bảo mật bao gồm giới hạn tốc độ, làm sạch dữ liệu và quản lý khóa API.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-security
```

## Tính năng

- Giới hạn tốc độ theo thuật toán sliding window
- Làm sạch dữ liệu đầu vào (XSS, SQL injection)
- Quản lý khóa API với khả năng xoay khóa
- Header bảo mật Helmet
- Bảo vệ CSRF
- Tiện ích mã hóa

## Giới hạn tốc độ

### Thuật toán Sliding Window

```typescript
import { SlidingWindowRateLimiter } from '@galaxy-stack/orbit-security';

const limiter = new SlidingWindowRateLimiter({
  windowMs: 60000,      // Cửa sổ 1 phút
  maxRequests: 100,     // 100 yêu cầu mỗi cửa sổ
  bucketCount: 6,       // 6 bucket con để tăng độ chính xác
});

// Kiểm tra yêu cầu có được phép không
const allowed = limiter.check(clientId);
if (!allowed) {
  throw new TooManyRequestsException();
}

// Lấy số yêu cầu còn lại
const remaining = limiter.getRemaining(clientId);
```

### Middleware giới hạn tốc độ

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

## Làm sạch dữ liệu đầu vào

### Làm sạch XSS

```typescript
import { SanitizeHtmlPipe } from '@galaxy-stack/orbit-security';

@Post()
create(@Body('content', SanitizeHtmlPipe) content: string) {
  // content đã được làm sạch khỏi XSS
  return { content };
}
```

### Bảo vệ SQL Injection

```typescript
import { SqlSanitizePipe } from '@galaxy-stack/orbit-security';

@Get()
search(@Query('q', SqlSanitizePipe) query: string) {
  // query đã được làm sạch khỏi các mẫu SQL injection
  return this.searchService.search(query);
}
```

### Dịch vụ làm sạch

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

## Quản lý khóa API

```typescript
import { ApiKeyService, ApiKeyStorage } from '@galaxy-stack/orbit-security';

const apiKeyService = new ApiKeyService(new MemoryApiKeyStorage());

// Tạo khóa API mới
const { key, hash } = await apiKeyService.generate({
  name: 'Khóa API của tôi',
  expiresIn: '30d',
  scopes: ['read', 'write'],
});

// Lưu hash vào cơ sở dữ liệu, cung cấp key cho người dùng
console.log('Khóa API (chỉ hiển thị một lần):', key);

// Xác thực khóa API
const isValid = await apiKeyService.validate(key, hash);

// Xoay khóa API
const { newKey, newHash } = await apiKeyService.rotate(oldHash);
```

## Middleware Helmet

Header bảo mật:

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

## Bảo vệ CSRF

```typescript
import { CsrfMiddleware, CsrfGuard } from '@galaxy-stack/orbit-security';

// Thêm middleware để tạo token
app.use(new CsrfMiddleware({
  cookie: {
    name: 'csrf-token',
    httpOnly: true,
    secure: true,
  },
}));

// Bảo vệ route
@Post()
@UseGuards(CsrfGuard)
create(@Body() data: CreateDto) {
  return data;
}
```

## Tiện ích mã hóa

```typescript
import { CryptoService } from '@galaxy-stack/orbit-security';

const crypto = new CryptoService();

// Tạo byte ngẫu nhiên
const token = crypto.randomBytes(32);

// Băm dữ liệu
const hash = await crypto.hash('data', 'sha256');

// HMAC
const signature = await crypto.hmac('data', secretKey, 'sha256');

// Mã hóa/Giải mã
const encrypted = await crypto.encrypt(plaintext, key);
const decrypted = await crypto.decrypt(encrypted, key);
```

## Xuất khẩu

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