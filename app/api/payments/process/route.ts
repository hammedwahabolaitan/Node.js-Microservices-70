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

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const paymentData = await request.json()

    // Simulate payment processing
    const status = Math.random() > 0.1 ? "completed" : "failed"
    const transactionId = status === "completed" ? `txn_${Date.now()}` : undefined

    const newPaymentData = {
      order_id: paymentData.orderId,
      customer_email: paymentData.customerEmail,
      amount: paymentData.amount,
      currency: paymentData.currency,
      method: paymentData.method,
      status,
      transaction_id: transactionId,
    }

    const payment = isDatabaseMongoDB()
      ? await PaymentModel.createPaymentMongo(newPaymentData)
      : await PaymentModel.createPaymentPostgres(newPaymentData)

    return NextResponse.json({ payment }, { status: 201 })
  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json({ message: "Payment processing failed" }, { status: 500 })
  }
}
