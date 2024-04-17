# @zemble plugin system
[![Test Status](https://github.com/kingstinct/zemble/actions/workflows/test.yml/badge.svg)](https://github.com/kingstinct/zemble/actions/workflows/test.yml)
[![Downloads on NPM](https://img.shields.io/npm/dt/@zemble/core)](https://www.npmjs.com/package/@zemble/core)
[![Discord](https://dcbadge.vercel.app/api/server/eSHBxENbPF?style=flat)](https://discord.gg/eSHBxENbPF)

A plugin system to build composable systems.

# Getting started

## tldr

The quickest way to give it a spin is to use the create CLI.

Use create-zemble-app to bootstrap an app (choose between `bare` and `graphql` templates):
```bash
bun create zemble-app <name-of-app> [template]
```

There is also create-zemble-plugin to similarly bootstrap a plugin (here you can choose between `bare`, `graphql` and `middleware` templates):
```bash
bun create zemble-plugin <name-of-plugin> [template]
```

Both comes with all you need to start building the next build thing, including tests! :)

## Step-by-step

Here we go through all the basics of @zemble:
- [Take it for a spin](#take-it-for-a-spin)
- [Using routes](#using-routes)
- [Using GraphQL](#using-graphql)
- [Ok, so what about composability?](#ok-so-what-about-composability)
- [What about testing?](#what-about-testing)
- [What about auth?](#what-about-auth)




### Take it for a spin
Let's start simple

1. If you haven't already, install [bun](https://bun.sh). It's fast and TypeScript-native. We'll support more runtimes moving forward.
```bash
curl -fsSL https://bun.sh/install | bash
```
2. Install some packages:
```bash
bun install @zemble/bun @zemble/graphql @zemble/routes
```
3. Add a file, call it `app.ts` for example:
```TypeScript
import serve from '@zemble/bun'

import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'

export default serve({
  plugins: [
    Routes,
    GraphQL,
  ],
})
```
4. Run it: 
```bash
bun --hot app.ts
```
6. You now have a server running on port `http://localhost:3000`. Try it out, you have a GraphQL playground with some stuff to try out - even subscriptions just work :)

### Using routes
1. Add a folder called `/routes` (configurable through `Routes.configure(/* your config here */)`).
2. In this folder add a `hello/world.ts` with something like this:
```TypeScript
export const get = (ctx: Zemble.RouteContext) => ctx.json({
  hello: 'world',
})
```
3. Now try navigating to [http://localhost:3000/hello/world](http://localhost:3000/hello/world)
4. Also add a file - maybe your app icon(?) - in the /routes folder and navigate to it :)

We use [hono](https://hono.dev/) as web server, it's fast and supports a wide range of runtimes. Check out their docs on more details. 

Picking up what you put in your `/routes` folder is custom to @zemble though, some patterns we support:
- my-route.get.ts <- will expose the default export when GETting /my-route
- my-route.ts <- will expose the default export for any HTTP verb, use named exports like get and post for specific verbs.

### Using GraphQL
We love GraphQL so a lot of focus has been on providing the best possible DX for it.

1. Create a folder called `/graphql`.
2. Add a `schema.graphql` with a simple query:
```GraphQL
type Query {
  hello: String!
}
```
3. Add `/graphql/Query/hello.ts`:
```TypeScript
const hello = () => 'world!'

export default hello
```
4. Try it out in the playground.

Some cool stuff you can try out is exposing your GraphQL as a REST API with [Sofa](https://the-guild.dev/graphql/sofa-api), full with Swagger at `/api/docs`: `GraphQL.configure({ sofa: { basePath: '/api' } })`

### Ok, so what about composability?
Until now we've built a monolith,. Now - let's talk effortless composability. Microservices are great - but it often adds complexity both in development and maintenance workflows. @zemble brings a plugin system that keeps your logic in separate easily composable parts. Let's try it out.

1. Add a `plugins/my-app-routes/plugin.ts` with something like this:
```TypeScript
import Plugin from '@zemble/core/Plugin'
import Routes from '@zemble/routes'

export default new Plugin(
  import.meta.dir,
  {
    name: 'files',
    version: '0.0.1',
    dependencies: [
      {
        plugin: Routes,
      },
    ],
  },
)
```
2. Move your routes folder to `/plugins/my-app-routes`
3. Update your `app.ts` and add the plugin we just created:
```TypeScript
import serve from '@zemble/bun'

import GraphQL from '@zemble/graphql'
import MyAppRoutes from './plugins/my-app-routes'

export default serve({
  plugins: [
    GraphQL,
    MyAppRoutes,
  ],
})
```
4. Try it out :)

To make it easy to reuse plugins it's recommended to publish them to NPM as separate packages. If you don't explicitely add name and version to the plugin it will automatically try to pick it up from a package.json in the same directory.

### What about testing?
Testing your GraphQL is super-easy. We recommend using graphql-codegen with client-preset

1. Install @graphql-codegen/cli: 
```bash
bun install @graphql-codegen/cli
```
3. Add `graphql-codegen` to your scripts section of your package.json:
```JSON
"scripts": {
  // other stuff
  "codegen": "graphql-codegen"
}
```
3. Add a `codegen.ts` to your app (you can easily extend it to suit your needs):
```TypeScript
import defaultConfig from '@zemble/graphql/codegen'

export default defaultConfig
```
4. Add a `hello.test.ts` to your app (we suggest putting it next to your resolver, but anything goes):
```TypeScript
import { it, expect } from 'bun:test'
import { createApp } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import MyAppRoutes from './plugins/my-app-routes'

import { graphql } from '../client.generated'

const HelloWorldQuery = graphql(`
  query Hello {
    hello
  }
`)

it('Should return world!', async () => {
  // the config here is identical to what you use when calling serve in your app.ts, so you probably want to break it out to it's file, maybe config.ts or something :)
  const app = await createApp({
    plugins: [Routes, MyAppRoutes]
  })

  const response = await app.gqlRequest(HelloWorldQuery, {})

  expect(response.data).toEqual({
    hello: 'world!',
  })
})

```

### What about auth?
Ok, let's take it one step further. You usually need to authenticate users in an app, both to provide an individualized experience as well as protect your users privacy. How can we make this composable? Let's try it out.

1. Install zemble-plugin-auth-anonymous:
```bash
bun install zemble-plugin-auth-anonymous
```
3. Add it to your app config:
```TypeScript
import serve from '@zemble/bun'

import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'
import AnonymousAuth from 'zemble-plugin-auth-anonymous'

export default serve({
  plugins: [
    Routes,
    GraphQL,
    AnonymousAuth
  ],
})
```
3. We need a public/private keypair, run `bunx zemble-generate-keys` to generate a .env file with a PUBLIC_KEY and PRIVATE_KEY:
```bash
bunx zemble-generate-keys
```
4. Run your app and try to call your hello query again :)

`zemble-plugin-auth-anonymous` depends on the `zemble-plugin-auth` which does the following:
- Protectes all GraphQL queries by default. You can opt-out or configure this with the auth directive, for example: `@auth(skip: true)`
- Allows an authentication token to be sent either as a header (by default a bearer token, `authorization: "Bearer {token}"`) or a cookie.
- It uses public/private key encryption which makes it possible to verify the authenticity of an authentication token without knowing the private key. It exposes a standard `/.well-known/jwks.json` REST endpoint as well as GraphQL queries for the public key, validating and parsing a token.

`zemble-plugin-auth-anonymous` in turn adds a simple `login` mutation to GraphQL, which returns an authentication token. Check out `zemble-plugin-auth-otp` for another approach, where it adds a flow for authenticating a user by sending a one-time-password to their email address.

### Ecosystem

We're also providing `zemble-plugin-bull` out of the box, which contains middleware to set up queue jobs. We hope we can build a thriving ecosystem around this together.

## Full examples

Check out [apps/minimal](apps/minimal) for a simple example with routes and graphql, and a few tests. For a simple plugin example check out [packages/apple-app-site-association](packages/apple-app-site-association) which simply adds a route. An app consists of a set of plugins which can be configured, and can also contain routes and/or graphql functionality of it's own.

## Design goals of @zemble
- DX-optimized plugin development
- Enabling reusing 80% when building a new app/system
- Loose coupling
- Infrastructure agnostic (default behaviour should be that plugins work on edge/node/wherever)

Everything is a plugin. Here are some of the core plugins:
| Package | Description  |
|----------|----------|
| @zemble/core | Core functionality, wiring up configuration between plugins and apps |
| @zemble/graphql | Magically wires up GraphQL from the /graphql folder of every plugin, and if you have it in your app |
| @zemble/routes | Magically wires up REST endpoints and files in your /routes folder |
| @zemble/auth | Magically handles JWT authentication, use @auth directive for public GraphQL queries (or granular permissions) |
| @zemble/auth-otp | Adds mutations to authorize through OTP with an email, works seamlessly with @zemble/auth |

Core functionality:
- REST Routes
- GraphQL
- Queues (would be nice, and very nice to be less bootstrapping for it)
- (Key-Value Store (would be nice, but maybe more of a plugin, not needed for every system))
- (Pub/Sub (would be nice, but maybe more of a plugin, not needed for every system))

## Plugins

Plugins are reusable pieces of functionality that can be added to a system. Plugins can depend on other plugins, and can be depended on by other plugins. Plugins should preferably contain one piece of functionality, and should be as loosely coupled as possible.

Every plugin is a singleton and can expose a configuration for an app (or other plugins depending on it) to customize it's functionality. Another pattern is for middleware to extend MiddlewareConfig with configuration so it's behaviour in dealing with all other plugins can be customized.

Some plugins act as middleware, which means they can traverse other plugins without any direct dependency on them. Examples of this is: 
- the core GraphQL plugin, which adds schema and resolvers from other plugins.
- the core Queue plugin, which adds queues from other plugins.

Every plugin exposes a config. The config is fully typed and can be configured in detail when composing the app. Environment variables (including .env-files) are also fully supported it is suggested that plugins listens to environment variables wherever possible, for example the core KV, Queue and PubSub plugins accepts the REDIS_URL environment variable to configure the Redis connection, while still allowing overriding this for every plugin individually.

An app can be just a set of plugins without any custom code. It can also contain custom code, any middleware will traverse this custom code in the same way as it traverses plugins.

Concepts:
- An app is a set of configured plugins with or without custom code.
- A plugin is a reusable piece of functionality that can be added to an app. It can provide middleware that traverses other plugins.
- Every plugin has a config that can be configured in detail when composing an app.

## Authorization
The JWT handling of [@zemble/auth](https://github.com/kingstinct/zemble/blob/main/packages/auth) plugin allows for flexible authorization stitched to every use case. Every plugin or app can specify directly in the GraphQL schema what is required to exist in the JWT token in a flexible manner, see [examples here](https://github.com/kingstinct/zemble/blob/main/packages/auth/graphql/schema.local.graphql) accompanied by [test cases here](https://github.com/kingstinct/zemble/blob/main/packages/auth/graphql/Query).

Each app is responsible for generating the structure of it's tokens, usually by looking up a user email/phone number/other identity (coming from an auth plugin like @zemble/auth-apple or @zemble/auth-otp) in their database and sending back whatever user data and authorization claims applies to that user.

For operations that requires a more granular scope than just being authenticated we recommend plugins and apps to adhere to the following JWT structure:
- In a `permissions` array, allow scoped permission that adheres to the plugin name, potentially with additional scope (examples `permissions: ['my-package-name:read']` or `permissions: ['my-package-name:write']`)
- In a `permissions` array, allow for an applicable general scope:
  - Admin (should be allowed for any operation): `admin:write`, `admin:read` or `admin` (unscoped = both read and write)
  - Operations (meant for maintenance/system/settings): `operations:write`, `operations:read` or `operations` (read/write)
  - Manage users: `manage-users:write`, `manage-users:read`, `manage-users:add`, `manage-users:delete` or `manage-users`
  - API Tokens: `api-tokens:write`, `api-tokens:read`, `api-tokens:issue`, `api-tokens:delete` or `api-tokens`
  - Editor: `editor:write`, `editor:read`, `editor:add`, `editor:delete` or `editor`

Often a use case requires more fine-grained authorization (for example on group or organisation level). We recommend this to be handled in one of two ways:
- By adding custom permissions for your custom resolvers, like `manage-users:my-organisation`. As you [see in these test cases](https://github.com/kingstinct/zemble/blob/main/packages/auth/graphql/Query/advancedWithOr.test.ts) we ids are supported.
- By checking this inside your resolvers. For example if a user has a `manage-users:read` permission by only returning users in their organisations(s).

If you provide a way to change the permissions of a user (like a user management system) you should take appropriate measures to invalidate tokens. The naive out-of-the-box solution will allow the user access until the bearer token expires. To mitigate this one or more of the following approaches can be taken:
- Use short-lived bearer tokens (easily configurable). You might want to use refresh tokens for this to not impact the user experience, this requires implementing the `reissueBearerToken` function configuration in the @zemble/auth configuration, and appropriately call the `refreshBearerToken` mutation on the client.
- Implement the `checkIfBearerTokenIsValid` function in the @zemble/auth configuration. An example of this would be setting a invalidateAllTokensBeforeTimestamp in your database/key value store when needed (on a permission change for example), and verifying the token was issued after this timestamp in `checkIfBearerTokenIsValid`.

## Kladd :)

- queues (och kanske även graphql) borde nog vara egna plugins baserat på någon typ av “setup”-funktion. Strukturen är bra men vore nice med möjlighet att switcha implementationer

- Autentisering och middleware för graphql? (key)

- TypeScript-baserat config för alla installerade plugins (och kanske avstå från env-variabel magi). Kanske mer explicit hämtning av plugins här? Minskar "black-box" samtidigt som det nog är lättare att få typerna 100%.

- Codegen och typsäkerhet (det löser vi, bättre att ta när strukturen sitter)

- Eslint o testning (det löser vi, bättre att ta när strukturen sitter)

- Orkestrering av contexts (t ex flera URQL-instanser) på klienten?

- Considering moving entities to JSON entirely. Means we can check it into source control as well as don't have a database dependency there.


- Cover edge cases for required fields (maybe remove some flexibility). 

- PoC of third-party field

- displayName for entity entries

- Publish to npm



Plugins vs middleware? Middlewares (graphql och queues) som wirear upp mkt logik borde eventuellt vara mer effortless att sätta upp?




Plugin types:
- "Regular" packages. Importable from npm. Code can be called on as usual.
- Middleware. Has access to all plugins, can modify how they work, can modify global config.
- Plugins. Uses the structure set up by the middleware.



KeyValue ska nog vara plugin som supportar x antal providers med samma interface utåt:
InMemory
Redis
Cloudflare
MongoDB ?


Plugin philosophy:
Försöka köra ett plugin per implementation (alltså en KV som har separata dependencies på redis etc). Utmaningen är att streamlinea interface? Så att vi så enkelt som möjligt för både plugin-utvecklare och plugin-användare kan återanvända samma interface oavsett implementation. Kanske erbjuda ett antal standard-interface i core (för KV, pubsub etc)?


CMS-plugin:
Gör så att det är lätt att extenda åt "båda hållen". Har vi en entitet (Recipe) så vore det coolt att kunna hantera det dynamiskt på CMS-nivå - men lägga till resolvers som extendar funktionaliteten.
