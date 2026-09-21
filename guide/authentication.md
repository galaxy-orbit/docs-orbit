# Authentication

Orbit provides JWT authentication with native password hashing.

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
    }),
  ],
})
export class AppModule {}
```

## Password Hashing

Uses Bun's native Argon2 hashing:

```typescript
import { Injectable } from '@galaxy-stack/orbit-core';
import { PasswordService } from '@galaxy-stack/orbit-auth';

@Injectable()
export class UserService {
  constructor(private passwordService: PasswordService) {}

  async register(email: string, password: string) {
    const hashedPassword = await this.passwordService.hash(password);
    return this.userRepository.create({ email, password: hashedPassword });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isValid = await this.passwordService.verify(password, user.password);
    if (!isValid) return null;

    return user;
  }
}
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
      access_token: await this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string) {
    return this.jwtService.verify(token);
  }
}
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
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractToken(request: Request): string | null {
    const auth = request.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    return auth.slice(7);
  }
}
```

## Current User Decorator

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
getProfile(@CurrentUser() user: User) {
  return user;
}
```

## Refresh Tokens

```typescript
@Injectable()
export class AuthService {
  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' }),
      this.jwtService.sign({ sub: user.id, type: 'refresh' }, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    const payload = await this.jwtService.verify(refreshToken);
    
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findOne(payload.sub);
    return this.generateTokens(user);
  }
}
```

## Auth Controller

```typescript
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }
}
```
