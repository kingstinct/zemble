# zemble-plugin-bull

This is still a WIP and breaking changes can occur. The design goal is to provide a generic interface to specify queues that is not tied to Bull. It's close, but for speed of implementation there are some Bull specific types in there still.

This is a plugin for Zemble to easily set up queues. It's based on Bull and requires Redis (set REDIS_URL or configure it in the plugin options).

It automatically processes /queues directories. For typesafety and wiring it all up export a ZembleQueue. It just exposes a worker callback and some configuration that is completely optional (for example if you want the job to be processed recurringly).

Optionally it exposes GraphQL queries to manage and monitor the jobs.