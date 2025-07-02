import { Pool, type PoolClient } from "pg"

let pool: Pool | null = null

export function getPostgreSQLPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/microservice_db",
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    pool.on("connect", () => {
      console.log("Connected to PostgreSQL")
    })

    pool.on("error", (err) => {
      console.error("PostgreSQL pool error:", err)
    })
  }

  return pool
}

export async function query(text: string, params?: any[]): Promise<any> {
  const pool = getPostgreSQLPool()
  const client = await pool.connect()

  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export async function getClient(): Promise<PoolClient> {
  const pool = getPostgreSQLPool()
  return pool.connect()
}

export async function closePostgreSQL() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
