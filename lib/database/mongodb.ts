import { MongoClient, type Db } from "mongodb"

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db
  }

  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/microservice_db"
    client = new MongoClient(uri)
    await client.connect()
    db = client.db()

    console.log("Connected to MongoDB")
    return db
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

export async function closeMongoDB() {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}

export { db }
