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

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const orders = isDatabaseMongoDB()
      ? await OrderModel.findOrdersMongo(user.role === "admin" ? undefined : user.userId)
      : await OrderModel.findOrdersPostgres(user.role === "admin" ? undefined : user.userId)

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const orderData = await request.json()

    const newOrderData = {
      customer_id: user.userId,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      items: orderData.items,
      total: orderData.total,
      status: "pending" as const,
      shipping_address: orderData.shippingAddress,
    }

    const order = isDatabaseMongoDB()
      ? await OrderModel.createOrderMongo(newOrderData)
      : await OrderModel.createOrderPostgres(newOrderData)

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 })
  }
}
