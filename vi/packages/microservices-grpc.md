# @galaxy-stack/orbit-microservices-grpc

Giao thức gRPC với hỗ trợ HTTP/2 và Protocol Buffers.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-microservices @galaxy-stack/orbit-microservices-grpc
```

## Tính năng

- HTTP/2 thông qua node:http2
- Đóng khung tin nhắn gRPC (độ dài tiền tố)
- Tuần tự hóa JSON (protobuf dự kiến)
- Cuộc gọi đơn và streaming
- Mã trạng thái gRPC tiêu chuẩn

## Định nghĩa Proto

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

## Máy chủ

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

## Trình xử lý

```typescript
@Controller()
export class UsersController {
  @GrpcMethod('UsersService', 'FindOne')
  findOne(data: UserById): User {
    return this.usersService.findById(data.id);
  }
}
```

## Khách hàng

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