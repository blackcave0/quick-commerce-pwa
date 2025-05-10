"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { onAuthStateChange } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"
import { signInVendor, signOutVendor, getCurrentVendorData } from "@/lib/firebase/vendor-auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"

// Vendor types
export interface VendorProfile {
  id: string
  name: string
  email: string
  phone: string
  address: string
  pincode: string
  fssai?: string
  gstin?: string
  isOpen: boolean
  status: "active" | "pending" | "blocked"
}

interface VendorContextType {
  isLoading: boolean
  isAuthenticated: boolean
  vendor: VendorProfile | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: Error }>
  logout: () => Promise<{ success: boolean; error?: Error }>
  refreshVendorData: () => Promise<void>
}

const VendorContext = createContext<VendorContextType>({
  isLoading: false,
  isAuthenticated: false,
  vendor: null,
  login: async () => ({ success: false }),
  logout: async () => ({ success: false }),
  refreshVendorData: async () => { },
})

export const VendorProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [vendor, setVendor] = useState<VendorProfile | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  // Set isMounted to true when component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true)
    console.log("Vendor provider mounted");
  }, [])

  // Fetch vendor data when user is authenticated
  const fetchVendorData = async (userId: string) => {
    try {
      // For development test account
      if (process.env.NODE_ENV === 'development' && userId === 'test-vendor-id') {
        console.log("Using test vendor data in development mode");
        const testVendor: VendorProfile = {
          id: 'test-vendor-id',
          name: 'Test Vendor',
          email: 'test@example.com',
          phone: '1234567890',
          address: 'Test Address',
          pincode: '123456',
          isOpen: true,
          status: "active"
        };
        setVendor(testVendor);
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      const vendorDoc = await getDoc(doc(db, "vendors", userId))

      if (vendorDoc.exists()) {
        const vendorData = vendorDoc.data() as Omit<VendorProfile, "id">
        setVendor({
          id: vendorDoc.id,
          ...vendorData,
        })
        setIsAuthenticated(true)
      } else {
        // If vendor data doesn't exist, sign out
        await signOutVendor()
        setIsAuthenticated(false)
        setVendor(null)
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error)
      setIsAuthenticated(false)
      setVendor(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh vendor data (used after profile updates)
  const refreshVendorData = async () => {
    try {
      const result = await getCurrentVendorData()
      if (result.success && result.vendorData) {
        setVendor(result.vendorData as VendorProfile)
      }
    } catch (error) {
      console.error("Error refreshing vendor data:", error)
    }
  }

  // Check auth state on mount (client-side only)
  useEffect(() => {
    if (isMounted) {
      setIsLoading(true)
      let unsubscribed = false;

      console.log("Setting up auth state listener");

      const unsubscribe = onAuthStateChange(async (user) => {
        if (unsubscribed) return;

        console.log("Auth state changed:", user ? `User: ${user.uid}` : "No user");

        if (user) {
          await fetchVendorData(user.uid)
        } else {
          setIsAuthenticated(false)
          setVendor(null)
          setIsLoading(false)
        }
      })

      return () => {
        unsubscribed = true;
        unsubscribe()
      }
    }
  }, [isMounted]);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("Attempting login with:", email);

      // Special case for test account in development
      if (process.env.NODE_ENV === 'development' && email === 'test@example.com' && password === 'password') {
        console.log("Using test vendor account in development");

        // Set vendor data directly for test account
        const testVendor: VendorProfile = {
          id: 'test-vendor-id',
          name: 'Test Vendor',
          email: 'test@example.com',
          phone: '1234567890',
          address: 'Test Address',
          pincode: '123456',
          isOpen: true,
          status: "active"
        };

        setVendor(testVendor);
        setIsAuthenticated(true);

        console.log("Test account login successful - auth state updated");

        return { success: true };
      }

      const result = await signInVendor(email, password)

      if (result.success && result.vendorData) {
        setVendor(result.vendorData as VendorProfile)
        setIsAuthenticated(true)
        console.log("Vendor authenticated successfully");
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: new Error(error.message || "Login failed") }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setIsLoading(true)
    try {
      // For test account in development mode
      if (process.env.NODE_ENV === 'development' && vendor?.email === 'test@example.com') {
        console.log("Logging out test vendor account");
        setIsAuthenticated(false);
        setVendor(null);

        // Navigation will be handled by login page
        return { success: true };
      }

      const result = await signOutVendor()
      if (result.success) {
        setIsAuthenticated(false)
        setVendor(null)
      }
      return result
    } catch (error: any) {
      return { success: false, error: new Error(error.message || "Logout failed") }
    } finally {
      setIsLoading(false)
    }
  }

  // Debug state changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Vendor auth state:", { isAuthenticated, vendorId: vendor?.id });
    }
  }, [isAuthenticated, vendor]);

  return (
    <VendorContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        vendor,
        login,
        logout,
        refreshVendorData,
      }}
    >
      {children}
    </VendorContext.Provider>
  )
}

export const useVendor = () => useContext(VendorContext) 