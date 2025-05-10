import { Suspense } from "react"
import Header from "@/components/header"
import PincodeSelector from "@/components/pincode-selector"
import CategoryGrid from "@/components/category-grid"
import FeaturedBanner from "@/components/featured-banner"
import ProductSlider from "@/components/product-slider"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 pb-20">
        <PincodeSelector />
        <Suspense fallback={<BannerSkeleton />}>
          <FeaturedBanner />
        </Suspense>
        <div className="my-6">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Shop by Category</h2>
          <Suspense fallback={<CategorySkeleton />}>
            <CategoryGrid />
          </Suspense>
        </div>
        <div className="my-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Fruits & Vegetables</h2>
            <a href="/category/fruits-vegetables" className="text-green-600 font-medium">
              see all
            </a>
          </div>
          <Suspense fallback={<ProductSliderSkeleton />}>
            <ProductSlider category="fruits-vegetables" />
          </Suspense>
        </div>
        <div className="my-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Dairy, Bread & Eggs</h2>
            <a href="/category/dairy-bread-eggs" className="text-green-600 font-medium">
              see all
            </a>
          </div>
          <Suspense fallback={<ProductSliderSkeleton />}>
            <ProductSlider category="dairy-bread-eggs" />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

function BannerSkeleton() {
  return <div className="w-full h-48 rounded-lg bg-gray-200 animate-pulse" />
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array(12)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-4 w-20 mt-2" />
          </div>
        ))}
    </div>
  )
}

function ProductSliderSkeleton() {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="min-w-[180px] p-4 border rounded-lg bg-white">
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 mt-2" />
            <Skeleton className="h-4 w-1/2 mt-2" />
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
    </div>
  )
}
