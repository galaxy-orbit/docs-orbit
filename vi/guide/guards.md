# Guard

Guard xác định xem một yêu cầu có được xử lý bởi trình xử lý route hay không. Chúng thường được sử dụng cho xác thực và ủy quyền.

## Guard cơ bản

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
    
    // Xác thực token
    return this.validateToken(token);
  }

  private async validateToken(token: string): Promise<boolean> {
    // Logic xác thực token
    return true;
  }
}
```

## Sử dụng Guard

### Cấp độ Controller

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

### Cấp độ Phương thức

```typescript
@Controller('users')
export class UserController {
  @Get()
  findAll() {
    return []; // Công khai
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile() {
    return {}; // Được bảo vệ
  }
}
```

### Guard toàn cục

```typescript
const app = await BunFactory.create(AppModule);
app.useGlobalGuards(new AuthGuard());
```

## Kiểm soát truy cập dựa trên vai trò

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

Sử dụng:

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

## Guard xác thực JWT

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

## Kết hợp nhiều Guard

Guard thực thi theo thứ tự. Tất cả phải trả về true:

```typescript
@UseGuards(AuthGuard, RolesGuard, ThrottleGuard)
@Controller('protected')
export class ProtectedController {}
```

## Thứ tự thực thi Guard

1. Guard toàn cục
2. Guard controller
3. Guard phương thức

```typescript
// Guard toàn cục chạy trước
app.useGlobalGuards(new LoggingGuard());

@UseGuards(AuthGuard) // Sau đó là guard controller
@Controller('users')
export class UserController {
  @Get(':id')
  @UseGuards(OwnerGuard) // Cuối cùng là guard phương thức
  findOne() {}
}
```