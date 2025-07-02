import { connectToMongoDB } from "../mongodb"
import { query } from "../postgresql"

export interface Order {
  id: string
  customer_id: string
  customer_name: string
  customer_email: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shipping_address: string
  tracking_number?: string
  created_at: Date
  updated_at: Date
}

export class OrderModel {
  // MongoDB operations
  static async createOrderMongo(orderData: Omit<Order, "id" | "created_at" | "updated_at">) {
    const db = await connectToMongoDB()
    const orders = db.collection("orders")

    const order = {
      ...orderData,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await orders.insertOne(order)
    return { ...order, id: result.insertedId.toString() }
  }

  static async findOrdersMongo(customerId?: string) {
    const db = await connectToMongoDB()
    const orders = db.collection("orders")

    const filter = customerId ? { customer_id: customerId } : {}
    const orderList = await orders.find(filter).sort({ created_at: -1 }).toArray()

    return orderList.map((order) => ({ ...order, id: order._id.toString() }))
  }

  static async findOrderByIdMongo(id: string) {
    const db = await connectToMongoDB()
    const orders = db.collection("orders")
    const { ObjectId } = require("mongodb")

    const order = await orders.findOne({ _id: new ObjectId(id) })
    if (order) {
      return { ...order, id: order._id.toString() }
    }
    return null
  }

  static async updateOrderStatusMongo(id: string, status: string) {
    const db = await connectToMongoDB()
    const orders = db.collection("orders")
    const { ObjectId } = require("mongodb")

    const result = await orders.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updated_at: new Date(),
          ...(status === "shipped" && { tracking_number: `TRK${Date.now()}` }),
        },
      },
    )

    return result.modifiedCount > 0
  }

  // PostgreSQL operations
  static async createOrderPostgres(orderData: Omit<Order, "id" | "created_at" | "updated_at">) {
    const result = await query(
      `INSERT INTO orders (customer_id, customer_name, customer_email, items, total, status, shipping_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        orderData.customer_id,
        orderData.customer_name,
        orderData.customer_email,
        JSON.stringify(orderData.items),
        orderData.total,
        orderData.status,
        orderData.shipping_address,
      ],
    )
    return result.rows[0]
  }

  static async findOrdersPostgres(customerId?: string) {
    const queryText = customerId
      ? "SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC"
      : "SELECT * FROM orders ORDER BY created_at DESC"

    const params = customerId ? [customerId] : []
    const result = await query(queryText, params)

    return result.rows.map((order: any) => ({
      ...order,
      items: JSON.parse(order.items),
    }))
  }

  static async findOrderByIdPostgres(id: string) {
    const result = await query("SELECT * FROM orders WHERE id = $1", [id])
    const order = result.rows[0]

    if (order) {
      return {
        ...order,
        items: JSON.parse(order.items),
      }
    }
    return null
  }

  static async updateOrderStatusPostgres(id: string, status: string) {
    const trackingNumber = status === "shipped" ? `TRK${Date.now()}` : null

    const result = await query(
      `UPDATE orders 
       SET status = $1, tracking_number = COALESCE($2, tracking_number), updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [status, trackingNumber, id],
    )

    return result.rowCount > 0
  }
}
