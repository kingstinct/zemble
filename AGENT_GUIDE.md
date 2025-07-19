# Agent Guide

This repository is a Bun based monorepo. Always run `bun install` in the root
before executing scripts. Lint and typecheck every change:

```bash
bunx biome check --fix path/to/file
bun run typecheck
```

## Entry Points

- **Server startup**: `@zemble/bun` and `@zemble/node` provide a `serve` function
  which creates an app with `createApp` and starts the HTTP server.
- **Plugin definition**: each package usually exposes a `plugin.ts` exporting a
  `Plugin` instance.
- **App composition**: apps configure their plugins and call `serve`.

## Tracing Data and Side Effects

- `packages/core/createApp.ts` resolves plugin dependencies and initialises
  middleware. Provider instances are attached here.
- Each plugin may register providers via `setupProvider` in its middleware.
- GraphQL requests are handled by the `@zemble/graphql` plugin using GraphQL
  Yoga. REST routes are collected by `@zemble/routes` from each plugin's
  `routes/` folder.

## Common Pitfalls

- Forgetting to run `bun install` or skipping lint/typecheck before committing.
- Plugins executed outside their directory may not pick up local configuration.
- When multiple implementations of a provider exist, ensure the
  `providerStrategies` are set correctly.

## Best Practices

1. Keep plugins small and focused; avoid tight coupling.
2. Use environment variables for configurable values and provide sensible
   defaults in plugin configs.
3. After modifying GraphQL schema or resolvers run `bun run codegen` to update
types.
4. Add tests near the functionality they cover and run `bun run test`.

If something is unclear check the plugin’s `plugin.ts` or the core
implementation in `packages/core`.
