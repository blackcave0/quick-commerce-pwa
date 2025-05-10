"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data - in a real app, this would come from Firebase
const categories = [
  { id: "fruits-vegetables", name: "Fruits & Vegetables" },
  { id: "dairy", name: "Dairy" },
  { id: "bakery", name: "Bakery" },
  { id: "meat", name: "Meat & Poultry" },
  { id: "grocery", name: "Grocery & Staples" },
]

const pincodes = [
  { id: "110001", name: "110001 - Connaught Place" },
  { id: "110002", name: "110002 - Darya Ganj" },
  { id: "110003", name: "110003 - Aliganj" },
  { id: "110004", name: "110004 - Ansari Nagar" },
  { id: "110005", name: "110005 - Babar Road" },
]

export default function AddProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPincodes, setSelectedPincodes] = useState<string[]>([])

  const handlePincodeChange = (pincodeId: string) => {
    setSelectedPincodes((prev) =>
      prev.includes(pincodeId) ? prev.filter((id) => id !== pincodeId) : [...prev, pincodeId],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, this would submit the product to Firebase

    setTimeout(() => {
      router.push("/vendor/products")
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Enter the basic details of your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" required />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} required />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>Set the price and manage inventory.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" min="0" step="0.01" required />
              </div>

              <div>
                <Label htmlFor="mrp">MRP (₹)</Label>
                <Input id="mrp" type="number" min="0" step="0.01" required />
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" type="number" min="0" required />
              </div>

              <div>
                <Label htmlFor="unit">Unit (e.g., kg, pcs, dozen)</Label>
                <Input id="unit" required />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>Select the pincodes where this product will be available.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pincodes.map((pincode) => (
                  <div key={pincode.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`pincode-${pincode.id}`}
                      checked={selectedPincodes.includes(pincode.id)}
                      onCheckedChange={() => handlePincodeChange(pincode.id)}
                    />
                    <Label htmlFor={`pincode-${pincode.id}`} className="cursor-pointer">
                      {pincode.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600"
              disabled={isSubmitting || selectedPincodes.length === 0}
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
