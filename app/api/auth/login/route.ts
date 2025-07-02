import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { UserModel } from "@/lib/database/models/User"
import { isDatabaseMongoDB } from "@/lib/database/config"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user in database
    const user = isDatabaseMongoDB()
      ? await UserModel.findUserByEmailMongo(email)
      : await UserModel.findUserByEmailPostgres(email)

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await UserModel.verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Check if user is verified
    if (!user.is_verified) {
      return NextResponse.json({ message: "Please verify your account" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
