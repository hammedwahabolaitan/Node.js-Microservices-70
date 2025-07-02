"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Server, Activity } from "lucide-react"

interface ServiceHealth {
  name: string
  status: "healthy" | "warning" | "error"
  uptime: number
  responseTime?: number
  lastCheck?: string
}

export default function AdminDashboard() {
  const [services, setServices] = useState<ServiceHealth[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    try {
      const res = await fetch("/api/admin/services")
      const data = await res.json()
      setServices(data.services || [])
    } catch (err) {
      console.error("Failed to fetch service health:", err)
    } finally {
      setLoading(false)
    }
  }

  const statusColor = (status: ServiceHealth["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-red-100 text-red-800"
    }
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Loading service data…</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={60} className="h-3" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <button
          onClick={fetchServices}
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          <Activity className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <Card key={svc.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Server className="h-4 w-4" /> {svc.name}
              </CardTitle>
              <Badge className={statusColor(svc.status)}>{svc.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-gray-600">Uptime: {svc.uptime}%</p>
              {svc.responseTime && <p className="text-xs text-gray-600">Avg. Response Time: {svc.responseTime} ms</p>}
              {svc.lastCheck && (
                <p className="text-[10px] text-gray-400">Last check: {new Date(svc.lastCheck).toLocaleString()}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
