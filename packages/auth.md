# @galaxy-stack/orbit-auth

JWT authentication and password hashing using Bun's native capabilities.

## Installation

```bash
bun add @galaxy-stack/orbit-auth
```

## Setup

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

## Password Hashing

Uses Bun's native Argon2 implementation:

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

### Hash Options

```typescript
await passwordService.hash(password, {
  algorithm: 'argon2id',  // 'argon2id' | 'argon2i' | 'argon2d'
  memoryCost: 65536,      // 64 MB
  timeCost: 3,            // iterations
});
```

## JWT Service

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
      throw new UnauthorizedException('Invalid token');
    }
  }

  async decode(token: string) {
    return this.jwtService.decode(token);
  }
}
```

### Sign Options

```typescript
await jwtService.sign(payload, {
  expiresIn: '1h',        // or number in seconds
  issuer: 'my-app',
  audience: 'my-api',
  subject: user.id,
  notBefore: '10s',       // token not valid before 10 seconds
});
```

### Verify Options

```typescript
await jwtService.verify(token, {
  issuer: 'my-app',
  audience: 'my-api',
  clockTolerance: 60,     // 60 seconds tolerance
});
```

## Auth Guard

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
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(request: Request): string | null {
    const auth = request.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    return auth.slice(7);
  }
}
```

## Refresh Tokens

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
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findById(payload.sub);
    return this.generateTokenPair(user);
  }
}
```

## Decorators

```typescript
import { createParamDecorator, ExecutionContext } from '@galaxy-stack/orbit-core';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// Usage
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: JwtPayload) {
  return user;
}
```

## Exports

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
