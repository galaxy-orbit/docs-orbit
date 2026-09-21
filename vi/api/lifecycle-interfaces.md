# Interface Vòng đời

Interface cho hook vòng đời của ứng dụng và module.

## OnModuleInit

Được gọi sau khi provider của module được giải quyết.

```typescript
interface OnModuleInit {
  onModuleInit(): any;
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    await this.connect();
    console.log('Cơ sở dữ liệu đã kết nối');
  }
}
```

## OnModuleDestroy

Được gọi trước khi module bị hủy.

```typescript
interface OnModuleDestroy {
  onModuleDestroy(): any;
}

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.disconnect();
    console.log('Cơ sở dữ liệu đã ngắt kết nối');
  }
}
```

## OnApplicationBootstrap

Được gọi sau khi tất cả module được khởi tạo.

```typescript
interface OnApplicationBootstrap {
  onApplicationBootstrap(): any;
}

@Injectable()
export class CacheWarmupService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    await this.warmupCache();
    console.log('Bộ nhớ đệm đã được làm nóng');
  }
}
```

## OnApplicationShutdown

Được gọi khi tắt ứng dụng.

```typescript
interface OnApplicationShutdown {
  onApplicationShutdown(signal?: string): any;
}

@Injectable()
export class CleanupService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    console.log(`Đang tắt với tín hiệu: ${signal}`);
    await this.cleanup();
  }
}
```

## BeforeApplicationShutdown

Được gọi trước hook tắt ứng dụng.

```typescript
interface BeforeApplicationShutdown {
  beforeApplicationShutdown(signal?: string): any;
}

@Injectable()
export class GracefulShutdownService implements BeforeApplicationShutdown {
  async beforeApplicationShutdown(signal?: string) {
    await this.stopAcceptingRequests();
    await this.waitForPendingRequests();
  }
}
```

## Thứ tự Vòng đời

1. `OnModuleInit` (từng module, theo chiều sâu)
2. `OnApplicationBootstrap` (tất cả provider)
3. Ứng dụng chạy...
4. `BeforeApplicationShutdown` (tất cả provider)
5. `OnApplicationShutdown` (tất cả provider)
6. `OnModuleDestroy` (từng module, thứ tự ngược lại)

## Bật Hook tắt ứng dụng

```typescript
const app = await BunFactory.create(AppModule);
app.enableShutdownHooks();
await app.listen(3000);
```