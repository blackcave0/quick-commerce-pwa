"use client"

import { useEffect, useState } from "react"
import { useVendor } from "@/lib/context/vendor-provider"
import Link from "next/link"

export default function VendorAuthCheck() {
  const { isAuthenticated, vendor, isLoading } = useVendor()
  const [timeElapsed, setTimeElapsed] = useState(0)
  
  // Simple timer to track how long we've been on this page
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Manual navigation function using window.location
  const goToDashboard = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/vendor'
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Vendor Auth Check</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="font-semibold">Authentication Status:</p>
            <p className={isAuthenticated ? "text-green-600" : "text-red-600"}>
              {isAuthenticated ? "Authenticated ✓" : "Not Authenticated ✗"}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="font-semibold">Loading State:</p>
            <p>{isLoading ? "Loading..." : "Not Loading"}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="font-semibold">Vendor Data:</p>
            {vendor ? (
              <ul className="space-y-1 mt-2">
                <li>ID: {vendor.id}</li>
                <li>Name: {vendor.name}</li>
                <li>Email: {vendor.email}</li>
                <li>Status: {vendor.status}</li>
              </ul>
            ) : (
              <p className="text-gray-500">No vendor data available</p>
            )}
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="font-semibold">Time on page:</p>
            <p>{timeElapsed} seconds</p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button 
            onClick={goToDashboard}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Go to Dashboard (window.location)
          </button>
          
          <Link href="/vendor" className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition text-center">
            Go to Dashboard (Link)
          </Link>
          
          {!isAuthenticated && (
            <Link href="/vendor/login" className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition text-center">
              Go to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
} 