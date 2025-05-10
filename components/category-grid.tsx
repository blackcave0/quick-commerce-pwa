import Link from "next/link"
import AnimatedCategoryIcon from "./animated-category-icon"

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
]

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
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
