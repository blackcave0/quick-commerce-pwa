"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  name: string
  price: number
  unit: string
  image: string
}

interface AnimatedProductCardProps {
  product: Product
  onAddToCart: () => void
}

export default function AnimatedProductCard({ product, onAddToCart }: AnimatedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Animation variants
  const cardVariants = {
    initial: { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
    hover: {
      y: -5,
      boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 },
    },
  }

  const imageVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        duration: 0.5,
      },
    },
  }

  return (
    <motion.div
      className="min-w-[180px] p-4 border rounded-lg bg-white flex flex-col h-full"
      variants={cardVariants}
      initial="initial"
      animate={isHovered ? "hover" : "initial"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="group flex-1">
        <div className="relative h-32 w-full mb-2 overflow-hidden">
          <motion.div
            variants={imageVariants}
            initial="initial"
            animate={isHovered ? "hover" : "initial"}
            className="h-full w-full"
          >
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
          </motion.div>
        </div>
        <h3 className="font-medium text-gray-800 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.unit}</p>
      </Link>
      <div className="flex justify-between items-center mt-auto pt-2">
        <span className="font-bold">₹{product.price}</span>
        <motion.div variants={buttonVariants} initial="initial" animate={isHovered ? "hover" : "initial"}>
          <Button
            size="icon"
            className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600"
            onClick={(e) => {
              e.preventDefault()
              onAddToCart()
            }}
          >
            <Plus size={16} />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
