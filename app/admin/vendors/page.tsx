import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data - in a real app, this would come from Firebase
const vendors = [
  {
    id: "v1",
    name: "Fresh Farms",
    email: "contact@freshfarms.com",
    phone: "+91 9876543210",
    pincodes: ["110001", "110002", "110003"],
    status: "active",
    productsCount: 45,
    joinedDate: "2023-01-15",
  },
  {
    id: "v2",
    name: "Dairy Delight",
    email: "info@dairydelight.com",
    phone: "+91 9876543211",
    pincodes: ["110001", "110005"],
    status: "active",
    productsCount: 32,
    joinedDate: "2023-02-20",
  },
  {
    id: "v3",
    name: "Spice World",
    email: "support@spiceworld.com",
    phone: "+91 9876543212",
    pincodes: ["110003", "110006"],
    status: "pending",
    productsCount: 0,
    joinedDate: "2023-05-10",
  },
  {
    id: "v4",
    name: "Organic Harvest",
    email: "hello@organicharvest.com",
    phone: "+91 9876543213",
    pincodes: ["110002", "110004"],
    status: "blocked",
    productsCount: 28,
    joinedDate: "2023-03-05",
  },
]

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vendors</h1>
        <Button>Add New Vendor</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.filter((v) => v.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.filter((v) => v.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">-1 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Management</CardTitle>
          <CardDescription>Manage your vendors, approve new registrations, or block vendors.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Pincodes</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>
                    <div>{vendor.email}</div>
                    <div className="text-sm text-gray-500">{vendor.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {vendor.pincodes.map((pincode) => (
                        <Badge key={pincode} variant="outline">
                          {pincode}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{vendor.productsCount}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        vendor.status === "active"
                          ? "bg-green-100 text-green-800"
                          : vendor.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {vendor.status === "pending" && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          Approve
                        </Button>
                      )}
                      {vendor.status === "active" && (
                        <Button size="sm" variant="destructive">
                          Block
                        </Button>
                      )}
                      {vendor.status === "blocked" && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          Unblock
                        </Button>
                      )}
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
