# @galaxy-stack/orbit-devtools

Developer dashboard and enhanced error formatting.

## Installation

```bash
bun add @galaxy-stack/orbit-devtools
```

## Devtools Dashboard

Web-based dashboard to visualize routes, DI graph, and real-time metrics.

### Setup

```typescript
import { createDevtools, DevtoolsDashboard } from '@galaxy-stack/orbit-devtools';

const devtools = createDevtools({
  title: 'My App Devtools',
  port: 9229,
  path: '/__devtools',
  theme: 'auto', // 'light' | 'dark' | 'auto'
  refreshInterval: 1000,
});

// Set application data
devtools.setRoutes([
  { method: 'GET', path: '/users', controller: 'UserController', handler: 'findAll' },
  { method: 'POST', path: '/users', controller: 'UserController', handler: 'create' },
]);

devtools.setProviders([
  { name: 'UserService', scope: 'singleton', dependencies: ['UserRepository'], module: 'UserModule' },
  { name: 'UserRepository', scope: 'singleton', dependencies: [], module: 'UserModule' },
]);

devtools.setModules([
  { name: 'UserModule', controllers: ['UserController'], providers: ['UserService'], imports: [], exports: ['UserService'] },
]);

// Push real-time metrics
setInterval(() => {
  devtools.pushMetrics({
    requestsPerSecond: Math.random() * 100,
    avgLatency: Math.random() * 50,
    errorRate: Math.random() * 0.05,
    activeConnections: Math.floor(Math.random() * 100),
    memoryUsage: process.memoryUsage().heapUsed,
    cpuUsage: Math.random() * 100,
  });
}, 1000);

// Mount handler
app.get('/__devtools', devtools.createHandler());
app.get('/__devtools/api/data', devtools.createHandler());
```

### Dashboard Features

- **Overview**: Quick stats (routes, providers, modules, RPS, latency, errors)
- **Routes**: Table with method, path, handler, guards, pipes
- **DI Graph**: Visual representation with scope indicators
- **Modules**: Controllers, providers, imports, exports for each module
- **Metrics**: Real-time charts and history table

## Better Error Messages

Enhanced error formatting with source context and solution hints.

### Format Errors

```typescript
import { formatError, prettyPrintError } from '@galaxy-stack/orbit-devtools';

try {
  throw new Error('Something went wrong');
} catch (error) {
  // Get formatted error object
  const formatted = await formatError(error, {
    showStack: true,
    showSource: true,
    showHelp: true,
    colors: true,
    maxStackFrames: 10,
  });

  console.log(formatted.name);    // 'Error'
  console.log(formatted.message); // 'Something went wrong'
  console.log(formatted.stack);   // Parsed stack frames
  console.log(formatted.source);  // Source code context
  console.log(formatted.help);    // Solution hints
}
```

### Pretty Print

```typescript
import { prettyPrintError } from '@galaxy-stack/orbit-devtools';

try {
  await riskyOperation();
} catch (error) {
  await prettyPrintError(error);
}
```

Output:

```
Error: Cannot find module 'missing-module'

  /src/app.ts

   12 | import { something } from 'other-module';
 > 13 | import { thing } from 'missing-module';
   14 | 
   15 | export class AppService {

Stack trace:
    at loadModule (/src/loader.ts:45:12)
    at bootstrap (/src/main.ts:10:5)

Possible solutions:
  • Check if the module is installed: bun install missing-module
  • Verify the import path is correct
  • Check if the file exists at the specified path
```

### Error Middleware

```typescript
import { createErrorMiddleware } from '@galaxy-stack/orbit-devtools';

app.use(createErrorMiddleware({
  showStack: process.env.NODE_ENV !== 'production',
  showSource: true,
  showHelp: true,
}));
```

### Custom Error Classes

```typescript
import {
  BetterError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from '@galaxy-stack/orbit-devtools';

// Generic error with code and context
throw new BetterError('Operation failed', 'OP_FAILED', {
  operation: 'create',
  resource: 'user',
});

// Validation error with field details
throw new ValidationError('Validation failed', {
  email: ['Invalid email format'],
  password: ['Must be at least 8 characters'],
});

// Not found error
throw new NotFoundError('User', '123');
// Message: "User with id 123 not found"

// Auth errors
throw new UnauthorizedError('Token expired');
throw new ForbiddenError('Insufficient permissions');

// Conflict error
throw new ConflictError('Email already exists', 'user');
```

## Exports

```typescript
export {
  // Dashboard
  DevtoolsDashboard,
  createDevtools,
  DashboardConfig,
  RouteInfo,
  ProviderInfo,
  ModuleInfo,
  MetricsSnapshot,

  // Errors
  formatError,
  formatErrorToString,
  prettyPrintError,
  createErrorMiddleware,
  FormattedError,
  StackFrame,
  SourceContext,

  // Custom Errors
  BetterError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
};
```
