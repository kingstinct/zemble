# Architecture

Zemble is a monorepo containing multiple apps and packages. Apps live under
`apps/*` and reusable packages under `packages/*`. The repository relies on
[Bun](https://bun.sh) as its package manager and script runner.

At runtime an application is created by calling `createApp` from
`@zemble/core`. The function collects all configured plugins, resolves their
dependencies and constructs a Hono web server instance:

```ts
const app = await createApp({
  plugins: [/* plugin instances */],
});
```

Plugins can provide middleware which is invoked during initialisation. The logic
for merging duplicate plugins and setting up provider strategies can be seen in
`createApp`:

```ts
pluginsBeforeResolvingDeps.flatMap((plugin) => [
  ...plugin.dependencies,
  plugin,
])
```

The server can be started with either the Bun or Node runtime using the
`@zemble/bun` or `@zemble/node` packages. Both call `createApp`, execute any
`runBeforeServe` hooks and expose the Hono app via the respective HTTP server.

GraphQL functionality is supplied by the `@zemble/graphql` plugin which uses
[GraphQL Yoga](https://the-guild.dev/graphql/yoga) and optional Redis based
pub/sub. REST endpoints are assembled by the `@zemble/routes` plugin through
file based routing.

Providers such as logging or key–value stores support multiple implementations.
Provider strategies (`last`, `all`, `failover`, `round-robin`) determine how to
use multiple providers. Plugins expose their own configuration and can register
providers for the rest of the system.

Because the core is runtime agnostic and plugins only depend on standard
interfaces, apps scale horizontally by deploying the assembled server wherever
Bun or Node runs. Provider strategies allow distributing load or providing
failover across multiple implementations.
