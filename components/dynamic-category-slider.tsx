"use client"
import { useState, useEffect } from "react"
import { usePincode } from "@/lib/hooks/use-pincode"
import { getCategoriesByPincode } from "@/lib/firebase/firestore"
import ProductSlider from "@/components/product-slider"
import { Loader2 } from "lucide-react"

// Map of category IDs to display names
const categoryDisplayNames: Record<string, string> = {
  "fruits-vegetables": "Fruits & Vegetables",
  "dairy": "Dairy Products",
  "bakery": "Bakery",
  "meat": "Meat & Poultry",
  "grocery": "Grocery & Staples",
  "dairy-bread-eggs": "Dairy, Bread & Eggs",
  "masala-oils": "Masala and Oils",
  "drinks-juice": "Drinks and Juice",
  "namkeen-biscuits": "Namkeen and Biscuits",
  "dry-fruits": "Dry Fruits",
  "pharma-wellness": "Pharma and Wellness",
  "cleaning-essentials": "Cleaning Essentials",
  "aata-dal-rice": "Aataa Dal Rice",
  "organic": "Organic & Healthy"
}

export default function DynamicCategorySlider() {
  const { pincode } = usePincode()
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      if (!pincode) {
        setCategories([])
        setIsLoading(false)
        return
      }

      try {
        const availableCategories = await getCategoriesByPincode(pincode)
        setCategories(availableCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [pincode])

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        No products available for your location. Please try another pincode.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {categories.map(categoryId => (
        <div key={categoryId} className="my-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {categoryDisplayNames[categoryId] ||
                categoryId.split("-").map(word =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(" ")}
            </h2>
            <a href={`/category/${categoryId}`} className="text-green-600 font-medium">
              see all
            </a>
          </div>
          <ProductSlider category={categoryId} />
        </div>
      ))}
    </div>
  )
} 