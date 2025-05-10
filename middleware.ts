import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname
  
  // Skip middleware for auth-check page which is used for debugging
  if (path === '/vendor/auth-check') {
    return NextResponse.next()
  }
  
  // Check if request is for vendor pages (excluding login)
  const isVendorPage = path.startsWith('/vendor') && path !== '/vendor/login'
  
  // Get session token from cookies
  const token = request.cookies.get('session')?.value
  
  // Check for Firebase auth token which may be stored differently
  const firebaseToken = request.cookies.get('firebaseToken')?.value
  
  // Check if we're in development mode
  const isDevMode = process.env.NODE_ENV === 'development'
  
  // Check for test mode cookie which we'll set for the test account
  const testMode = request.cookies.get('testMode')?.value === 'true'
  
  // In development, we'll bypass auth for the test account
  if (isDevMode && testMode && isVendorPage) {
    return NextResponse.next()
  }
  
  // If trying to access vendor pages without a token, redirect to login
  if (isVendorPage && !token && !firebaseToken) {
    console.log("Middleware: Redirecting to login page - no auth token found");
    const url = new URL('/vendor/login', request.url)
    return NextResponse.redirect(url)
  }
  
  // If already logged in and trying to access login page, redirect to dashboard
  if (path === '/vendor/login' && (token || firebaseToken || (isDevMode && testMode))) {
    console.log("Middleware: Redirecting to dashboard - user already logged in");
    const url = new URL('/vendor', request.url)
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

// Specify the paths that the middleware should run on
export const config = {
  matcher: ['/vendor/:path*'],
} 