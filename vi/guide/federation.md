# GraphQL Federation

Xây dựng kiến trúc GraphQL phân tán với hỗ trợ Apollo Federation v2.

## Thiết lập Subgraph

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { GraphQLFederationModule } from '@galaxy-stack/orbit-graphql-federation';

@Module({
  imports: [
    GraphQLFederationModule.forRoot({
      autoSchemaFile: true,
      buildSchemaOptions: {
        orphanedTypes: [User],
      },
    }),
  ],
})
export class UsersSubgraphModule {}
```

## Định nghĩa thực thể

```typescript
import { ObjectType, Field, Directive } from '@galaxy-stack/orbit-graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;
}
```

## Resolver tham chiếu

```typescript
import { Resolver, ResolveReference } from '@galaxy-stack/orbit-graphql-federation';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @ResolveReference()
  async resolveReference(reference: { id: number }) {
    return this.usersService.findById(reference.id);
  }
}
```

## Mở rộng kiểu bên ngoài

```typescript
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field()
  @Directive('@external')
  id: number;

  @Field(() => [Post])
  posts: Post[];
}

@Resolver(() => User)
export class UserPostsResolver {
  @ResolveField()
  async posts(@Parent() user: User) {
    return this.postsService.findByUserId(user.id);
  }
}
```

## Cấu hình Gateway

```typescript
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'users', url: 'http://localhost:3001/graphql' },
      { name: 'posts', url: 'http://localhost:3002/graphql' },
      { name: 'comments', url: 'http://localhost:3003/graphql' },
    ],
  }),
});
```