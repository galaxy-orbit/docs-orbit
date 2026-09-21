# @galaxy-stack/orbit-graphql-federation

Apollo Federation v2 support for distributed GraphQL.

## Installation

```bash
bun add @galaxy-stack/orbit-graphql @galaxy-stack/orbit-graphql-federation
```

## Features

- Federation v2 directives
- Subgraph schema generation
- Entity resolution
- External type extension
- Reference resolvers

## Subgraph Setup

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { GraphQLFederationModule } from '@galaxy-stack/orbit-graphql-federation';

@Module({
  imports: [
    GraphQLFederationModule.forRoot({
      autoSchemaFile: true,
    }),
  ],
})
export class UsersModule {}
```

## Entity Definition

```typescript
import { ObjectType, Field, Directive } from '@galaxy-stack/orbit-graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field()
  id: number;

  @Field()
  name: string;
}
```

## Reference Resolver

```typescript
import { Resolver, ResolveReference } from '@galaxy-stack/orbit-graphql-federation';

@Resolver(() => User)
export class UsersResolver {
  @ResolveReference()
  resolveReference(ref: { id: number }) {
    return this.usersService.findById(ref.id);
  }
}
```

## Extending External Types

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
```

## Directives

| Directive | Description |
|-----------|-------------|
| `@key` | Define entity primary key |
| `@extends` | Extend external type |
| `@external` | Mark field as external |
| `@requires` | Specify field dependencies |
| `@provides` | Declare provided fields |
