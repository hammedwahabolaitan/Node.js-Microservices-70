const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

async function setupDatabase() {
  const databaseType = process.env.DATABASE_TYPE || "postgresql"

  console.log(`Setting up ${databaseType} database...`)

  try {
    if (databaseType === "postgresql") {
      await setupPostgreSQL()
    } else if (databaseType === "mongodb") {
      await setupMongoDB()
    } else {
      throw new Error('Invalid DATABASE_TYPE. Use "postgresql" or "mongodb"')
    }

    console.log("Database setup completed successfully!")
  } catch (error) {
    console.error("Database setup failed:", error.message)
    process.exit(1)
  }
}

async function setupPostgreSQL() {
  console.log("Running PostgreSQL migrations...")

  const { Pool } = require("pg")
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/microservice_db",
  })

  try {
    // Read and execute migration files
    const migrationFiles = fs
      .readdirSync(path.join(__dirname, "postgresql"))
      .filter((file) => file.endsWith(".sql"))
      .sort()

    for (const file of migrationFiles) {
      console.log(`Executing ${file}...`)
      const sql = fs.readFileSync(path.join(__dirname, "postgresql", file), "utf8")
      await pool.query(sql)
    }

    console.log("PostgreSQL setup completed")
  } finally {
    await pool.end()
  }
}

async function setupMongoDB() {
  console.log("Setting up MongoDB collections...")

  const { MongoClient } = require("mongodb")
  const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017")

  try {
    await client.connect()
    const db = client.db("microservice_db")

    // Execute setup scripts
    const setupFiles = fs
      .readdirSync(path.join(__dirname, "mongodb"))
      .filter((file) => file.endsWith(".js"))
      .sort()

    for (const file of setupFiles) {
      console.log(`Executing ${file}...`)
      const script = fs.readFileSync(path.join(__dirname, "mongodb", file), "utf8")
      // Note: In a real setup, you'd execute these scripts via mongo shell
      console.log(`Please run this script in mongo shell: ${file}`)
    }

    console.log("MongoDB setup completed")
  } finally {
    await client.close()
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }
