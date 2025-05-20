"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { usePincode } from "@/lib/hooks/use-pincode"

export default function PincodeSelector() {
  const { pincode, updatePincode, isLoading } = usePincode()
  const [inputPincode, setInputPincode] = useState("")
  const [open, setOpen] = useState(false)

  // Update input pincode when pincode changes
  useEffect(() => {
    if (pincode) {
      setInputPincode(pincode)
    }
  }, [pincode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputPincode.length === 6 && /^\d+$/.test(inputPincode)) {
      updatePincode(inputPincode)
      setOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-4">
        <Button variant="ghost" className="text-blue-600 p-0 h-auto font-normal" disabled>
          <MapPin size={16} className="mr-1" />
          <span>Loading...</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="py-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-blue-600 p-0 h-auto font-normal">
            <MapPin size={16} className="mr-1" />
            <span>Delivery to: </span>
            <span className="font-medium ml-1">{pincode}</span>
            <span className="font-medium ml-1 text-green-600">Change</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your delivery pincode</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter 6-digit pincode"
              value={inputPincode}
              onChange={(e) => setInputPincode(e.target.value)}
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
            />
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600"
              disabled={inputPincode.length !== 6 || !/^\d+$/.test(inputPincode)}
            >
              Continue
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
