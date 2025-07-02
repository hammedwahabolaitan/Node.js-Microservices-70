import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { UserModel } from "@/lib/database/models/User"
import { isDatabaseMongoDB } from "@/lib/database/config"

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, tempUserId } = await request.json()

    // In a real app, verify OTP from Twilio/database
    if (otp !== "123456") {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 })
    }

    // Find user and mark as verified
    let user
    if (tempUserId) {
      user = isDatabaseMongoDB()
        ? await UserModel.findUserByIdMongo(tempUserId)
        : await UserModel.findUserByIdPostgres(tempUserId)

      if (user) {
        // Mark user as verified
        if (isDatabaseMongoDB()) {
          // Update in MongoDB would require additional method
        } else {
          await UserModel.updateUserPostgres(user.id, { is_verified: true })
          user.is_verified = true
        }
      }
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
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
    console.error("OTP verification error:", error)
    return NextResponse.json({ message: "Verification failed" }, { status: 500 })
  }
}
