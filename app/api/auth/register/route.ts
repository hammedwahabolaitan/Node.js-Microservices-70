import { type NextRequest, NextResponse } from "next/server"
import { UserModel } from "@/lib/database/models/User"
import { isDatabaseMongoDB } from "@/lib/database/config"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json()

    // Check if user already exists
    const existingUser = isDatabaseMongoDB()
      ? await UserModel.findUserByEmailMongo(email)
      : await UserModel.findUserByEmailPostgres(email)

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const password_hash = await UserModel.hashPassword(password)

    // Create user in database
    const userData = {
      name,
      email,
      phone,
      password_hash,
      role: "user" as const,
      is_verified: false,
    }

    const user = isDatabaseMongoDB()
      ? await UserModel.createUserMongo(userData)
      : await UserModel.createUserPostgres(userData)

    // In a real app, send OTP via Twilio
    console.log(`OTP sent to ${phone}: 123456`)

    return NextResponse.json({
      message: "Registration successful. OTP sent to phone.",
      tempUserId: user.id,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Registration failed" }, { status: 500 })
  }
}
