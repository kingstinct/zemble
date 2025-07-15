# @zemble/utils

[![npm (scoped)](https://img.shields.io/npm/v/@zemble/utils?style=for-the-badge)](https://www.npmjs.com/package/@zemble/utils)

This is a generic utility library that we use across our projects at Kingstinct (still early days for this lib).

There are two main imports, one generic and one for some node-specific stuff:
`import { wait, times, sample, logPrettyData } from '@zemble/utils'`

`import { gravatarUrlForEmail } from '@zemble/utils/node'`

You can also import utilities directly:
`import wait from '@zemble/utils/wait'`

The goal of this library (and the related [@zemble/react](https://github.com/Kingstinct/utils)) is to:
- Keep the number of dependencies in projects down
- Have a common place to put useful utilities, so they're easier to maintain and find
- Quickly get up and running with new projects

We believe this is a better approach than the alternatives:
- Using one single utility library for everything, which would introduce unnecessary dependencies
- Using lots of micro-libs. Micro-libs does have it's advantages, but is harder to maintain and means loosing oversight of the dependencies in a project.
- Copy pasting between projects :)

## Timeoutify

Timeoutify is a utility to handle timeouts making it easy to clean up resources when a timeout occurs, and it can also be aborted for other reasons (client disconnects for example). 

The easiest way to use it is through the Fastify plugin, and access it on from your request object:
  
  ```ts
  import fastify from 'fastify'
  import { timeoutifyPlugin } from '@zemble/fastify'
  import mongodb from 'mongodb'

  const fastifyServer = fastify()
  fastifyServer.register(timeoutifyPlugin, { timeoutMS: 30000 }) // <- time out your request after 30 seconds

  const db = await mongodb.connect('mongodb://localhost:27017', { timeout: req.timeoutify.timeout })

  fastifyServer.get('/callSomeOtherApi', async (req, res) => {    
    const result = await fetch('https://api.slow.app', { signal: req.timeoutify.abortSignal });
    return result;
  })

  fastifyServer.get('/callMongoDb', async (req, res) => {    
    const result = await req.timeoutify.runMongoOpWithTimeout(
      db.collection('users').find({})
    );
    return result;
  })
  ```
This will take care of the following:
- If the timeout (of 30s in this example) is hit a 504 response will be sent to the client.
- If the client disconnects (ex: closes browser tab) a 499 response will be sent to the client.
- If the request is aborted (by either a timeout or client disconnect) the fetch request will be aborted. Works with any calls supporting AbortSignal.
- If the request times out the MongoDB query will time out at the same time. This ensures that MongoDB queries are not left hogging resources.