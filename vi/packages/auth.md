# @galaxy-stack/orbit-auth

Xác thực JWT và băm mật khẩu sử dụng khả năng gốc của Bun.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-auth
```

## Thiết lập

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { AuthModule } from '@galaxy-stack/orbit-auth';

@Module({
  imports: [
    AuthModule.register({
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
      algorithm: 'HS256',
    }),
  ],
})
export class AppModule {}
```

## Băm mật khẩu

Sử dụng triển khai Argon2 gốc của Bun:

```typescript
import { Injectable } from '@galaxy-stack/orbit-core';
import { PasswordService } from '@galaxy-stack/orbit-auth';

@Injectable()
export class UserService {
  constructor(private passwordService: PasswordService) {}

  async register(email: string, password: string) {
    const hash = await this.passwordService.hash(password);
    return this.userRepository.create({ email, password: hash });
  }

  async validatePassword(plaintext: string, hash: string): Promise<boolean> {
    return this.passwordService.verify(plaintext, hash);
  }
}
```

### Tùy chọn băm

```typescript
await passwordService.hash(password, {
  algorithm: 'argon2id',  // 'argon2id' | 'argon2i' | 'argon2d'
  memoryCost: 65536,      // 64 MB
  timeCost: 3,            // số lần lặp
});
```

## Dịch vụ JWT

```typescript
import { Injectable } from '@galaxy-stack/orbit-core';
import { JwtService } from '@galaxy-stack/orbit-auth';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    
    return {
      accessToken: await this.jwtService.sign(payload),
      expiresIn: '7d',
    };
  }

  async validateToken(token: string) {
    try {
      return await this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  async decode(token: string) {
    return this.jwtService.decode(token);
  }
}
```

### Tùy chọn ký

```typescript
await jwtService.sign(payload, {
  expiresIn: '1h',        // hoặc số giây
  issuer: 'my-app',
  audience: 'my-api',
  subject: user.id,
  notBefore: '10s',       // token không hợp lệ trước 10 giây
});
```

### Tùy chọn xác minh

```typescript
await jwtService.verify(token, {
  issuer: 'my-app',
  audience: 'my-api',
  clockTolerance: 60,     // 60 giây dung sai
});
```

## Guard xác thực

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@galaxy-stack/orbit-core';
import { JwtService } from '@galaxy-stack/orbit-auth';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Không có token được cung cấp');
    }

    try {
      const payload = await this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  private extractToken(request: Request): string | null {
    const auth = request.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    return auth.slice(7);
  }
}
```

## Token làm mới

```typescript
@Injectable()
export class AuthService {
  async generateTokenPair(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(
        { sub: user.id, type: 'access' },
        { expiresIn: '15m' }
      ),
      this.jwtService.sign(
        { sub: user.id, type: 'refresh' },
        { expiresIn: '7d' }
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwtService.verify(refreshToken);
    
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Token làm mới không hợp lệ');
    }

    const user = await this.userService.findById(payload.sub);
    return this.generateTokenPair(user);
  }
}
```

## Decorator

```typescript
import { createParamDecorator, ExecutionContext } from '@galaxy-stack/orbit-core';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// Sử dụng
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: JwtPayload) {
  return user;
}
```

## Xuất khẩu

```typescript
export {
  AuthModule,
  JwtService,
  PasswordService,
  JwtPayload,
  JwtSignOptions,
  JwtVerifyOptions,
};
```