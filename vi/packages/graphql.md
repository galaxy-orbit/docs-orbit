# @galaxy-stack/orbit-graphql

GraphQL code-first với DataLoader và subscription.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-graphql graphql
```

## Thiết lập

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { GraphQLModule } from '@galaxy-stack/orbit-graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,     // Tự động tạo schema
      playground: true,          // Bật GraphQL Playground
      path: '/graphql',          // Endpoint GraphQL
      subscriptions: {
        'graphql-ws': true,      // Bật subscription
      },
    }),
  ],
})
export class AppModule {}
```

## Kiểu đối tượng

```typescript
import { ObjectType, Field, Int, ID, Float } from '@galaxy-stack/orbit-graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  age?: number;

  @Field(() => [Post])
  posts: Post[];

  @Field()
  createdAt: Date;
}

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => User)
  author: User;
}
```

## Kiểu đầu vào

```typescript
import { InputType, Field } from '@galaxy-stack/orbit-graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  age?: number;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;
}
```

## Resolver

```typescript
import { Resolver, Query, Mutation, Args, Int, ID } from '@galaxy-stack/orbit-graphql';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id', { type: () => ID }) id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.userService.create(input);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.userService.delete(id);
    return true;
  }
}
```

## Field Resolver

```typescript
import { ResolveField, Parent } from '@galaxy-stack/orbit-graphql';

@Resolver(() => User)
export class UserResolver {
  constructor(private postService: PostService) {}

  @ResolveField(() => [Post])
  async posts(@Parent() user: User): Promise<Post[]> {
    return this.postService.findByUserId(user.id);
  }

  @ResolveField(() => Int)
  async postCount(@Parent() user: User): Promise<number> {
    return this.postService.countByUserId(user.id);
  }
}
```

## DataLoader

Ngăn chặn truy vấn N+1:

```typescript
import { createDataLoader } from '@galaxy-stack/orbit-graphql';

@Resolver(() => Post)
export class PostResolver {
  private authorLoader = createDataLoader<string, User>(
    async (userIds) => {
      const users = await this.userService.findByIds(userIds);
      return userIds.map(id => users.find(u => u.id === id)!);
    }
  );

  @ResolveField(() => User)
  async author(@Parent() post: Post): Promise<User> {
    return this.authorLoader.load(post.authorId);
  }
}
```

## Subscription

```typescript
import { Resolver, Subscription, Mutation } from '@galaxy-stack/orbit-graphql';
import { PubSub } from '@galaxy-stack/orbit-graphql';

const pubSub = new PubSub();

@Resolver()
export class NotificationResolver {
  @Subscription(() => Notification)
  notificationAdded() {
    return pubSub.asyncIterator('NOTIFICATION_ADDED');
  }

  @Mutation(() => Notification)
  async sendNotification(@Args('input') input: SendNotificationInput) {
    const notification = await this.notificationService.create(input);
    pubSub.publish('NOTIFICATION_ADDED', { notificationAdded: notification });
    return notification;
  }
}
```

## Context & Guard

```typescript
import { Context, UseGuards } from '@galaxy-stack/orbit-graphql';

@Resolver()
@UseGuards(GqlAuthGuard)
export class SecureResolver {
  @Query(() => User)
  me(@Context() ctx: GraphQLContext): User {
    return ctx.req.user;
  }
}
```

## Enum

```typescript
import { registerEnumType } from '@galaxy-stack/orbit-graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Enum vai trò người dùng',
});
```

## Xuất khẩu

```typescript
export {
  GraphQLModule,
  Resolver,
  Query,
  Mutation,
  Subscription,
  Args,
  ResolveField,
  Parent,
  Context,
  ObjectType,
  InputType,
  Field,
  Int,
  Float,
  ID,
  registerEnumType,
  PubSub,
  createDataLoader,
};
```