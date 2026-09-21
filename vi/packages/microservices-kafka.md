# @galaxy-stack/orbit-microservices-kafka

Giao thức Kafka với nhóm người tiêu dùng và phân công phân vùng.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-microservices @galaxy-stack/orbit-microservices-kafka
```

## Tính năng

- Giao thức Kafka nhị phân hoàn chỉnh
- Giao thức nhóm người tiêu dùng (JoinGroup/SyncGroup/Heartbeat)
- Phân công phân vùng theo phạm vi
- Thao tác Fetch và Produce
- Quản lý offset với tự động commit
- Kết nối đa broker

## Máy chủ

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice(AppModule, {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'],
      clientId: 'my-consumer',
    },
    consumer: {
      groupId: 'my-group',
    },
  },
});

await app.listen();
```

## Khách hàng

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
            clientId: 'my-producer',
          },
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Tạo tin nhắn

```typescript
@Injectable()
export class EventsService {
  constructor(@Inject('KAFKA_SERVICE') private client: ClientKafka) {}

  async emit(topic: string, message: any) {
    this.client.emit(topic, {
      key: message.id,
      value: JSON.stringify(message),
    });
  }
}
```

## Tùy chọn

| Tùy chọn | Loại | Mô tả |
|--------|------|-------------|
| `client.brokers` | string[] | Broker Kafka |
| `client.clientId` | string | Định danh khách hàng |
| `consumer.groupId` | string | Nhóm người tiêu dùng |
| `consumer.sessionTimeout` | number | Thời gian chờ phiên (ms) |
| `producer.allowAutoTopicCreation` | boolean | Tạo chủ đề |
