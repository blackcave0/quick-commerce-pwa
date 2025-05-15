"use client"

import { useState, useEffect } from "react"
import { getProductsByPincode } from "@/lib/firebase/firestore"
import { usePincode } from "@/lib/hooks/use-pincode"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Plus, Loader2 } from "lucide-react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductDebug() {
  const { pincode } = usePincode()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [addingProduct, setAddingProduct] = useState(false)

  const fetchProducts = async () => {
    if (!pincode) return

    try {
      setLoading(true)
      setError(null)
      const fetchedProducts = await getProductsByPincode(pincode)
      setProducts(fetchedProducts)
      console.log(`Debug: Fetched ${fetchedProducts.length} products`)
    } catch (err: any) {
      setError(err.message || "Failed to fetch products")
      console.error("Debug: Error fetching products", err)
    } finally {
      setLoading(false)
    }
  }

  // Add test product for debugging
  const addTestProduct = async (category: string) => {
    try {
      setAddingProduct(true)

      // Create a random product
      const testProduct = {
        name: `Test ${category} ${Math.floor(Math.random() * 1000)}`,
        description: `This is a test product for category ${category}`,
        category: category,
        price: Math.floor(Math.random() * 200) + 50,
        mrp: Math.floor(Math.random() * 300) + 100,
        unit: ['kg', 'g', 'pcs', 'L'][Math.floor(Math.random() * 4)],
        image: '/placeholder.svg',
        vendorId: 'test-vendor-id',
        pincodes: [pincode],
        stock: Math.floor(Math.random() * 100) + 10,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      // Add to Firestore
      const docRef = await addDoc(collection(db, "products"), testProduct)

      toast({
        title: "Test Product Added",
        description: `Added test product with ID: ${docRef.id}`
      })

      // Refresh product list
      fetchProducts()
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to add test product",
        description: err.message
      })
    } finally {
      setAddingProduct(false)
    }
  }

  useEffect(() => {
    if (pincode) {
      fetchProducts()
    }
  }, [pincode])

  if (!expanded) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 border-yellow-300"
        onClick={() => setExpanded(true)}
      >
        <AlertCircle size={16} className="mr-2" />
        Product Debug
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-auto bg-white shadow-lg rounded-lg border p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Product Debug</h2>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" onClick={fetchProducts} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setExpanded(false)}>
            ✕
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="w-full">
          <TabsTrigger value="info">Product Info</TabsTrigger>
          <TabsTrigger value="test">Test Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="mb-2">
            <span className="font-medium">Current Pincode:</span> {pincode || "Not set"}
          </div>

          <div className="mb-2">
            <span className="font-medium">Products Found:</span> {products.length}
          </div>

          {error && (
            <div className="p-2 mb-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {products.length > 0 ? (
            <div>
              <h3 className="font-medium mb-1">Categories:</h3>
              <ul className="mb-3 text-sm">
                {Array.from(new Set(products.map(p => p.category))).map(category => (
                  <li key={category as string} className="mb-1">
                    {category as string}: {products.filter(p => p.category === category).length} products
                  </li>
                ))}
              </ul>

              <h3 className="font-medium mb-1">First 3 Products:</h3>
              <ul className="text-xs">
                {products.slice(0, 3).map(product => (
                  <li key={product.id} className="p-1 bg-gray-50 mb-1 rounded">
                    {product.name} - {product.category} - ₹{product.price}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {loading ? "Loading products..." : "No products found"}
            </div>
          )}
        </TabsContent>

        <TabsContent value="test">
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Add test products to the database to verify display functionality.
              Products will be added for the current pincode: <strong>{pincode}</strong>
            </p>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-auto py-2"
                onClick={() => addTestProduct("fruits-vegetables")}
                disabled={addingProduct}
              >
                <Plus size={14} className="mr-1" />
                Fruits & Vegetables
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto py-2"
                onClick={() => addTestProduct("dairy-bread-eggs")}
                disabled={addingProduct}
              >
                <Plus size={14} className="mr-1" />
                Dairy & Bread
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto py-2"
                onClick={() => addTestProduct("grocery")}
                disabled={addingProduct}
              >
                <Plus size={14} className="mr-1" />
                Grocery
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto py-2"
                onClick={() => addTestProduct("bakery")}
                disabled={addingProduct}
              >
                <Plus size={14} className="mr-1" />
                Bakery
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="space-y-4">
            <div className="mb-2">
              <span className="font-medium">Current Pincode:</span> {pincode || "Not set"}
            </div>

            {loading ? (
              <div className="text-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                <p className="text-sm text-gray-500 mt-2">Loading categories...</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Categories by Count:</h3>
                  <div className="border rounded p-2 space-y-1">
                    {Array.from(new Set(products.map(p => p.category))).map(category => (
                      <div key={category as string} className="flex justify-between items-center border-b last:border-b-0 py-1">
                        <span className="text-sm">
                          {category as string}
                        </span>
                        <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                          {products.filter(p => p.category === category).length} products
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Vendor Distribution:</h3>
                  <div className="border rounded p-2 space-y-1">
                    {Array.from(new Set(products.map(p => p.vendorId))).map(vendorId => (
                      <div key={vendorId as string} className="text-sm flex justify-between">
                        <span>Vendor ID: {(vendorId as string).substring(0, 8)}...</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          {products.filter(p => p.vendorId === vendorId).length} products
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 