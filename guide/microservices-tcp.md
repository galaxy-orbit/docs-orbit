# TCP Transport

Native TCP transport for microservices communication.

## Server Setup

```typescript
import { BunFactory } from '@galaxy-stack/orbit-core';
import { MicroserviceOptions, Transport } from '@galaxy-stack/orbit-microservices';

const app = await BunFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.TCP,
  options: {
    host: '0.0.0.0',
    port: 3001,
  },
});

await app.listen();
```

## Message Handlers

```typescript
import { Controller } from '@galaxy-stack/orbit-common';
import { MessagePattern, EventPattern, Payload } from '@galaxy-stack/orbit-microservices';

@Controller()
export class UsersHandler {
  @MessagePattern('users.findOne')
  async findUser(@Payload() data: { id: number }) {
    return this.usersService.findById(data.id);
  }

  @EventPattern('users.created')
  async handleUserCreated(@Payload() user: User) {
    await this.emailService.sendWelcome(user.email);
  }
}
```

## Client Setup

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { ClientsModule, Transport } from '@galaxy-stack/orbit-microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
})
export class AppModule {}
```

## Sending Messages

```typescript
import { Inject } from '@galaxy-stack/orbit-common';
import { ClientProxy } from '@galaxy-stack/orbit-microservices';

@Injectable()
export class OrdersService {
  constructor(@Inject('USERS_SERVICE') private client: ClientProxy) {}

  async getUser(id: number) {
    return this.client.send('users.findOne', { id }).toPromise();
  }

  async notifyUserCreated(user: User) {
    this.client.emit('users.created', user);
  }
}
```
