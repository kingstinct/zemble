import { MongoClient } from 'mongodb'
import Papr from 'papr'

// eslint-disable-next-line import/no-mutable-exports
export let client: MongoClient | undefined

const papr = new Papr()

export async function connect() {
  const mongoUrl = process.env.MONGO_URL

  if (!mongoUrl) throw new Error('MONGO_URL not set')

  console.log('Connecting to MongoDB...', mongoUrl)

  client = await MongoClient.connect(mongoUrl)

  console.log('Connected to MongoDB!')

  const db = client.db()

  papr.initialize(db)

  console.log(`Registering ${papr.models.size} models...`)
  papr.models.forEach((model) => {
    console.log(`Registering model: ${model.collection.collectionName}`)
  })

  await papr.updateSchemas()

  await db.collection('supplement-intakes').createIndex({ title: 'text' })
  await db.collection('eatables').createIndex({ title: 'text' })
}

export async function disconnect() {
  await client?.close()
}

export default papr
