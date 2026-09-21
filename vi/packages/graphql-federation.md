# @galaxy-stack/orbit-graphql-federation

Hỗ trợ Apollo Federation v2 cho GraphQL phân tán.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-graphql @galaxy-stack/orbit-graphql-federation
```

## Tính năng

- Directive Federation v2
- Tạo schema subgraph
- Giải quyết thực thể
- Mở rộng kiểu bên ngoài
- Resolver tham chiếu

## Thiết lập Subgraph

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
}
```

## Resolver tham chiếu

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
```

## Directive

| Directive | Mô tả |
|-----------|------|
| `@key` | Định nghĩa khóa chính thực thể |
| `@extends` | Mở rộng kiểu bên ngoài |
| `@external` | Đánh dấu trường là bên ngoài |
| `@requires` | Chỉ định phụ thuộc trường |
| `@provides` | Khai báo trường được cung cấp |