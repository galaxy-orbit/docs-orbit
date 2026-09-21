# Microservices

Orbit hỗ trợ 6 giao thức microservice, tất cả được triển khai tự nhiên mà không cần phụ thuộc bên ngoài.

## Tổng quan về giao thức

| Giao thức | Gói | Giao thức |
|-----------|---------|----------|
| TCP | `@galaxy-stack/orbit-microservices-tcp` | Độ dài tiền tố nhị phân |
| Redis | `@galaxy-stack/orbit-microservices-redis` | RESP + Pub/Sub |
| NATS | `@galaxy-stack/orbit-microservices-nats` | Giao thức văn bản |
| RabbitMQ | `@galaxy-stack/orbit-microservices-rmq` | AMQP 0-9-1 |
| Kafka | `@galaxy-stack/orbit-microservices-kafka` | Giao thức nhị phân |
| gRPC | `@galaxy-stack/orbit-microservices-grpc` | HTTP/2 + Protobuf |

## Tạo một Microservice

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
  console.log('Microservice đang chạy trên cổng 4000');
}
```

## Mẫu tin nhắn

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
import { Controller, EventPattern, Payload } from '@galaxy-stack/orbit-microservices';

@Controller()
export class NotificationController {
  @EventPattern('user.created')
  handleUserCreated(@Payload() data: { userId: string }) {
    console.log('Người dùng đã tạo:', data.userId);
    // Không có phản hồi trả về cho sự kiện
  }

  @EventPattern('order.*')
  handleOrderEvents(@Payload() data: any, @Ctx() context: any) {
    console.log('Sự kiện đơn hàng:', context.pattern, data);
  }
}
```

## Proxy khách hàng

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

### Đăng ký khách hàng

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

## Ứng dụng lai

Chạy HTTP và microservice cùng lúc:

```typescript
const app = await BunFactory.create(AppModule);

app.connectMicroservice({
  transport: new TcpTransport({ port: 4000 }),
});

await app.startAllMicroservices();
await app.listen(3000);
```

## Tính năng đặc biệt theo giao thức

### Redis Pub/Sub

```typescript
import { RedisTransport } from '@galaxy-stack/orbit-microservices-redis';

const transport = new RedisTransport({
  host: 'localhost',
  port: 6379,
  // Sử dụng giao thức RESP tự nhiên
});
```

### Nhóm hàng đợi NATS

```typescript
import { NatsTransport } from '@galaxy-stack/orbit-microservices-nats';

const transport = new NatsTransport({
  servers: ['nats://localhost:4222'],
  queue: 'my-queue-group',
});
```

### Nhóm người tiêu dùng Kafka

```typescript
import { KafkaTransport } from '@galaxy-stack/orbit-microservices-kafka';

const transport = new KafkaTransport({
  brokers: ['localhost:9092'],
  groupId: 'my-consumer-group',
  clientId: 'my-client',
});
```

### RabbitMQ với xác nhận

```typescript
import { RmqTransport } from '@galaxy-stack/orbit-microservices-rmq';

const transport = new RmqTransport({
  urls: ['amqp://localhost:5672'],
  queue: 'my-queue',
  noAck: false, // Xác nhận thủ công
});
```