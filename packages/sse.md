# @galaxy-stack/orbit-sse

Server-Sent Events — `sseResponse` for streaming async generators, `SseHub` broadcaster, `@Sse` decorator.

```bash
bun add @galaxy-stack/orbit-sse
```

## Usage

```ts
import { sseResponse, SseHub, type SseMessage } from '@galaxy-stack/orbit-sse';

async function* events(): AsyncGenerator<SseMessage> {
  yield { event: 'tick', data: { t: Date.now() } };
}
const response = sseResponse(events()); // text/event-stream Response

// Broadcast via a hub
const hub = new SseHub();
const res = hub.stream();
hub.broadcast({ event: 'msg', data: { hello: 'world' } });
```
