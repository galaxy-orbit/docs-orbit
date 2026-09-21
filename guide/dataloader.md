# DataLoader

DataLoader solves the N+1 query problem in GraphQL by batching and caching database requests.

## Setup

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

## Creating a DataLoader

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

## Using DataLoader in Resolvers

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

## Batch Loading Multiple Fields

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

## Caching Options

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
