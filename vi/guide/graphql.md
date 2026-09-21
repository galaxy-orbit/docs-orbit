# GraphQL

Orbit cung cấp triển khai GraphQL code-first với decorator.

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
      autoSchemaFile: true,
      playground: true,
      path: '/graphql',
    }),
  ],
})
export class AppModule {}
```

## Kiểu đối tượng

```typescript
import { ObjectType, Field, Int, ID } from '@galaxy-stack/orbit-graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => Int)
  age: number;

  @Field(() => [Post])
  posts: Post[];
}
```

## Resolver

```typescript
import { Resolver, Query, Mutation, Args, Int } from '@galaxy-stack/orbit-graphql';
import { UserService } from './user.service';
import { User } from './user.type';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  users() {
    return this.userService.findAll();
  }

  @Query(() => User, { nullable: true })
  user(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }
}
```

## Kiểu đầu vào

```typescript
import { InputType, Field } from '@galaxy-stack/orbit-graphql';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  age?: number;
}
```

## Field Resolver

```typescript
@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private postService: PostService,
  ) {}

  @ResolveField(() => [Post])
  async posts(@Parent() user: User) {
    return this.postService.findByUserId(user.id);
  }
}
```

## DataLoader

Ngăn chặn truy vấn N+1:

```typescript
import { createDataLoader } from '@galaxy-stack/orbit-graphql';

@Resolver(() => User)
export class UserResolver {
  private postsLoader = createDataLoader<number, Post[]>(
    async (userIds) => {
      const posts = await this.postService.findByUserIds(userIds);
      return userIds.map(id => posts.filter(p => p.userId === id));
    }
  );

  @ResolveField(() => [Post])
  async posts(@Parent() user: User) {
    return this.postsLoader.load(user.id);
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
  @Subscription(() => Notification, {
    filter: (payload, variables) => {
      return payload.userId === variables.userId;
    },
  })
  notificationAdded(@Args('userId') userId: string) {
    return pubSub.asyncIterator('notificationAdded');
  }

  @Mutation(() => Notification)
  async sendNotification(@Args('input') input: SendNotificationInput) {
    const notification = await this.notificationService.create(input);
    pubSub.publish('notificationAdded', notification);
    return notification;
  }
}
```

## Guard và Interceptor

```typescript
@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  @Query(() => User)
  me(@CurrentUser() user: User) {
    return user;
  }
}
```

## Directive schema

```typescript
import { Directive, Field, ObjectType } from '@galaxy-stack/orbit-graphql';

@ObjectType()
export class User {
  @Field()
  @Directive('@deprecated(reason: "Sử dụng fullName thay thế")')
  name: string;

  @Field()
  fullName: string;
}
```