import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { OrderModel } from "@/lib/database/models/Order"
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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromToken(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()
    const orderId = params.id

    const updated = isDatabaseMongoDB()
      ? await OrderModel.updateOrderStatusMongo(orderId, status)
      : await OrderModel.updateOrderStatusPostgres(orderId, status)

    if (!updated) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Order status updated successfully" })
  } catch (error) {
    console.error("Order status update error:", error)
    return NextResponse.json({ message: "Failed to update order status" }, { status: 500 })
  }
}
