# Caching

Orbit provides flexible caching with memory and Redis stores.

## Installation

```bash
bun add @galaxy-stack/orbit-cache
```

## Setup

### Memory Cache

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { CacheModule } from '@galaxy-stack/orbit-cache';

@Module({
  imports: [
    CacheModule.register({
      store: 'memory',
      ttl: 300, // 5 minutes
      max: 1000, // Max items
    }),
  ],
})
export class AppModule {}
```

### Redis Cache

```typescript
@Module({
  imports: [
    CacheModule.register({
      store: 'redis',
      host: 'localhost',
      port: 6379,
      ttl: 300,
    }),
  ],
})
export class AppModule {}
```

## Using Cache Service

```typescript
import { Injectable, Inject, CACHE_MANAGER } from '@galaxy-stack/orbit-core';
import { Cache } from '@galaxy-stack/orbit-cache';

@Injectable()
export class UserService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async findOne(id: string) {
    const cacheKey = `user:${id}`;
    
    // Try cache first
    const cached = await this.cache.get<User>(cacheKey);
    if (cached) return cached;

    // Fetch from database
    const user = await this.userRepository.findOne(id);
    
    // Store in cache
    await this.cache.set(cacheKey, user, 300);
    
    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.userRepository.update(id, data);
    
    // Invalidate cache
    await this.cache.del(`user:${id}`);
    
    return user;
  }
}
```

## Decorator-Based Caching

```typescript
import { Cacheable, CacheEvict, CachePut } from '@galaxy-stack/orbit-cache';

@Injectable()
export class ProductService {
  @Cacheable({ key: 'products', ttl: 600 })
  findAll() {
    return this.productRepository.findAll();
  }

  @Cacheable({ key: (id) => `product:${id}`, ttl: 300 })
  findOne(id: string) {
    return this.productRepository.findOne(id);
  }

  @CacheEvict({ key: 'products' })
  @CachePut({ key: (id) => `product:${id}` })
  update(id: string, data: UpdateProductDto) {
    return this.productRepository.update(id, data);
  }

  @CacheEvict({ key: (id) => `product:${id}` })
  remove(id: string) {
    return this.productRepository.remove(id);
  }
}
```

## Cache Interceptor

Auto-cache GET requests:

```typescript
import { UseInterceptors, CacheInterceptor, CacheTTL, CacheKey } from '@galaxy-stack/orbit-cache';

@Controller('products')
@UseInterceptors(CacheInterceptor)
export class ProductController {
  @Get()
  @CacheTTL(600)
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @CacheKey('product')
  @CacheTTL(300)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
}
```

## Cache Patterns

### Cache-Aside

```typescript
async getData(key: string) {
  let data = await this.cache.get(key);
  
  if (!data) {
    data = await this.fetchFromDb(key);
    await this.cache.set(key, data, 300);
  }
  
  return data;
}
```

### Write-Through

```typescript
async updateData(key: string, value: any) {
  await this.updateDb(key, value);
  await this.cache.set(key, value, 300);
}
```

### Write-Behind

```typescript
async updateData(key: string, value: any) {
  await this.cache.set(key, value, 300);
  this.queue.add({ key, value }); // Async DB write
}
```

## Cache Invalidation

```typescript
// Delete single key
await cache.del('user:123');

// Delete multiple keys
await cache.del(['user:123', 'user:456']);

// Clear all cache
await cache.reset();

// Pattern-based invalidation (Redis only)
await cache.delByPattern('user:*');
```

## TTL Strategies

```typescript
// Short TTL for frequently changing data
@Cacheable({ ttl: 60 }) // 1 minute

// Medium TTL for semi-static data
@Cacheable({ ttl: 3600 }) // 1 hour

// Long TTL for static data
@Cacheable({ ttl: 86400 }) // 24 hours

// No expiration
@Cacheable({ ttl: 0 })
```
