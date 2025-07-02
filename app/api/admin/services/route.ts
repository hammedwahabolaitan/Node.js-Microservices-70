import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const services = [
      {
        name: "Customer Service",
        status: "healthy",
        uptime: 99.9,
        responseTime: 45,
        lastCheck: new Date().toISOString(),
        endpoint: "/api/customers",
      },
      {
        name: "Order Service",
        status: "healthy",
        uptime: 98.5,
        responseTime: 67,
        lastCheck: new Date().toISOString(),
        endpoint: "/api/orders",
      },
      {
        name: "Payment Service",
        status: "warning",
        uptime: 97.8,
        responseTime: 120,
        lastCheck: new Date().toISOString(),
        endpoint: "/api/payments",
      },
      {
        name: "Chat Service",
        status: "healthy",
        uptime: 99.2,
        responseTime: 34,
        lastCheck: new Date().toISOString(),
        endpoint: "/api/chat",
      },
      {
        name: "File Service",
        status: "healthy",
        uptime: 99.5,
        responseTime: 89,
        lastCheck: new Date().toISOString(),
        endpoint: "/api/files",
      },
      {
        name: "Cache Service",
        status: "healthy",
        uptime: 99.8,
        responseTime: 12,
        lastCheck: new Date().toISOString(),
        endpoint: "/api/cache",
      },
    ]

    return NextResponse.json({ services })
  } catch (error) {
    console.error("Services fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch services" }, { status: 500 })
  }
}
