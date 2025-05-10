"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBag, CheckCircle2, Clock } from "lucide-react"
import { useVendor } from "@/lib/context/vendor-provider"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { doc, updateDoc } from "firebase/firestore"

interface Order {
  id: string
  orderStatus: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled"
  [key: string]: any
}

export default function VendorDashboard() {
  const { vendor, refreshVendorData } = useVendor()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  })
  const [isOpen, setIsOpen] = useState(vendor?.isOpen || false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Handle store status toggle
  const handleStoreStatusChange = async () => {
    if (!vendor || isUpdating) return

    setIsUpdating(true)
    try {
      const newStatus = !isOpen
      setIsOpen(newStatus) // Update local state immediately for better UX

      const vendorRef = doc(db, "vendors", vendor.id)
      await updateDoc(vendorRef, {
        isOpen: newStatus
      })

      refreshVendorData() // Refresh vendor data after update
    } catch (error) {
      console.error("Error updating store status:", error)
      setIsOpen(isOpen) // Revert to original state if error
    } finally {
      setIsUpdating(false)
    }
  }

  // Fetch dashboard stats
  useEffect(() => {
    if (!vendor) return

    const fetchStats = async () => {
      try {
        // Get total products for this vendor
        const productsQuery = query(
          collection(db, "products"),
          where("vendorId", "==", vendor.id)
        )
        const productsSnapshot = await getDocs(productsQuery)

        // Set up order listener
        const ordersQuery = query(
          collection(db, "orders"),
          where("vendorId", "==", vendor.id)
        )

        const unsubscribe = onSnapshot(ordersQuery, (ordersSnapshot) => {
          const orders = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Order[]

          setStats({
            totalProducts: productsSnapshot.size,
            totalOrders: orders.length,
            pendingOrders: orders.filter(order =>
              ["pending", "confirmed", "preparing", "ready", "out_for_delivery"].includes(order.orderStatus)
            ).length,
            deliveredOrders: orders.filter(order => order.orderStatus === "delivered").length
          })
        })

        return unsubscribe
      } catch (error) {
        console.error("Error fetching vendor stats:", error)
      }
    }

    fetchStats()
  }, [vendor])

  // Initialize isOpen state from vendor data
  useEffect(() => {
    if (vendor) {
      setIsOpen(vendor.isOpen)
    }
  }, [vendor])

  if (!vendor) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {vendor.name}!</h1>
          <p className="text-gray-500">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Store Status:</span>
          <div className="flex items-center gap-2">
            <Badge variant={isOpen ? "default" : "destructive"} className={isOpen ? "bg-green-100 text-green-800" : ""}>
              {isOpen ? "Open" : "Closed"}
            </Badge>
            <Switch
              checked={isOpen}
              onCheckedChange={handleStoreStatusChange}
              disabled={isUpdating}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500">
              Products in your inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-gray-500">
              All time orders received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-gray-500">
              Orders waiting to be delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Delivered Orders
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
            <p className="text-xs text-gray-500">
              Successfully completed orders
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.totalOrders === 0 ? (
                <p className="text-sm text-gray-500">No orders received yet</p>
              ) : (
                <p className="text-sm text-gray-500">Loading recent orders...</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.totalProducts === 0 ? (
                <p className="text-sm text-gray-500">No products in inventory</p>
              ) : (
                <p className="text-sm text-gray-500">Loading low stock products...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 