"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/hooks/use-cart"
import { useAuth } from "@/lib/context/auth-context"
import { useFirebase } from "@/lib/context/firebase-provider"
import { LoginModal } from "./auth/login-modal"

export default function Header() {
  const { cartItems, cartCount } = useCart()
  const { user, signOut, loading: authLoading } = useAuth()
  const { isAuthInitialized, isLoading: firebaseLoading } = useFirebase()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only show auth UI after component has mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  // Determine if we're in a loading state
  const loading = !mounted || firebaseLoading || authLoading || !isAuthInitialized

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.webp" alt="buzzNT" width={120} height={40} className="h-10" priority />
        </Link>

        <div className="hidden md:flex relative w-1/2 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder="Search for groceries..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-700">
                  <User size={20} className="mr-2" />
                  <span className="hidden md:inline">{user.phoneNumber}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/addresses">Addresses</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700"
              onClick={() => setShowLoginModal(true)}
              disabled={!isAuthInitialized}
            >
              <User size={20} className="mr-2" />
              <span className="hidden md:inline">Login</span>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <div className="h-full flex flex-col">
                <h2 className="text-xl font-bold mb-4">Your Cart</h2>
                {cartItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <ShoppingCart size={64} className="text-gray-300 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <Button className="mt-4 bg-green-500 hover:bg-green-600">Start Shopping</Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-auto">{/* Cart items would go here */}</div>
                    <div className="border-t pt-4 mt-auto">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>₹0.00</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span>Delivery Fee</span>
                        <span>₹40.00</span>
                      </div>
                      <div className="flex justify-between font-bold mb-4">
                        <span>Total</span>
                        <span>₹40.00</span>
                      </div>
                      <Button className="w-full bg-green-500 hover:bg-green-600">Proceed to Checkout</Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="md:hidden container mx-auto px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder="Search for groceries..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300"
          />
        </div>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </header>
  )
}
