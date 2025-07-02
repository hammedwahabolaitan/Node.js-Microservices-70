import { connectToMongoDB } from "../mongodb"
import { query } from "../postgresql"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  password_hash: string
  role: "admin" | "user"
  is_verified: boolean
  created_at: Date
  updated_at: Date
}

export class UserModel {
  // MongoDB operations
  static async createUserMongo(userData: Omit<User, "id" | "created_at" | "updated_at">) {
    const db = await connectToMongoDB()
    const users = db.collection("users")

    const user = {
      ...userData,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await users.insertOne(user)
    return { ...user, id: result.insertedId.toString() }
  }

  static async findUserByEmailMongo(email: string) {
    const db = await connectToMongoDB()
    const users = db.collection("users")

    const user = await users.findOne({ email })
    if (user) {
      return { ...user, id: user._id.toString() }
    }
    return null
  }

  static async findUserByIdMongo(id: string) {
    const db = await connectToMongoDB()
    const users = db.collection("users")
    const { ObjectId } = require("mongodb")

    const user = await users.findOne({ _id: new ObjectId(id) })
    if (user) {
      return { ...user, id: user._id.toString() }
    }
    return null
  }

  // PostgreSQL operations
  static async createUserPostgres(userData: Omit<User, "id" | "created_at" | "updated_at">) {
    const result = await query(
      `INSERT INTO users (email, name, phone, password_hash, role, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userData.email, userData.name, userData.phone, userData.password_hash, userData.role, userData.is_verified],
    )
    return result.rows[0]
  }

  static async findUserByEmailPostgres(email: string) {
    const result = await query("SELECT * FROM users WHERE email = $1", [email])
    return result.rows[0] || null
  }

  static async findUserByIdPostgres(id: string) {
    const result = await query("SELECT * FROM users WHERE id = $1", [id])
    return result.rows[0] || null
  }

  static async updateUserPostgres(id: string, updates: Partial<User>) {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ")

    const values = [id, ...Object.values(updates)]

    const result = await query(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      values,
    )
    return result.rows[0]
  }

  // Utility methods
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
