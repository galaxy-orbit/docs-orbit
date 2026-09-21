# gRPC Transport

High-performance gRPC transport with Protocol Buffers.

## Proto Definition

```protobuf
// users.proto
syntax = "proto3";

package users;

service UsersService {
  rpc FindOne (UserById) returns (User);
  rpc FindAll (Empty) returns (stream User);
  rpc Create (CreateUserRequest) returns (User);
}

message UserById {
  int32 id = 1;
}

message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
}

message Empty {}
```

## Server Setup

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';
import { join } from 'path';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.GRPC,
  options: {
    package: 'users',
    protoPath: join(__dirname, 'users.proto'),
    url: 'localhost:5000',
  },
});

await app.listen();
```

## Service Implementation

```typescript
@Controller()
export class UsersGrpcController {
  @GrpcMethod('UsersService', 'FindOne')
  findOne(data: UserById): User {
    return this.usersService.findById(data.id);
  }

  @GrpcMethod('UsersService', 'Create')
  create(data: CreateUserRequest): User {
    return this.usersService.create(data);
  }

  @GrpcStreamMethod('UsersService', 'FindAll')
  async *findAll(): AsyncGenerator<User> {
    const users = await this.usersService.findAll();
    for (const user of users) {
      yield user;
    }
  }
}
```

## Client Configuration

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'users',
          protoPath: join(__dirname, 'users.proto'),
          url: 'localhost:5000',
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Using gRPC Client

```typescript
@Injectable()
export class ApiGateway implements OnModuleInit {
  private usersService: UsersService;

  constructor(@Inject('USERS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService = this.client.getService<UsersService>('UsersService');
  }

  async getUser(id: number) {
    return this.usersService.findOne({ id });
  }
}
```
