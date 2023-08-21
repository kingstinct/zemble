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
- Key-Value Store (would be nice)
- Pub/Sub (would be nice)
- Queues (would be nice)


Environment variables:
Using dotenv by default. Let's consider providing overrides that are prefixed, to allow for flexbility, i.e.:
GRAPHQL_ENDPOINT=http://localhost:3000/graphql
PLUGIN_2_GRAPHQL_ENDPOINT=http://localhost:3001/graphql (overrides the above for plugin 2)