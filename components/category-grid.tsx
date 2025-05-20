"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import AnimatedCategoryIcon from "./animated-category-icon"
import { usePincode } from "@/lib/hooks/use-pincode"
import { getCategoriesByPincode } from "@/lib/firebase/firestore"
import { Loader2 } from "lucide-react"

const categories = [
  { id: "fruits-vegetables", name: "Fruits & Vegetables", icon: "/icons/fruits.png" },
  { id: "dairy-bread-eggs", name: "Dairy, Bread & Eggs", icon: "/icons/dairy.png" },
  { id: "bakery", name: "Bakery", icon: "/icons/bakery.png" },
  { id: "meat-fish", name: "Meat & Fish", icon: "/icons/meat.png" },
  { id: "masala-oils", name: "Masala and Oils", icon: "/icons/grocery.png" },
  { id: "cleaning-essentials", name: "Cleaning Essentials", icon: "/icons/cleaning.png" },
  { id: "drinks-juice", name: "Drinks and Juice", icon: "/icons/fruits.png" },
  { id: "namkeen-biscuits", name: "Namkeen and Biscuits", icon: "/icons/bakery.png" },
  { id: "dry-fruits", name: "Dry Fruits", icon: "/icons/grocery.png" },
  { id: "pharma-wellness", name: "Pharma and Wellness", icon: "/icons/cleaning.png" },
  { id: "aata-dal-rice", name: "Aataa Dal Rice", icon: "/icons/grocery.png" },
  { id: "organic", name: "Organic & Healthy", icon: "/icons/fruits.png" },
  { id: "dairy", name: "Dairy Products", icon: "/icons/dairy.png" },
  { id: "grocery", name: "Grocery & Staples", icon: "/icons/grocery.png" },
]

export default function CategoryGrid() {
  const { pincode } = usePincode()
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      if (!pincode) {
        setAvailableCategories([])
        setIsLoading(false)
        return
      }

      try {
        const categoryIds = await getCategoriesByPincode(pincode)
        setAvailableCategories(categoryIds)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setAvailableCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [pincode])

  // Filter categories to only show those with products
  const filteredCategories = categories.filter(category =>
    availableCategories.includes(category.id)
  )

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (filteredCategories.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        No categories available for your location. Please try another pincode.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {filteredCategories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.id}`}
          className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <AnimatedCategoryIcon name={category.name} icon={category.icon} />
        </Link>
      ))}
    </div>
  )
}
