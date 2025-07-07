import MongoDBPlugin from '@zemble/mongodb'
import { wait } from '@zemble/utils'
import { MongoClient } from 'mongodb'

import type {
  MongoMemoryReplSet,
  MongoMemoryServer,
} from 'mongodb-memory-server'
import type { MongoMemoryReplSetOpts } from 'mongodb-memory-server-core/lib/MongoMemoryReplSet'

let mongodb: MongoMemoryServer | MongoMemoryReplSet | null = null

// TODO [2024-11-10] Move this file back to zemble (@zemble/mongodb/test-utils) once we see it is stable!

export const startInMemoryInstance = async ({
  options,
  replicaSetOptions,
}: {
  readonly options?: MongoMemoryServer['opts']
  readonly replicaSetOptions?: Partial<MongoMemoryReplSetOpts> | true
} = {}) => {
  try {
    const MongoMemoryServer = await import('mongodb-memory-server')

    const mdb = replicaSetOptions
      ? new MongoMemoryServer.MongoMemoryReplSet()
      : new MongoMemoryServer.MongoMemoryServer(options)
    mongodb = mdb

    await mdb.start()

    return mdb.getUri()
  } catch (e) {
    throw new Error(
      `[@zemble/mongodb] setupAndConfigure failed, maybe you need to install mongodb-memory-server? ${e}`,
    )
  }
}

export const startInMemoryInstanceAndConfigurePlugin = async ({
  options,
  replicaSetOptions,
}: {
  readonly options?: MongoMemoryServer['opts']
  readonly replicaSetOptions?: Partial<MongoMemoryReplSetOpts>
} = {}) => {
  const url = await startInMemoryInstance({ options, replicaSetOptions })

  MongoDBPlugin.configure({
    url,
  })

  const client = await MongoClient.connect(url)

  MongoDBPlugin.multiProviders.mongodb = {
    ...MongoDBPlugin.multiProviders.mongodb,
    '@zemble/mongodb': { client, db: client.db() },
  }
}

export const closeAndStopInMemoryInstance = async () => {
  const client = MongoDBPlugin.providers.mongodb?.client
  try {
    if (client) {
      await new Promise<void>((resolve) => {
        let isClosed = false
        void client.close(true).then(() => {
          isClosed = true
          resolve()
        })
        void wait(5000).then(() => {
          if (!isClosed) {
            resolve()
          }
        })
      })
    }
  } catch (e) {
    console.error('Error closing in-memory instance', e)
  }

  try {
    await new Promise<void>((resolve) => {
      let isStopped = false
      if (mongodb) {
        void mongodb.stop({ doCleanup: true, force: true }).then(() => {
          mongodb = null
          isStopped = true
          resolve()
        })
      }
      void wait(5000).then(() => {
        if (!isStopped) {
          resolve()
        }
      })
    })
  } catch (e) {
    console.error('Error stopping in-memory instance', e)
  }
}

export const emptyAllCollections = async () => {
  const db = MongoDBPlugin.providers.mongodb?.db
  if (db) {
    const allCollections = await db.collections()

    await Promise.all(
      allCollections?.map(async (c) => {
        await c.deleteMany({})
      }) ?? [],
    )
  }
}
