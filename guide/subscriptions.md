# GraphQL Subscriptions

Real-time updates via WebSocket subscriptions in Orbit GraphQL.

## Setup

```typescript
import { Module } from '@galaxy-stack/orbit-common';
import { GraphQLModule } from '@galaxy-stack/orbit-graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      subscriptions: {
        'graphql-ws': true,
      },
    }),
  ],
})
export class AppModule {}
```

## Basic Subscription

```typescript
import { Resolver, Subscription } from '@galaxy-stack/orbit-graphql';
import { PubSub } from '@galaxy-stack/orbit-graphql';

const pubSub = new PubSub();

@Resolver()
export class NotificationsResolver {
  @Subscription('messageAdded', {
    resolve: (payload) => payload.messageAdded,
  })
  messageAdded() {
    return pubSub.asyncIterator('MESSAGE_ADDED');
  }
}
```

## Publishing Events

```typescript
@Injectable()
export class MessagesService {
  async createMessage(data: CreateMessageDto) {
    const message = await this.messagesRepo.create(data);
    
    pubSub.publish('MESSAGE_ADDED', { messageAdded: message });
    
    return message;
  }
}
```

## Filtered Subscriptions

```typescript
@Subscription('messageAdded', {
  filter: (payload, variables) => {
    return payload.messageAdded.channelId === variables.channelId;
  },
})
messageAdded(@Args('channelId') channelId: string) {
  return pubSub.asyncIterator('MESSAGE_ADDED');
}
```

## With Authentication

```typescript
@Subscription('privateMessage', {
  filter: (payload, variables, context) => {
    return payload.recipientId === context.user.id;
  },
})
@UseGuards(WsAuthGuard)
privateMessage(@Context() ctx: GraphQLContext) {
  return pubSub.asyncIterator('PRIVATE_MESSAGE');
}
```

## Client Connection

```typescript
import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'ws://localhost:3000/graphql',
});

client.subscribe(
  {
    query: `subscription { messageAdded { id content } }`,
  },
  {
    next: (data) => console.log(data),
    error: (err) => console.error(err),
    complete: () => console.log('done'),
  },
);
```
