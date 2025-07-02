import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Mock dashboard data
    const stats = {
      totalOrders: 24,
      totalSpent: 1250.75,
      activeChats: 3,
      filesUploaded: 12,
      recentActivity: [
        {
          id: "1",
          type: "order",
          description: "Order #1234 completed",
          timestamp: new Date().toISOString(),
          status: "completed",
        },
        {
          id: "2",
          type: "payment",
          description: "Payment processed for $99.99",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: "completed",
        },
        {
          id: "3",
          type: "file",
          description: "Document uploaded successfully",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: "completed",
        },
      ],
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 })
  }
}
