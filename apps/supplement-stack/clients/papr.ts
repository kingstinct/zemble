import type { IStandardLogger } from '@zemble/core'
import { MongoClient } from 'mongodb'
import Papr from 'papr'

// eslint-disable-next-line import/no-mutable-exports
export let client: MongoClient | undefined

const papr = new Papr()

export async function connect({
  logger,
}: {
  readonly logger: IStandardLogger
}) {
  const mongoUrl = process.env['MONGO_URL']

  if (!mongoUrl) throw new Error('MONGO_URL not set')

  if (process.env.NODE_ENV !== 'test' || process.env['DEBUG']) {
    logger.info('Connecting to MongoDB...', mongoUrl)
  }

  client = await MongoClient.connect(mongoUrl)

  if (process.env.NODE_ENV !== 'test' || process.env['DEBUG']) {
    logger.info('Connected to MongoDB!')
  }

  const db = client.db()

  papr.initialize(db)

  if (process.env.NODE_ENV !== 'test' || process.env['DEBUG']) {
    logger.info(`Registering ${papr.models.size} models...`)
  }

  papr.models.forEach((model) => {
    logger.info(`Registering model: ${model.collection.collectionName}`)
  })

  await papr.updateSchemas()

  await db.collection('supplement-intakes').createIndex({ title: 'text' })
  await db.collection('eatables').createIndex({ title: 'text' })
}

export async function disconnect() {
  await client?.close()
}

export default papr
