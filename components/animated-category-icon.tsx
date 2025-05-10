"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface AnimatedCategoryIconProps {
  name: string
  icon: string
  isActive?: boolean
}

export default function AnimatedCategoryIcon({ name, icon, isActive = false }: AnimatedCategoryIconProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Animation variants
  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } },
    active: {
      scale: 1.1,
      y: [0, -5, 0],
      transition: { repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 1.5 },
    },
  }

  return (
    <motion.div
      className="flex flex-col items-center"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial="initial"
      animate={isActive ? "active" : isHovered ? "hover" : "initial"}
      variants={iconVariants}
    >
      <div className="relative w-16 h-16 mb-2">
        <Image src={icon || "/placeholder.svg"} alt={name} width={64} height={64} className="object-contain" />
      </div>
      <span className="text-sm text-center font-medium text-gray-800">{name}</span>
    </motion.div>
  )
}
