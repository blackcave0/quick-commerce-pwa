"use client"
import { useState, useEffect } from "react"
import AnimatedProductCard from "@/components/animated-product-card"
import { useCart } from "@/lib/hooks/use-cart"
import { getProductsByPincode } from "@/lib/firebase/firestore"
import { usePincode } from "@/lib/hooks/use-pincode"
import { Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  unit: string
  image: string
}

export default function ProductGrid({ category }: { category: string }) {
  const { addToCart } = useCart()
  const { pincode } = usePincode()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      if (!pincode) {
        setProducts([])
        setIsLoading(false)
        return
      }

      try {
        // Get all products for this pincode
        const allProducts = await getProductsByPincode(pincode)

        // Filter products by category
        const categoryProducts = allProducts.filter(p => p.category === category)

        // Type cast to ensure compatibility with our Product interface
        setProducts(categoryProducts.map(p => ({
          id: p.id || '',
          name: p.name,
          price: p.price,
          unit: p.unit,
          image: p.image
        })))

        console.log(`Fetched ${categoryProducts.length} products for category ${category} in pincode ${pincode} for grid view`)
      } catch (error) {
        console.error(`Error fetching products for category ${category}:`, error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [category, pincode])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No products available in this category for your location.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <AnimatedProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
      ))}
    </div>
  )
}
