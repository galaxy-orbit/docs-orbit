# @galaxy-stack/orbit-file-storage

File storage — local and memory drivers with a pluggable `StorageDriver` interface (S3-ready).

```bash
bun add @galaxy-stack/orbit-file-storage
```

## Usage

```ts
import { StorageModule, StorageService, Module } from '@galaxy-stack/orbit-file-storage';

@Module({
  imports: [StorageModule.forRoot({ driver: 'local', root: './uploads' })],
})
export class AppModule {}

// anywhere with DI:
constructor(private storage: StorageService) {}
await this.storage.put('avatars/u1.png', bytes);
const json = await this.storage.getJson('data/config.json');
```

API: `put`, `get`, `getText`, `getJson`, `putJson`, `delete`, `exists`, `list`, `copy`, `size`. Keys validated against traversal. Implement `StorageDriver` (S3, GCS…) and pass `{ driver: 'custom', driverInstance }`.
