"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreditCard, DollarSign, Plus, Eye, CheckCircle, XCircle, Clock, Loader2, AlertTriangle } from "lucide-react"

interface Payment {
  id: string
  orderId: string
  amount: number
  currency: string
  method: "stripe" | "paypal"
  status: "pending" | "completed" | "failed" | "refunded"
  createdAt: string
  customerEmail: string
  transactionId?: string
}

interface PaymentMethod {
  id: string
  type: "card" | "paypal"
  last4?: string
  brand?: string
  email?: string
  isDefault: boolean
}

export default function PaymentInterface() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreatePayment, setShowCreatePayment] = useState(false)
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    fetchPayments()
    fetchPaymentMethods()
  }, [])

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/payments/methods", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setPaymentMethods(data.methods || [])
      }
    } catch (error) {
      console.error("Failed to fetch payment methods:", error)
    }
  }

  const processPayment = async (paymentData: any) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      })

      if (response.ok) {
        fetchPayments()
        setShowCreatePayment(false)
      }
    } catch (error) {
      console.error("Failed to process payment:", error)
    }
  }

  const refundPayment = async (paymentId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/payments/${paymentId}/refund`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchPayments()
      }
    } catch (error) {
      console.error("Failed to refund payment:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "refunded":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "refunded":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Payment Management</h2>
          <p className="text-gray-600">Process payments and manage transactions</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddPaymentMethod} onOpenChange={setShowAddPaymentMethod}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>Add a new payment method to your account</DialogDescription>
              </DialogHeader>
              <AddPaymentMethodForm
                onSubmit={() => {
                  fetchPaymentMethods()
                  setShowAddPaymentMethod(false)
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showCreatePayment} onOpenChange={setShowCreatePayment}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Process Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process New Payment</DialogTitle>
                <DialogDescription>Create a new payment transaction</DialogDescription>
              </DialogHeader>
              <CreatePaymentForm paymentMethods={paymentMethods} onSubmit={processPayment} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-600">
              From {payments.filter((p) => p.status === "completed").length} completed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-gray-600">
              {payments.filter((p) => p.status === "pending").length} pending transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentMethods.length}</div>
            <p className="text-xs text-gray-600">Active payment methods</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium">{method.type === "card" ? method.brand : "PayPal"}</span>
                    </div>
                    {method.isDefault && <Badge variant="secondary">Default</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">
                    {method.type === "card" ? `•••• •••• •••• ${method.last4}` : method.email}
                  </p>
                </CardContent>
              </Card>
            ))}

            {paymentMethods.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <CreditCard className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No payment methods added</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Transaction history and status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">#{payment.id.slice(-8)}</TableCell>
                  <TableCell className="font-mono text-sm">#{payment.orderId.slice(-8)}</TableCell>
                  <TableCell>{payment.customerEmail}</TableCell>
                  <TableCell className="font-medium">
                    ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1 capitalize">{payment.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedPayment(payment)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {payment.status === "completed" && (
                        <Button variant="outline" size="sm" onClick={() => refundPayment(payment.id)}>
                          Refund
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {payments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No payments found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>Payment #{selectedPayment.id.slice(-8)}</DialogDescription>
            </DialogHeader>
            <PaymentDetailsView payment={selectedPayment} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function CreatePaymentForm({
  paymentMethods,
  onSubmit,
}: {
  paymentMethods: PaymentMethod[]
  onSubmit: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    orderId: "",
    amount: 0,
    currency: "usd",
    method: "stripe",
    paymentMethodId: "",
    customerEmail: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit(formData)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="orderId">Order ID</Label>
          <Input
            id="orderId"
            value={formData.orderId}
            onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
            placeholder="Enter order ID"
            required
          />
        </div>
        <div>
          <Label htmlFor="customerEmail">Customer Email</Label>
          <Input
            id="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            placeholder="customer@example.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="gbp">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="method">Payment Method</Label>
        <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stripe">Stripe</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Process Payment
      </Button>
    </form>
  )
}

function AddPaymentMethodForm({ onSubmit }: { onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    type: "card",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/payments/methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSubmit()
      }
    } catch (error) {
      console.error("Failed to add payment method:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Payment Method Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="card">Credit/Debit Card</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === "card" ? (
        <>
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expiryMonth">Month</Label>
              <Input
                id="expiryMonth"
                value={formData.expiryMonth}
                onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                placeholder="MM"
                maxLength={2}
                required
              />
            </div>
            <div>
              <Label htmlFor="expiryYear">Year</Label>
              <Input
                id="expiryYear"
                value={formData.expiryYear}
                onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                placeholder="YY"
                maxLength={2}
                required
              />
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                value={formData.cvc}
                onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>
        </>
      ) : (
        <div>
          <Label htmlFor="email">PayPal Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="paypal@example.com"
            required
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Add Payment Method
      </Button>
    </form>
  )
}

function PaymentDetailsView({ payment }: { payment: Payment }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-1">Payment ID</h4>
          <p className="text-sm font-mono text-gray-600">#{payment.id}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Order ID</h4>
          <p className="text-sm font-mono text-gray-600">#{payment.orderId}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-1">Amount</h4>
          <p className="text-lg font-bold">
            ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Status</h4>
          <Badge
            className={`${payment.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
          >
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-1">Payment Method</h4>
          <p className="text-sm text-gray-600">{payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Customer</h4>
          <p className="text-sm text-gray-600">{payment.customerEmail}</p>
        </div>
      </div>

      {payment.transactionId && (
        <div>
          <h4 className="font-semibold mb-1">Transaction ID</h4>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded">{payment.transactionId}</p>
        </div>
      )}

      <div>
        <h4 className="font-semibold mb-1">Created</h4>
        <p className="text-sm text-gray-600">{new Date(payment.createdAt).toLocaleString()}</p>
      </div>
    </div>
  )
}
