import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import Header from "@/components/header"
import AddToCartButton from "@/components/add-to-cart-button"

// Mock data - in a real app, this would come from Firebase
const allProducts = {
  f1: {
    id: "f1",
    name: "Fresh Apples",
    price: 120,
    unit: "1 kg",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Fresh and juicy apples sourced directly from the orchards. Rich in fiber and vitamin C, these apples are perfect for snacking, baking, or adding to salads.",
    category: "fruits-vegetables",
  },
  d1: {
    id: "d1",
    name: "Milk",
    price: 60,
    unit: "1 L",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Fresh pasteurized milk with essential nutrients. Rich in calcium and protein, it's perfect for your daily nutrition needs.",
    category: "dairy-bread-eggs",
  },
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = allProducts[params.id as keyof typeof allProducts]

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="text-green-500 hover:text-green-600 font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Link
          href={`/category/${product.category}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft size={20} />
          <span>
            Back to{" "}
            {product.category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </span>
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative aspect-square">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-500 mb-4">{product.unit}</p>

              <div className="text-3xl font-bold mb-6">₹{product.price}</div>

              <p className="text-gray-700 mb-8">{product.description}</p>

              <AddToCartButton product={product} className="mt-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
