# Guards

Guards determine whether a request will be handled by the route handler. They are commonly used for authentication and authorization.

## Basic Guard

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@galaxy-stack/orbit-core';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.get('authorization');
    
    if (!token) {
      return false;
    }
    
    // Validate token
    return this.validateToken(token);
  }

  private async validateToken(token: string): Promise<boolean> {
    // Token validation logic
    return true;
  }
}
```

## Using Guards

### Controller Level

```typescript
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  @Get()
  findAll() {
    return [];
  }
}
```

### Method Level

```typescript
@Controller('users')
export class UserController {
  @Get()
  findAll() {
    return []; // Public
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile() {
    return {}; // Protected
  }
}
```

### Global Guards

```typescript
const app = await BunFactory.create(AppModule);
app.useGlobalGuards(new AuthGuard());
```

## Role-Based Access Control

```typescript
// roles.decorator.ts
import { SetMetadata } from '@galaxy-stack/orbit-core';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}
```

Usage:

```typescript
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  @Get()
  @Roles('admin')
  adminOnly() {
    return { admin: true };
  }

  @Get('managers')
  @Roles('admin', 'manager')
  managersAndAdmins() {
    return { data: [] };
  }
}
```

## JWT Authentication Guard

```typescript
import { JwtService } from '@galaxy-stack/orbit-auth';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const payload = await this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch {
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

## Combining Multiple Guards

Guards execute in order. All must return true:

```typescript
@UseGuards(AuthGuard, RolesGuard, ThrottleGuard)
@Controller('protected')
export class ProtectedController {}
```

## Guard Execution Order

1. Global guards
2. Controller guards
3. Method guards

```typescript
// Global guard runs first
app.useGlobalGuards(new LoggingGuard());

@UseGuards(AuthGuard) // Then controller guard
@Controller('users')
export class UserController {
  @Get(':id')
  @UseGuards(OwnerGuard) // Finally method guard
  findOne() {}
}
```
