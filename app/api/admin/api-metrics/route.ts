import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const metrics = {
      totalRequests: 125847,
      successRate: 98.5,
      averageResponseTime: 67,
      errorRate: 1.5,
      requestsPerMinute: 245,
    }

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error("API metrics fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch API metrics" }, { status: 500 })
  }
}
