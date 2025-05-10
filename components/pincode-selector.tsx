"use client"

import type React from "react"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function PincodeSelector() {
  const [pincode, setPincode] = useState("110001")
  const [inputPincode, setInputPincode] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputPincode.length === 6 && /^\d+$/.test(inputPincode)) {
      setPincode(inputPincode)
      setOpen(false)
    }
  }

  return (
    <div className="py-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-blue-600 p-0 h-auto font-normal">
            <MapPin size={16} className="mr-1" />
            <span>Please select the pincode. </span>
            <span className="font-medium ml-1">Change Pincode</span>
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
