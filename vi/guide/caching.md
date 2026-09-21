# Bộ nhớ đệm

Orbit cung cấp bộ nhớ đệm linh hoạt với lưu trữ bộ nhớ và Redis.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-cache
```

## Thiết lập

### Bộ nhớ đệm

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { CacheModule } from '@galaxy-stack/orbit-cache';

@Module({
  imports: [
    CacheModule.register({
      store: 'memory',
      ttl: 300, // 5 phút
      max: 1000, // Số mục tối đa
    }),
  ],
})
export class AppModule {}
```

### Bộ nhớ đệm Redis

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

## Sử dụng dịch vụ bộ nhớ đệm

```typescript
import { Injectable, Inject, CACHE_MANAGER } from '@galaxy-stack/orbit-core';
import { Cache } from '@galaxy-stack/orbit-cache';

@Injectable()
export class UserService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async findOne(id: string) {
    const cacheKey = `user:${id}`;
    
    // Thử từ bộ nhớ đệm trước
    const cached = await this.cache.get<User>(cacheKey);
    if (cached) return cached;

    // Lấy từ cơ sở dữ liệu
    const user = await this.userRepository.findOne(id);
    
    // Lưu vào bộ nhớ đệm
    await this.cache.set(cacheKey, user, 300);
    
    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.userRepository.update(id, data);
    
    // Hủy bộ nhớ đệm
    await this.cache.del(`user:${id}`);
    
    return user;
  }
}
```

## Bộ nhớ đệm dựa trên Decorator

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

## Interceptor bộ nhớ đệm

Tự động bộ nhớ đệm các yêu cầu GET:

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

## Mẫu bộ nhớ đệm

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
  this.queue.add({ key, value }); // Ghi DB bất đồng bộ
}
```

## Hủy bộ nhớ đệm

```typescript
// Xóa một khóa
await cache.del('user:123');

// Xóa nhiều khóa
await cache.del(['user:123', 'user:456']);

// Xóa tất cả bộ nhớ đệm
await cache.reset();

// Hủy theo mẫu (chỉ Redis)
await cache.delByPattern('user:*');
```

## Chiến lược TTL

```typescript
// TTL ngắn cho dữ liệu thay đổi thường xuyên
@Cacheable({ ttl: 60 }) // 1 phút

// TTL trung bình cho dữ liệu bán tĩnh
@Cacheable({ ttl: 3600 }) // 1 giờ

// TTL dài cho dữ liệu tĩnh
@Cacheable({ ttl: 86400 }) // 24 giờ

// Không hết hạn
@Cacheable({ ttl: 0 })
```