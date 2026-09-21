# Lifecycle Hooks

Orbit cung cấp các hook vòng đời để khởi tạo và dọn dẹp.

## Các Hook có sẵn

| Hook | Mô tả |
|------|-------------|
| `OnModuleInit` | Được gọi sau khi các provider của module được giải quyết |
| `OnModuleDestroy` | Được gọi trước khi module bị hủy |
| `OnApplicationBootstrap` | Được gọi sau khi tất cả các module được khởi tạo |
| `OnApplicationShutdown` | Được gọi khi ứng dụng tắt |

## OnModuleInit

```typescript
import { Injectable, OnModuleInit } from '@galaxy-stack/orbit-common';

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    await this.connect();
    console.log('Đã kết nối cơ sở dữ liệu');
  }
}
```

## OnModuleDestroy

```typescript
@Injectable()
export class DatabaseService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.disconnect();
    console.log('Đã ngắt kết nối cơ sở dữ liệu');
  }
}
```

## OnApplicationBootstrap

```typescript
@Injectable()
export class AppService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    console.log('Ứng dụng đã được khởi tạo hoàn toàn');
    this.startBackgroundJobs();
  }
}
```

## OnApplicationShutdown

```typescript
@Injectable()
export class CacheService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    console.log(`Đang tắt do ${signal}`);
    await this.flush();
    await this.close();
  }
}
```

## Tắt ứng dụng đúng cách

```typescript
const app = await BunFactory.create(AppModule);

app.enableShutdownHooks();

await app.listen(3000);
```

## Thứ tự thực thi

1. `OnModuleInit` (cho từng module, theo chiều sâu trước)
2. `OnApplicationBootstrap` (tất cả các module)
3. Ứng dụng chạy...
4. `OnApplicationShutdown` (tất cả các module)
5. `OnModuleDestroy` (cho từng module, theo thứ tự ngược lại)