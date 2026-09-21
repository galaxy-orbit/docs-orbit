# Phiên bản API

Hỗ trợ nhiều phiên bản API với hệ thống phiên bản của Orbit.

## Bật phiên bản

```typescript
import { BunFactory, VersioningType } from '@galaxy-stack/orbit-core';

const app = await BunFactory.create(AppModule);

app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1',
});
```

## Các loại phiên bản

### URI Versioning

```typescript
app.enableVersioning({
  type: VersioningType.URI,
  prefix: 'v',
});

// Routes: /v1/users, /v2/users
```

### Header Versioning

```typescript
app.enableVersioning({
  type: VersioningType.HEADER,
  header: 'X-API-Version',
});

// Header: X-API-Version: 1
```

### Media Type Versioning

```typescript
app.enableVersioning({
  type: VersioningType.MEDIA_TYPE,
  key: 'v=',
});

// Accept: application/json;v=1
```

## Phiên bản Controller

```typescript
import { Controller, Version } from '@galaxy-stack/orbit-common';

@Controller('users')
@Version('1')
export class UsersV1Controller {
  @Get()
  findAll() {
    return { version: 1, users: [] };
  }
}

@Controller('users')
@Version('2')
export class UsersV2Controller {
  @Get()
  findAll() {
    return { version: 2, data: { users: [], meta: {} } };
  }
}
```

## Phiên bản cấp phương thức

```typescript
@Controller('users')
export class UsersController {
  @Get()
  @Version('1')
  findAllV1() {
    return this.usersService.findAllLegacy();
  }

  @Get()
  @Version('2')
  findAllV2() {
    return this.usersService.findAll();
  }
}
```

## Phiên bản trung lập

```typescript
import { VERSION_NEUTRAL } from '@galaxy-stack/orbit-core';

@Controller('health')
@Version(VERSION_NEUTRAL)
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}