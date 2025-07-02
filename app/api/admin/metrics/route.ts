import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const metrics = {
      cpu: Math.floor(Math.random() * 30) + 20, // 20-50%
      memory: Math.floor(Math.random() * 40) + 40, // 40-80%
      disk: Math.floor(Math.random() * 20) + 60, // 60-80%
      network: Math.floor(Math.random() * 30) + 10, // 10-40%
    }

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error("Metrics fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch metrics" }, { status: 500 })
  }
}
