import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { UserModel } from "@/lib/database/models/User"
import { isDatabaseMongoDB } from "@/lib/database/config"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    // Get user from database
    const user = isDatabaseMongoDB()
      ? await UserModel.findUserByIdMongo(decoded.userId)
      : await UserModel.findUserByIdPostgres(decoded.userId)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}
