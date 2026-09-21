# Module Interfaces

Interfaces for module configuration and dynamic modules.

## ModuleMetadata

```typescript
interface ModuleMetadata {
  imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule>>;
  controllers?: Type<any>[];
  providers?: Provider[];
  exports?: Array<string | symbol | Type<any> | Provider>;
}
```

## DynamicModule

```typescript
interface DynamicModule extends ModuleMetadata {
  module: Type<any>;
  global?: boolean;
}
```

## Example Dynamic Module

```typescript
import { Module, DynamicModule } from '@galaxy-stack/orbit-common';

@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseOptions): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
        {
          provide: DatabaseService,
          useFactory: (opts) => new DatabaseService(opts),
          inject: ['DATABASE_OPTIONS'],
        },
      ],
      exports: [DatabaseService],
    };
  }

  static forFeature(entities: Type<any>[]): DynamicModule {
    const providers = entities.map(entity => ({
      provide: getRepositoryToken(entity),
      useFactory: (db: DatabaseService) => db.getRepository(entity),
      inject: [DatabaseService],
    }));

    return {
      module: DatabaseModule,
      providers,
      exports: providers,
    };
  }
}
```

## Provider Types

```typescript
interface ClassProvider<T = any> {
  provide: string | symbol | Type<T>;
  useClass: Type<T>;
  scope?: Scope;
}

interface ValueProvider<T = any> {
  provide: string | symbol | Type<T>;
  useValue: T;
}

interface FactoryProvider<T = any> {
  provide: string | symbol | Type<T>;
  useFactory: (...args: any[]) => T | Promise<T>;
  inject?: Array<string | symbol | Type<any>>;
  scope?: Scope;
}

interface ExistingProvider<T = any> {
  provide: string | symbol | Type<T>;
  useExisting: string | symbol | Type<T>;
}
```

## NestModule Interface

```typescript
interface NestModule {
  configure(consumer: MiddlewareConsumer): void;
}

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
```
