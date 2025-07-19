# Design

The project revolves around a strongly typed plugin system defined in
`@zemble/core`. Every plugin is represented by the `Plugin` class which stores
its own configuration, dependencies and optional middleware. Plugins are
singletons and can detect if they are executed from their own directory to apply
additional local configuration.

```ts
class Plugin<TConfig> {
  constructor(dirname: string, opts?: PluginOpts<TConfig>) { /* ... */ }
  configure(config?: Partial<TConfig>): this { /* merge config */ }
  async initializeMiddleware(/* ... */) { /* register providers and hooks */ }
}
```

Plugins commonly expose REST endpoints through a `routes` folder and GraphQL
schemas/resolvers through a `graphql` folder. Middleware allows a plugin to
traverse other plugins without a direct dependency.

Provider registration uses `setupProvider` to attach concrete implementations of
services such as logging, email or key–value storage. Multiple providers can be
active simultaneously and `providerStrategies` decide how they are invoked.

### Conventions

- **Folder layout**: apps under `apps/*`, packages under `packages/*`.
- **Entry files**: plugin packages typically export a `plugin.ts` which creates a
  `Plugin` instance.
- **GraphQL**: place schema files in `graphql/schema.graphql` and resolvers under
  `graphql/Type/field.ts`.
- **Routes**: HTTP handlers reside in `routes/` using file-based routing.
- **Scripts**: linting via Biome (`bunx biome check --fix`), typechecking with
  `bun run typecheck`, tests with `bun run test`.

The design favours composition over inheritance. Features are implemented in
small focused plugins that can be combined to create complex systems while
remaining loosely coupled.
