export const DATABASE_TYPE = process.env.DATABASE_TYPE || "postgresql" // 'mongodb' or 'postgresql'

export function isDatabaseMongoDB(): boolean {
  return DATABASE_TYPE === "mongodb"
}

export function isDatabasePostgreSQL(): boolean {
  return DATABASE_TYPE === "postgresql"
}

// Database health check
export async function checkDatabaseHealth(): Promise<{ status: string; type: string; message?: string }> {
  try {
    if (isDatabaseMongoDB()) {
      const { connectToMongoDB } = await import("./mongodb")
      const db = await connectToMongoDB()
      await db.admin().ping()
      return { status: "healthy", type: "mongodb" }
    } else {
      const { query } = await import("./postgresql")
      await query("SELECT 1")
      return { status: "healthy", type: "postgresql" }
    }
  } catch (error: any) {
    return {
      status: "unhealthy",
      type: DATABASE_TYPE,
      message: error.message,
    }
  }
}
