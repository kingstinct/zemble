# @zemble plugin system

A plugin system to build composable systems. Goal is to do what plugins do for Wordpress, but for the Node ecosystem.

Check out [apps/minimal](apps/minimal) for a simple example with routes and graphql, and a few tests. For a simple plugin example check out [packages/apple-app-site-association](packages/apple-app-site-association) which simply adds a route. An app consists of a set of plugins which can be configured, and can also contain routes and/or graphql functionality of it's own.

Design goals:
- DX-optimized plugin development
- Reuse 80% when building a new app/system
- Loose coupling
- Infrastructure agnostic (default behaviour should be that plugins work on edge/node/wherever)

Everything is a plugin. Here are some of the core plugins:
| Package | Description  |
|----------|----------|----------|
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


Environment variables (probably better with a granular config here):
Using dotenv by default. Let's consider providing overrides that are prefixed, to allow for flexbility, i.e.:
GRAPHQL_ENDPOINT=http://localhost:3000/graphql
PLUGIN_2_GRAPHQL_ENDPOINT=http://localhost:3001/graphql (overrides the above for plugin 2)





Todos:

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


Support parallel authentication flows?
Use directives to separate expected authentication mechanisms. So we can have a token that contains { integrationId: ObjectId }, { userId: ObjectId } as well as { apiKey: ObjectId } and type them safely for each resolver, for example:
resolver1 @AuthContextWithToken (no auth required)
resolver2 (user auth, default)
resolver3 @integrationAuth (integration auth)
resolver4 @integrationAuth @userAuth (either goes)
resolver5 @apiAuth (api auth)




## Plugins

Plugins are reusable pieces of functionality that can be added to a system. Plugins can depend on other plugins, and can be depended on by other plugins. Plugins should preferably contain one piece of functionality, and should be as loosely coupled as possible.

Some plugins act as middleware, which means they can traverse other plugins without any direct dependency on them. Examples of this is: 
- the core GraphQL plugin, which adds schema and resolvers from other plugins.
- the core Queue plugin, which adds queues from other plugins.

Every plugin exposes a config. The config is fully typed and can be configured in detail when composing the app. Environment variables (including .env-files) are also fully supported it is suggested that plugins listens to environment variables wherever possible, for example the core KV, Queue and PubSub plugins accepts the REDIS_URL environment variable to configure the Redis connection, while still allowing overriding this for every plugin individually.

An app can be just a set of plugins without any custom code. It can also contain custom code, any middleware will traverse this custom code in the same way as it traverses plugins.

Concepts:
- An app is a set of configured plugins with or without custom code.
- A plugin is a reusable piece of functionality that can be added to an app. It can provide middleware that traverses other plugins.
- Every plugin has a config that can be configured in detail when composing an app. 