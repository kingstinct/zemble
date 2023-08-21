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