# Dependency Injection

Orbit's Dependency Injection (DI) system manages the creation and lifecycle of your application's components.

## How It Works

When you use the `@Injectable()` decorator, Orbit registers the class with the DI container. Constructor parameters are automatically resolved:

```typescript
@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private loggerService: LoggerService
  ) {}
}
```

The container:
1. Reads constructor parameter types via reflection
2. Resolves each dependency recursively
3. Creates and caches instances based on scope
4. Injects resolved dependencies

## Container Resolution Flow

```
container.resolve(UserController)
        │
        ▼
┌─────────────────────┐
│ Get constructor     │
│ parameters          │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐    ┌─────────────────────┐
│ Resolve each        │───▶│ Resolve nested      │ (recursive)
│ dependency          │    │ dependencies        │
└─────────┬───────────┘    └─────────┬───────────┘
          │                          │
          ▼                          ▼
┌──────────────────────────────────────────────────┐
│        Create instance with resolved deps        │
│                                                  │
│  new UserController(userService, authService)    │
└──────────────────────────────────────────────────┘
```

## Registration Methods

### Using @Injectable()

```typescript
@Injectable()
export class UserService {}

@Module({
  providers: [UserService],
})
export class UserModule {}
```

### Using Provider Objects

```typescript
@Module({
  providers: [
    { provide: UserService, useClass: UserService },
    { provide: 'API_KEY', useValue: 'secret-key' },
    { 
      provide: 'CONNECTION', 
      useFactory: (config: ConfigService) => createConnection(config),
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
```

## Injection Tokens

### Class Tokens

```typescript
@Injectable()
export class UserService {}

// Inject by class reference
constructor(private userService: UserService) {}
```

### String Tokens

```typescript
{ provide: 'DATABASE_URL', useValue: 'postgres://...' }

// Inject with @Inject
constructor(@Inject('DATABASE_URL') private dbUrl: string) {}
```

### Symbol Tokens

```typescript
const DATABASE = Symbol('DATABASE');

{ provide: DATABASE, useFactory: createDb }

constructor(@Inject(DATABASE) private db: Database) {}
```

## Scopes

### Singleton (Default)

```typescript
@Injectable() // or @Injectable({ scope: Scope.DEFAULT })
export class ConfigService {}
```

- Created once when first requested
- Same instance shared everywhere
- Lives for application lifetime

### Request

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestLogger {}
```

- New instance per HTTP request
- Access request context
- Garbage collected after request

### Transient

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class TemporaryService {}
```

- New instance every injection
- Never shared
- Useful for stateful services

## Scope Bubbling

When a singleton depends on a request-scoped provider, the singleton becomes request-scoped:

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestContext {}

@Injectable() // Will be request-scoped due to dependency
export class UserService {
  constructor(private ctx: RequestContext) {}
}
```

## Async Providers

```typescript
{
  provide: 'DATABASE',
  useFactory: async () => {
    const connection = await createConnection();
    await connection.runMigrations();
    return connection;
  },
}
```

## Module Boundaries

Providers are private by default. Use `exports` to share:

```typescript
@Module({
  providers: [UserService],
  exports: [UserService], // Now available to importing modules
})
export class UserModule {}
```
