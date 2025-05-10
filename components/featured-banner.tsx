"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function FeaturedBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  }

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
        delay: 0.5,
      },
    },
  }

  return (
    <motion.div
      className="w-full rounded-lg overflow-hidden relative"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <Link href="/category/fruits-vegetables">
        <div className="relative aspect-[21/9] md:aspect-[21/6]">
          <Image
            src="/placeholder.svg?height=400&width=1200"
            alt="Fresh Fruits & Vegetables"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8">
            <motion.div
              className="bg-green-500 text-white px-4 py-1 rounded-full inline-block mb-4 w-fit"
              variants={badgeVariants}
            >
              GREAT PRICES
            </motion.div>

            <motion.h1 className="text-3xl md:text-5xl font-bold text-white mb-4" variants={itemVariants}>
              Fruits & vegetables
            </motion.h1>

            <motion.div className="flex space-x-4" variants={itemVariants}>
              <div className="bg-white/90 rounded-full p-2 flex items-center">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Farm fresh"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Farm fresh</span>
              </div>
              <div className="bg-white/90 rounded-full p-2 flex items-center">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Clean & hygienic"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Clean & hygienic</span>
              </div>
              <div className="bg-white/90 rounded-full p-2 flex items-center">
                <Image src="/placeholder.svg?height=40&width=40" alt="Safe" width={40} height={40} className="mr-2" />
                <span className="text-sm font-medium">Safe</span>
              </div>
            </motion.div>

            <motion.button
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-full w-fit"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Order now →
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
