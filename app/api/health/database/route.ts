import { NextResponse } from "next/server"
import { checkDatabaseHealth } from "@/lib/database/config"

export async function GET() {
  try {
    const health = await checkDatabaseHealth()

    const statusCode = health.status === "healthy" ? 200 : 503

    return NextResponse.json(
      {
        database: health,
        timestamp: new Date().toISOString(),
      },
      { status: statusCode },
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        database: {
          status: "error",
          message: error.message,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
