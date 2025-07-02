"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, ShoppingCart, CreditCard, MessageCircle, FileText, Activity } from "lucide-react"
import AuthModal from "./components/auth/AuthModal"
import CustomerDashboard from "./components/dashboard/CustomerDashboard"
import OrderManagement from "./components/orders/OrderManagement"
import PaymentInterface from "./components/payments/PaymentInterface"
import ChatInterface from "./components/chat/ChatInterface"
import FileManager from "./components/files/FileManager"
import AdminDashboard from "./components/admin/AdminDashboard"
import type { RootState } from "@/store/store"
import { setUser } from "@/store/slices/authSlice"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem("token")
    if (token) {
      // Verify token and set user
      fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            dispatch(setUser(data.user))
          }
        })
        .catch(() => {
          localStorage.removeItem("token")
        })
    }
  }, [dispatch])

  const services = [
    {
      name: "Customer Service",
      icon: Users,
      status: "active",
      description: "User management, authentication, profiles",
      endpoint: "/api/customers",
    },
    {
      name: "Order Service",
      icon: ShoppingCart,
      status: "active",
      description: "Order processing, tracking, history",
      endpoint: "/api/orders",
    },
    {
      name: "Payment Service",
      icon: CreditCard,
      status: "active",
      description: "Stripe, PayPal integration, transactions",
      endpoint: "/api/payments",
    },
    {
      name: "Chat Service",
      icon: MessageCircle,
      status: "active",
      description: "Real-time messaging, WebRTC calls",
      endpoint: "/api/chat",
    },
    {
      name: "File Service",
      icon: FileText,
      status: "active",
      description: "Google Cloud Storage, file management",
      endpoint: "/api/files",
    },
    {
      name: "Cache Service",
      icon: Activity,
      status: "active",
      description: "Redis caching, session management",
      endpoint: "/api/cache",
    },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Scalable Microservice Platform</h1>
            <p className="text-xl text-gray-600 mb-8">
              Production-ready web platform with Kong Gateway, JWT Auth, and Real-time Features
            </p>
            <Button onClick={() => setShowAuthModal(true)} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <Card key={service.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                      <Badge variant={service.status === "active" ? "default" : "secondary"}>{service.status}</Badge>
                    </div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{service.endpoint}</code>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Architecture Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Frontend Stack</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Next.js 15 with App Router</li>
                  <li>• Redux for state management</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• TypeScript for type safety</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Backend Services</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Node.js + Express.js APIs</li>
                  <li>• MongoDB/PostgreSQL databases</li>
                  <li>• Kong Gateway for API management</li>
                  <li>• JWT authentication</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Microservice Platform</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name || user?.email}</span>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("token")
                  dispatch(setUser(null))
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <CustomerDashboard />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <PaymentInterface />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <FileManager />
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <AdminDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
