# @galaxy-stack/orbit-microservices-grpc

gRPC transport with HTTP/2 and Protocol Buffers support.

## Installation

```bash
bun add @galaxy-stack/orbit-microservices @galaxy-stack/orbit-microservices-grpc
```

## Features

- HTTP/2 via node:http2
- gRPC message framing (length-prefixed)
- JSON serialization (protobuf planned)
- Unary and streaming calls
- Standard gRPC status codes

## Proto Definition

```protobuf
// users.proto
syntax = "proto3";

package users;

service UsersService {
  rpc FindOne (UserById) returns (User);
  rpc Create (CreateUserRequest) returns (User);
}

message UserById { int32 id = 1; }
message User { int32 id = 1; string name = 2; }
message CreateUserRequest { string name = 1; string email = 2; }
```

## Server

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.GRPC,
  options: {
    package: 'users',
    protoPath: './users.proto',
    url: 'localhost:5000',
  },
});

await app.listen();
```

## Handler

```typescript
@Controller()
export class UsersController {
  @GrpcMethod('UsersService', 'FindOne')
  findOne(data: UserById): User {
    return this.usersService.findById(data.id);
  }
}
```

## Client

```typescript
@Injectable()
export class Gateway implements OnModuleInit {
  private usersService: UsersService;

  constructor(@Inject('USERS_PKG') private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService = this.client.getService('UsersService');
  }

  getUser(id: number) {
    return this.usersService.findOne({ id });
  }
}
```
