# Ủy quyền

Kiểm soát truy cập dựa trên vai trò và quyền trong Orbit.

## Kiểm soát truy cập dựa trên vai trò (RBAC)

```typescript
import { SetMetadata } from '@galaxy-stack/orbit-common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

## Guard vai trò

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@galaxy-stack/orbit-common';
import { Reflector } from '@galaxy-stack/orbit-core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    
    if (!requiredRoles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

## Sử dụng vai trò

```typescript
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  @Get('users')
  @Roles('admin')
  getUsers() {
    return this.usersService.findAll();
  }

  @Delete('users/:id')
  @Roles('admin', 'moderator')
  deleteUser(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
```

## Truy cập dựa trên quyền

```typescript
export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());
    const user = context.switchToHttp().getRequest().user;
    
    return required.every(p => user.permissions.includes(p));
  }
}
```

## Ủy quyền dựa trên chính sách

```typescript
@Injectable()
export class PostPolicy {
  canUpdate(user: User, post: Post): boolean {
    return post.authorId === user.id || user.roles.includes('admin');
  }

  canDelete(user: User, post: Post): boolean {
    return user.roles.includes('admin');
  }
}

@Put(':id')
async updatePost(@Param('id') id: number, @Body() data: UpdatePostDto, @User() user: User) {
  const post = await this.postsService.findById(id);
  
  if (!this.postPolicy.canUpdate(user, post)) {
    throw new ForbiddenException();
  }
  
  return this.postsService.update(id, data);
}
```