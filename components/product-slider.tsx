"use client"
import AnimatedProductCard from "@/components/animated-product-card"
import { useCart } from "@/lib/hooks/use-cart"

// Mock data - in a real app, this would come from Firebase
const mockProducts = {
  "fruits-vegetables": [
    { id: "f1", name: "Fresh Apples", price: 120, unit: "1 kg", image: "/placeholder.svg?height=200&width=200" },
    { id: "f2", name: "Bananas", price: 60, unit: "1 dozen", image: "/placeholder.svg?height=200&width=200" },
    { id: "f3", name: "Tomatoes", price: 40, unit: "500 g", image: "/placeholder.svg?height=200&width=200" },
    { id: "f4", name: "Onions", price: 35, unit: "1 kg", image: "/placeholder.svg?height=200&width=200" },
    { id: "f5", name: "Potatoes", price: 30, unit: "1 kg", image: "/placeholder.svg?height=200&width=200" },
    { id: "f6", name: "Carrots", price: 50, unit: "500 g", image: "/placeholder.svg?height=200&width=200" },
  ],
  "dairy-bread-eggs": [
    { id: "d1", name: "Milk", price: 60, unit: "1 L", image: "/placeholder.svg?height=200&width=200" },
    { id: "d2", name: "Bread", price: 40, unit: "400 g", image: "/placeholder.svg?height=200&width=200" },
    { id: "d3", name: "Eggs", price: 80, unit: "12 pcs", image: "/placeholder.svg?height=200&width=200" },
    { id: "d4", name: "Cheese", price: 120, unit: "200 g", image: "/placeholder.svg?height=200&width=200" },
    { id: "d5", name: "Butter", price: 90, unit: "100 g", image: "/placeholder.svg?height=200&width=200" },
    { id: "d6", name: "Yogurt", price: 40, unit: "400 g", image: "/placeholder.svg?height=200&width=200" },
  ],
}

export default function ProductSlider({ category }: { category: string }) {
  const { addToCart } = useCart()
  const products = mockProducts[category as keyof typeof mockProducts] || []

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
      {products.map((product) => (
        <AnimatedProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
      ))}
    </div>
  )
}
