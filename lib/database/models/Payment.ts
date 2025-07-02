import { connectToMongoDB } from "../mongodb"
import { query } from "../postgresql"

export interface Payment {
  id: string
  order_id: string
  customer_email: string
  amount: number
  currency: string
  method: "stripe" | "paypal"
  status: "pending" | "completed" | "failed" | "refunded"
  transaction_id?: string
  created_at: Date
  updated_at: Date
}

export class PaymentModel {
  // MongoDB operations
  static async createPaymentMongo(paymentData: Omit<Payment, "id" | "created_at" | "updated_at">) {
    const db = await connectToMongoDB()
    const payments = db.collection("payments")

    const payment = {
      ...paymentData,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await payments.insertOne(payment)
    return { ...payment, id: result.insertedId.toString() }
  }

  static async findPaymentsMongo(customerId?: string) {
    const db = await connectToMongoDB()
    const payments = db.collection("payments")

    const filter = customerId ? { customer_id: customerId } : {}
    const paymentList = await payments.find(filter).sort({ created_at: -1 }).toArray()

    return paymentList.map((payment) => ({ ...payment, id: payment._id.toString() }))
  }

  static async updatePaymentStatusMongo(id: string, status: string, transactionId?: string) {
    const db = await connectToMongoDB()
    const payments = db.collection("payments")
    const { ObjectId } = require("mongodb")

    const updateData: any = {
      status,
      updated_at: new Date(),
    }

    if (transactionId) {
      updateData.transaction_id = transactionId
    }

    const result = await payments.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    return result.modifiedCount > 0
  }

  // PostgreSQL operations
  static async createPaymentPostgres(paymentData: Omit<Payment, "id" | "created_at" | "updated_at">) {
    const result = await query(
      `INSERT INTO payments (order_id, customer_email, amount, currency, method, status, transaction_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        paymentData.order_id,
        paymentData.customer_email,
        paymentData.amount,
        paymentData.currency,
        paymentData.method,
        paymentData.status,
        paymentData.transaction_id,
      ],
    )
    return result.rows[0]
  }

  static async findPaymentsPostgres(customerId?: string) {
    const result = await query("SELECT * FROM payments ORDER BY created_at DESC")
    return result.rows
  }

  static async updatePaymentStatusPostgres(id: string, status: string, transactionId?: string) {
    const result = await query(
      `UPDATE payments 
       SET status = $1, transaction_id = COALESCE($2, transaction_id), updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [status, transactionId, id],
    )

    return result.rowCount > 0
  }
}
