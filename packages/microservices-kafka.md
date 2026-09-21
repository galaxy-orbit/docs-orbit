# @galaxy-stack/orbit-microservices-kafka

Kafka transport with consumer groups and partition assignment.

## Installation

```bash
bun add @galaxy-stack/orbit-microservices @galaxy-stack/orbit-microservices-kafka
```

## Features

- Complete Kafka binary protocol
- Consumer group protocol (JoinGroup/SyncGroup/Heartbeat)
- Range partition assignment
- Fetch and Produce operations
- Offset management with auto-commit
- Multi-broker connections

## Server

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

## Client

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

## Producing Messages

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

## Options

| Option | Type | Description |
|--------|------|-------------|
| `client.brokers` | string[] | Kafka brokers |
| `client.clientId` | string | Client identifier |
| `consumer.groupId` | string | Consumer group |
| `consumer.sessionTimeout` | number | Session timeout (ms) |
| `producer.allowAutoTopicCreation` | boolean | Create topics |
