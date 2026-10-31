import { MongoClient } from 'mongodb'

const cache = globalThis

export async function leadsCollection() {
  const uri = process.env.MONGODB_URI
  const database = process.env.MONGODB_DATABASE
  if (!uri || !database) throw new Error('MongoDB configuration is missing.')

  if (!cache.connectXMongoPromise) {
    const client = new MongoClient(uri, {
      appName: 'connectx-leads',
      maxPoolSize: 5, // Low-volume serverless routes need a small pool per warm instance.
      minPoolSize: 0, // Avoid reserving connections while serverless instances are idle.
      maxIdleTimeMS: 30_000, // Release idle connections between occasional website enquiries.
    })
    cache.connectXMongoPromise = client.connect().catch(error => {
      cache.connectXMongoPromise = undefined
      throw error
    })
  }

  const client = await cache.connectXMongoPromise
  const collection = client.db(database).collection('leads')
  if (!cache.connectXLeadIndexPromise) {
    cache.connectXLeadIndexPromise = collection.createIndex({ createdAt: -1 }).catch(error => {
      cache.connectXLeadIndexPromise = undefined
      throw error
    })
  }
  await cache.connectXLeadIndexPromise
  return collection
}
