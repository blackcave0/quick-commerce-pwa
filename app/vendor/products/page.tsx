"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useVendor } from "@/lib/context/vendor-provider"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  mrp: number
  image: string
  unit: string
  stock: number
  vendorId: string
  pincodes: string[]
  status: "active" | "out_of_stock" | "deleted"
}

export default function VendorProductsPage() {
  const { vendor } = useVendor()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<{ id: string, price: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch products for this vendor
  useEffect(() => {
    if (!vendor) return

    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const productsQuery = query(
          collection(db, "products"),
          where("vendorId", "==", vendor.id),
          where("status", "!=", "deleted")
        )

        const productsSnapshot = await getDocs(productsQuery)
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[]

        setProducts(productsData)
      } catch (error: any) {
        setError(`Error loading products: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [vendor])

  // Toggle product status (in stock / out of stock)
  const toggleProductStatus = async (productId: string, currentStatus: Product["status"]) => {
    try {
      const newStatus = currentStatus === "active" ? "out_of_stock" : "active"

      await updateDoc(doc(db, "products", productId), {
        status: newStatus
      })

      // Update local state
      setProducts(products.map(product =>
        product.id === productId
          ? { ...product, status: newStatus }
          : product
      ))

      toast({
        title: "Status updated",
        description: `Product is now ${newStatus === "active" ? "in stock" : "out of stock"}.`,
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: error.message,
      })
    }
  }

  // Start editing product price
  const startEditingPrice = (productId: string, currentPrice: number) => {
    setEditingProduct({ id: productId, price: currentPrice })
  }

  // Update product price
  const updateProductPrice = async () => {
    if (!editingProduct) return

    try {
      await updateDoc(doc(db, "products", editingProduct.id), {
        price: editingProduct.price
      })

      // Update local state
      setProducts(products.map(product =>
        product.id === editingProduct.id
          ? { ...product, price: editingProduct.price }
          : product
      ))

      toast({
        title: "Price updated",
        description: "Product price has been updated successfully.",
      })

      // Clear editing state
      setEditingProduct(null)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update price",
        description: error.message,
      })
    }
  }

  if (!vendor) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/vendor/products/add">Add New Product</Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.filter((p) => p.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.filter((p) => p.status === "out_of_stock").length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your products, update stock, or change availability.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">No products found.</p>
              <Button className="mt-4" asChild>
                <Link href="/vendor/products/add">Add Your First Product</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-md overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {editingProduct?.id === product.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            className="w-24"
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct,
                              price: parseFloat(e.target.value)
                            })}
                          />
                          <Button size="sm" onClick={updateProductPrice}>Save</Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProduct(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>₹{product.price}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingPrice(product.id, product.price)}
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={product.status === "active"}
                          onCheckedChange={() => toggleProductStatus(product.id, product.status)}
                        />
                        <Badge
                          variant={product.status === "active" ? "default" : "secondary"}
                          className={
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {product.status === "active" ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/vendor/products/edit/${product.id}`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
