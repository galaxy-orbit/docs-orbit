# @galaxy-stack/orbit-cache

Module bộ nhớ đệm với lưu trữ Bộ nhớ và Redis.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-cache
```

## Thiết lập

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { CacheModule } from '@galaxy-stack/orbit-cache';

@Module({
  imports: [
    CacheModule.register({
      store: 'memory',
      ttl: 60,
      max: 100,
    }),
  ],
})
export class AppModule {}
```

## Sử dụng CacheService

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';
import { CacheService } from '@galaxy-stack/orbit-cache';

@Injectable()
export class UsersService {
  constructor(private cache: CacheService) {}

  async getUser(id: number) {
    const cached = await this.cache.get(`user:${id}`);
    if (cached) return cached;

    const user = await this.usersRepo.findById(id);
    await this.cache.set(`user:${id}`, user, 300);
    return user;
  }

  async invalidateUser(id: number) {
    await this.cache.del(`user:${id}`);
  }
}
```

## Decorator @Cacheable

```typescript
import { Cacheable, CacheEvict } from '@galaxy-stack/orbit-cache';

@Injectable()
export class ProductsService {
  @Cacheable({ key: 'products:all', ttl: 600 })
  async findAll() {
    return this.productsRepo.findAll();
  }

  @Cacheable({ key: (id) => `product:${id}`, ttl: 300 })
  async findById(id: number) {
    return this.productsRepo.findById(id);
  }

  @CacheEvict({ key: 'products:all' })
  async create(data: CreateProductDto) {
    return this.productsRepo.create(data);
  }
}
```

## Lưu trữ Redis

```typescript
@Module({
  imports: [
    CacheModule.register({
      store: 'redis',
      host: 'localhost',
      port: 6379,
      password: process.env.REDIS_PASSWORD,
      ttl: 300,
    }),
  ],
})
export class AppModule {}
```

## Phương thức Cache

```typescript
interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  reset(): Promise<void>;
  keys(pattern?: string): Promise<string[]>;
}
```