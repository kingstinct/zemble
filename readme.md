# ReAdapt POC

A plugin system to build composable systems. Goal is to do what plugins do for Wordpress, but for the Node ecosystem.

Design goals:
- DX-optimized plugin development
- Reuse 80% when building a new app/system
- Loose coupling
- Infrastructure agnostic (default behaviour should be that plugins work on edge/node/wherever)

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








queues (och kanske även graphql) borde nog vara egna plugins baserat på någon typ av “setup”-funktion. Strukturen är bra men vore nice med möjlighet att switcha implementationer

Autentisering och middleware för graphql? (key)

TypeScript-baserat config för alla installerade plugins (och kanske avstå från env-variabel magi). Kanske mer explicit hämtning av plugins här? Minskar "black-box" samtidigt som det nog är lättare att få typerna 100%.

Codegen och typsäkerhet (det löser vi, bättre att ta när strukturen sitter)

Eslint o testning (det löser vi, bättre att ta när strukturen sitter)

Orkestrering av contexts (t ex flera URQL-instanser) på klienten?








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