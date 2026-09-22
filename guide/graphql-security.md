# GraphQL Security

The GraphQL module ships with built-in query protection. All rules run during query validation, before any resolver executes, so malicious queries are rejected with a `400` response and never touch your data layer.

## Configuration

```ts
import { GraphQLModule } from '@galaxy-stack/orbit-graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      introspection: false,        // disables __schema/__type in production
      security: {
        maxDepth: 10,              // max selection depth
        maxComplexity: 1000,       // max cumulative complexity
        maxAliases: 30,            // max aliases per query
        fieldCosts: { posts: 5 },  // custom cost per field
        listFactors: { posts: 10 } // list fan-out multiplier
      },
    }),
  ],
})
export class AppModule {}
```

## Protection rules

| Rule | Default | Protects against |
|------|---------|------------------|
| Depth limit | 10 | Deeply-nested queries that exhaust the resolver stack |
| Complexity limit | 1000 | Expensive queries; list fields multiply child cost by their fan-out factor |
| Alias limit | 30 | Alias-bombing (same field aliased hundreds of times) |
| Introspection block | off unless `introspection: false` | Schema disclosure in production |

## Depth limit

Counts every selected field level (fragments included). `__typename` is free. When the query exceeds `maxDepth`, validation fails:

```graphql
# With maxDepth: 3 this is rejected (5 levels)
{ post { author { posts { author { posts { title } } } } } }
```

## Complexity analysis

Each field costs 1 by default. Selections inside a list field are multiplied by the list factor (default 10) to model N+1 fan-out. Assign higher costs to expensive root fields:

```ts
security: {
  maxComplexity: 500,
  fieldCosts: { search: 20 },
  listFactors: { posts: 15 },
}
```

## Disabling introspection in production

```ts
GraphQLModule.forRoot({
  introspection: process.env.NODE_ENV !== 'production',
});
```

With `introspection: false`, any query touching `__schema` or `__type` returns:

```json
{ "errors": [{ "message": "GraphQL introspection is disabled." }] }
```

Playground is served on `GET /graphql` only when `playground: true` — keep it off in production as well.
