# Trình xử lý GraphQL

Trình xử lý thực hiện các truy vấn, mutation và subscription GraphQL trong Orbit.

## Trình xử lý cơ bản

```typescript
import { Resolver, Query, Mutation, Args } from '@galaxy-stack/orbit-graphql';
import { Injectable } from '@galaxy-stack/orbit-common';
import { UsersService } from './users.service';

@Resolver('User')
@Injectable()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  async getUsers() {
    return this.usersService.findAll();
  }

  @Query('user')
  async getUser(@Args('id') id: number) {
    return this.usersService.findById(id);
  }

  @Mutation('createUser')
  async createUser(@Args('input') input: CreateUserInput) {
    return this.usersService.create(input);
  }
}
```

## Trình xử lý trường

```typescript
@Resolver('User')
export class UsersResolver {
  @ResolveField('posts')
  async getPosts(@Parent() user: User) {
    return this.postsService.findByUserId(user.id);
  }

  @ResolveField('fullName')
  getFullName(@Parent() user: User) {
    return `${user.firstName} ${user.lastName}`;
  }
}
```

## Xác thực đầu vào

```typescript
import { InputType, Field } from '@galaxy-stack/orbit-graphql';
import { z } from 'zod';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;
}

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

@Mutation('createUser')
async createUser(@Args('input', new ZodValidationPipe(schema)) input: CreateUserInput) {
  return this.usersService.create(input);
}
```

## Ngữ cảnh & Thông tin

```typescript
@Query('me')
async getCurrentUser(@Context() ctx: GraphQLContext) {
  return ctx.user;
}

@Query('posts')
async getPosts(@Info() info: GraphQLResolveInfo) {
  const fields = getRequestedFields(info);
  return this.postsService.findAll({ select: fields });
}
```