"use client"

import { useState, useEffect } from "react"

// Default pincode to use if none is stored
const DEFAULT_PINCODE = "332211"

export const usePincode = () => {
  const [pincode, setPincode] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  // Load pincode from localStorage on client side
  useEffect(() => {
    const storedPincode = localStorage.getItem("pincode")
    setPincode(storedPincode || DEFAULT_PINCODE)
    setIsLoading(false)
  }, [])

  // Save pincode to localStorage when it changes
  const updatePincode = (newPincode: string) => {
    setPincode(newPincode)
    localStorage.setItem("pincode", newPincode)
  }

  return {
    pincode,
    updatePincode,
    isLoading
  }
} 