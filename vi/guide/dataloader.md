# DataLoader

DataLoader giải quyết vấn đề truy vấn N+1 trong GraphQL bằng cách nhóm và lưu trữ các yêu cầu cơ sở dữ liệu.

## Thiết lập

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { GraphQLModule } from '@galaxy-stack/orbit-graphql';
import { DataLoaderModule } from '@galaxy-stack/orbit-graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    DataLoaderModule,
  ],
})
export class AppModule {}
```

## Tạo DataLoader

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';
import { DataLoaderFactory, Loader } from '@galaxy-stack/orbit-graphql';

@Injectable()
export class UsersLoader {
  constructor(private readonly usersService: UsersService) {}

  @Loader('users')
  createLoader(): DataLoaderFactory<number, User> {
    return {
      batch: async (ids: number[]) => {
        const users = await this.usersService.findByIds(ids);
        return ids.map(id => users.find(u => u.id === id) || null);
      },
    };
  }
}
```

## Sử dụng DataLoader trong Resolver

```typescript
@Resolver('Post')
export class PostsResolver {
  @ResolveField('author')
  async getAuthor(
    @Parent() post: Post,
    @Loader('users') usersLoader: DataLoader<number, User>,
  ) {
    return usersLoader.load(post.authorId);
  }
}
```

## Tải hàng loạt nhiều trường

```typescript
@Injectable()
export class PostsLoader {
  @Loader('userPosts')
  createLoader(): DataLoaderFactory<number, Post[]> {
    return {
      batch: async (userIds: number[]) => {
        const posts = await this.postsService.findByUserIds(userIds);
        return userIds.map(id => posts.filter(p => p.userId === id));
      },
    };
  }
}
```

## Tùy chọn lưu trữ

```typescript
@Loader('users')
createLoader(): DataLoaderFactory<number, User> {
  return {
    batch: async (ids) => this.batchLoad(ids),
    options: {
      cache: true,
      maxBatchSize: 100,
      cacheKeyFn: (key) => String(key),
    },
  };
}
```