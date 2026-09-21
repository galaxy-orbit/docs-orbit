# @galaxy-stack/orbit-microservices

Gói cơ sở cho giao tiếp microservice.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-microservices

# Chọn transport(s)
bun add @galaxy-stack/orbit-microservices-tcp
bun add @galaxy-stack/orbit-microservices-redis
bun add @galaxy-stack/orbit-microservices-nats
bun add @galaxy-stack/orbit-microservices-rmq
bun add @galaxy-stack/orbit-microservices-kafka
bun add @galaxy-stack/orbit-microservices-grpc
```

## Transport có sẵn

| Gói | Transport | Giao thức |
|-----|-----------|-----------|
| `@galaxy-stack/orbit-microservices-tcp` | TCP | Nhị phân có tiền tố độ dài |
| `@galaxy-stack/orbit-microservices-redis` | Redis | RESP + Pub/Sub |
| `@galaxy-stack/orbit-microservices-nats` | NATS | Giao thức văn bản |
| `@galaxy-stack/orbit-microservices-rmq` | RabbitMQ | AMQP 0-9-1 |
| `@galaxy-stack/orbit-microservices-kafka` | Kafka | Giao thức nhị phân |
| `@galaxy-stack/orbit-microservices-grpc` | gRPC | HTTP/2 + Protobuf |

## Tạo Microservice

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { TcpTransport } from '@galaxy-stack/orbit-microservices-tcp';

async function bootstrap() {
  const app = await BunFactory.createMicroservice(AppModule, {
    transport: new TcpTransport({
      host: '0.0.0.0',
      port: 4000,
    }),
  });

  await app.listen();
}
```

## Bộ xử lý tin nhắn

### Yêu cầu-Phản hồi

```typescript
import { Controller, MessagePattern, Payload } from '@galaxy-stack/orbit-microservices';

@Controller()
export class MathController {
  @MessagePattern('sum')
  sum(@Payload() data: { a: number; b: number }) {
    return data.a + data.b;
  }

  @MessagePattern({ cmd: 'multiply' })
  multiply(@Payload() data: { a: number; b: number }) {
    return data.a * data.b;
  }
}
```

### Dựa trên sự kiện

```typescript
import { EventPattern } from '@galaxy-stack/orbit-microservices';

@Controller()
export class NotificationController {
  @EventPattern('user.created')
  handleUserCreated(@Payload() data: { userId: string }) {
    console.log('Người dùng đã tạo:', data.userId);
    // Không có giá trị trả về cho sự kiện
  }

  @EventPattern('order.*')
  handleOrderEvents(@Payload() data: any, @Ctx() context: any) {
    console.log('Sự kiện đơn hàng:', context.pattern);
  }
}
```

## Client Proxy

### Đăng ký

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { ClientsModule, Transport } from '@galaxy-stack/orbit-microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4000,
        },
      },
    ]),
  ],
})
export class AppModule {}
```

### Gửi tin nhắn

```typescript
import { Injectable, Inject } from '@galaxy-stack/orbit-core';
import { ClientProxy } from '@galaxy-stack/orbit-microservices';

@Injectable()
export class MathService {
  constructor(
    @Inject('MATH_SERVICE') private client: ClientProxy,
  ) {}

  async sum(a: number, b: number): Promise<number> {
    return this.client.send('sum', { a, b });
  }

  emitEvent(data: any): void {
    this.client.emit('user.created', data);
  }
}
```

## Ứng dụng Hybrid

```typescript
const app = await BunFactory.create(AppModule);

app.connectMicroservice({
  transport: new TcpTransport({ port: 4000 }),
});

app.connectMicroservice({
  transport: new RedisTransport({ host: 'localhost', port: 6379 }),
});

await app.startAllMicroservices();
await app.listen(3000);
```

## Decorator Context

```typescript
import { Ctx, MessageContext } from '@galaxy-stack/orbit-microservices';

@MessagePattern('process')
async process(@Payload() data: any, @Ctx() ctx: MessageContext) {
  console.log('Pattern:', ctx.getPattern());
  console.log('Transport:', ctx.getTransport());
  return { processed: true };
}
```

## Tuần tự hóa

```typescript
import { ClientsModule, JsonSerializer } from '@galaxy-stack/orbit-microservices';

ClientsModule.register([
  {
    name: 'SERVICE',
    transport: Transport.TCP,
    options: {
      serializer: new JsonSerializer(),
    },
  },
])
```

## Xuất khẩu

```typescript
export {
  ClientsModule,
  ClientProxy,
  MessagePattern,
  EventPattern,
  Payload,
  Ctx,
  Transport,
  MessageContext,
};
```