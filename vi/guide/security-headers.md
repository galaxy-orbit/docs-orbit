# CORS & Tiêu đề bảo mật

Cấu hình CORS và tiêu đề bảo mật với `@galaxy-stack/orbit-security`.

## Cấu hình CORS

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { CorsMiddleware } from '@galaxy-stack/orbit-security';

const app = await BunFactory.create(AppModule);

app.use(CorsMiddleware({
  origin: ['https://example.com', 'https://app.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}));
```

## Tiêu đề bảo mật Helmet

```typescript
import { HelmetMiddleware } from '@galaxy-stack/orbit-security';

app.use(HelmetMiddleware({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  xssFilter: true,
  noSniff: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));
```

## Tiêu đề riêng lẻ

```typescript
import { 
  XFrameOptionsMiddleware,
  XContentTypeOptionsMiddleware,
  ReferrerPolicyMiddleware,
} from '@galaxy-stack/orbit-security';

app.use(XFrameOptionsMiddleware('DENY'));
app.use(XContentTypeOptionsMiddleware());
app.use(ReferrerPolicyMiddleware('strict-origin-when-cross-origin'));
```

## Bảo vệ CSRF

```typescript
import { CsrfMiddleware, CsrfGuard } from '@galaxy-stack/orbit-security';

app.use(CsrfMiddleware({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    sameSite: 'strict',
  },
}));

@Controller('posts')
@UseGuards(CsrfGuard)
export class PostsController {
  @Post()
  createPost(@Body() data: CreatePostDto) {
    return this.postsService.create(data);
  }
}
```

## Tiêu đề giới hạn tốc độ

```typescript
import { RateLimitMiddleware } from '@galaxy-stack/orbit-security';

app.use(RateLimitMiddleware({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));
```