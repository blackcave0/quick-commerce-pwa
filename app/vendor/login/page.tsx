"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useVendor } from "@/lib/context/vendor-provider"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DirectTestLogin from "./direct-test-login"

export default function VendorLogin() {
  const { login, isLoading, isAuthenticated, vendor } = useVendor()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showDevHelp, setShowDevHelp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Helper function to set cookies
  const setCookie = (name: string, value: string, days: number) => {
    if (typeof document === 'undefined') return;
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  // Check if already logged in and redirect
  useEffect(() => {
    if (isAuthenticated && vendor) {
      console.log("Already authenticated, attempting direct navigation to dashboard");

      // Set test mode cookie if using test account
      if (process.env.NODE_ENV === 'development' && vendor.id === 'test-vendor-id') {
        console.log("Setting test mode cookie for middleware bypass");
        setCookie('testMode', 'true', 1);
      }

      // Try both methods for redirection to ensure it works
      try {
        router.push("/vendor");
      } catch (e) {
        console.error("Router push failed:", e);
      }

      // Use a direct window location change as a fallback
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          console.log("Forcing redirection via window.location");
          window.location.href = "/vendor";
        }
      }, 500);
    }
  }, [isAuthenticated, vendor, router]);

  // Check if we're in development mode without Firebase configuration
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development'

    if (isDev) {
      console.log("Running in development mode")
      const hasMissingEnvVars =
        !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

      setShowDevHelp(hasMissingEnvVars)

      if (hasMissingEnvVars) {
        console.log("Firebase configuration missing. Using test account is enabled.")

        // Pre-fill test credentials in development mode for easier testing
        setEmail("test@example.com")
        setPassword("password")
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    // For dev mode test account, log information
    if (email === "test@example.com" && password === "password") {
      console.log("Attempting to login with test account")
    }

    try {
      console.log("Logging in with email:", email)
      const result = await login(email, password)

      if (result.success) {
        console.log("Login successful, forcing navigation to vendor dashboard")

        // Set test mode cookie if using test account
        if (process.env.NODE_ENV === 'development' && email === 'test@example.com') {
          console.log("Setting test mode cookie for middleware bypass");
          setCookie('testMode', 'true', 1);

          // Also set a session cookie for the middleware
          setCookie('session', 'test-session', 1);
        }

        // Try both methods for redirection to ensure it works
        try {
          router.push("/vendor");
        } catch (e) {
          console.error("Router push failed:", e);
        }

        // Use a direct window location change as a fallback with a slight delay
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            console.log("Forcing redirection via window.location");
            window.location.href = "/vendor";
          }
        }, 500);
      } else if (result.error) {
        console.error("Login failed:", result.error)
        setError(result.error.message)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Failed to login. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Use the test credentials automatically in development mode
  const useTestCredentials = () => {
    setEmail("test@example.com")
    setPassword("password")
  }

  // Direct login handler for test account
  const handleTestLogin = () => {
    console.log("Using direct test account login");
    setEmail("test@example.com");
    setPassword("password");

    // Set test cookie directly
    setCookie('testMode', 'true', 1);
    setCookie('session', 'test-session', 1);

    // Attempt immediate redirection
    if (typeof window !== 'undefined') {
      window.location.href = "/vendor";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Vendor Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your vendor dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {showDevHelp && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Development Mode</AlertTitle>
              <AlertDescription>
                <p>Firebase configuration is missing or invalid.</p>
                <p className="mt-2">Test credentials have been pre-filled for you:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Email: test@example.com</li>
                  <li>Password: password</li>
                </ul>
                <p className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestLogin}
                    className="mt-1"
                  >
                    Login with Test Account
                  </Button>
                </p>
                <p className="mt-2 text-xs">To configure Firebase, create a .env.local file in the project root with your Firebase credentials.</p>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Emergency bypass for development mode */}
          {process.env.NODE_ENV === 'development' && <DirectTestLogin />}
        </CardContent>
      </Card>
    </div>
  )
} 