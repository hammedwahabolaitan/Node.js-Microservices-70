"use client"

interface ServiceHealth {
  name: string
  status: "healthy" | "warning" | "error"
  uptime: number
}

// ** rest of code here **
