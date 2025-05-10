import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data - in a real app, this would come from Firebase
const orders = [
  {
    id: "ORD12345",
    customer: "Rahul Sharma",
    address: "123 Main St, Delhi, 110001",
    items: 5,
    total: 450,
    status: "ready",
    time: "10 mins ago",
  },
  {
    id: "ORD12346",
    customer: "Priya Patel",
    address: "456 Park Ave, Delhi, 110002",
    items: 3,
    total: 320,
    status: "ready",
    time: "15 mins ago",
  },
  {
    id: "ORD12347",
    customer: "Amit Kumar",
    address: "789 Oak St, Delhi, 110003",
    items: 7,
    total: 780,
    status: "in_progress",
    time: "5 mins ago",
  },
  {
    id: "ORD12348",
    customer: "Neha Singh",
    address: "101 Pine Rd, Delhi, 110001",
    items: 2,
    total: 150,
    status: "in_progress",
    time: "Just now",
  },
]

export default function DeliveryDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Delivery Dashboard</h1>
        <Button className="bg-blue-500 hover:bg-blue-600">Go Online</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">-2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,250</div>
            <p className="text-xs text-muted-foreground">+₹350 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground">Based on 45 ratings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Orders</CardTitle>
          <CardDescription>Orders that are ready for pickup and delivery.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>₹{order.total}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        order.status === "ready" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {order.status === "ready" ? "Ready for pickup" : "In preparation"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600" disabled={order.status !== "ready"}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
