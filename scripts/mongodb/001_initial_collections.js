// MongoDB initialization script
const db = db.getSiblingDB("microservice_db")

// Create collections with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "name", "password_hash", "role"],
      properties: {
        email: { bsonType: "string" },
        name: { bsonType: "string" },
        phone: { bsonType: "string" },
        password_hash: { bsonType: "string" },
        role: { enum: ["admin", "user"] },
        is_verified: { bsonType: "bool" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
      },
    },
  },
})

db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customer_name", "customer_email", "items", "total", "status", "shipping_address"],
      properties: {
        customer_id: { bsonType: "string" },
        customer_name: { bsonType: "string" },
        customer_email: { bsonType: "string" },
        items: { bsonType: "array" },
        total: { bsonType: "number" },
        status: { enum: ["pending", "processing", "shipped", "delivered", "cancelled"] },
        shipping_address: { bsonType: "string" },
        tracking_number: { bsonType: "string" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
      },
    },
  },
})

db.createCollection("payments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["order_id", "customer_email", "amount", "currency", "method", "status"],
      properties: {
        order_id: { bsonType: "string" },
        customer_email: { bsonType: "string" },
        amount: { bsonType: "number" },
        currency: { bsonType: "string" },
        method: { enum: ["stripe", "paypal"] },
        status: { enum: ["pending", "completed", "failed", "refunded"] },
        transaction_id: { bsonType: "string" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
      },
    },
  },
})

db.createCollection("files")
db.createCollection("chat_rooms")
db.createCollection("messages")

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.orders.createIndex({ customer_id: 1 })
db.orders.createIndex({ status: 1 })
db.payments.createIndex({ order_id: 1 })
db.messages.createIndex({ room_id: 1 })
db.messages.createIndex({ created_at: 1 })
