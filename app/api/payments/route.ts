import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { PaymentModel } from "@/lib/database/models/Payment"
import { isDatabaseMongoDB } from "@/lib/database/config"

function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payments = isDatabaseMongoDB()
      ? await PaymentModel.findPaymentsMongo(user.role === "admin" ? undefined : user.userId)
      : await PaymentModel.findPaymentsPostgres(user.role === "admin" ? undefined : user.userId)

    return NextResponse.json({ payments })
  } catch (error) {
    console.error("Payments fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch payments" }, { status: 500 })
  }
}
