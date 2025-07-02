// MongoDB seed data
const db = db.getSiblingDB("microservice_db")

// Insert default users
db.users.insertMany([
  {
    email: "admin@example.com",
    name: "Admin User",
    password_hash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "admin",
    is_verified: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    email: "user@example.com",
    name: "Regular User",
    password_hash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "user",
    is_verified: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
])
