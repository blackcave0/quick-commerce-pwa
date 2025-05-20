import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname
  
  // Skip middleware for auth-check page which is used for debugging
  if (path === '/vendor/auth-check') {
    console.log("Middleware: Skipping auth check for debug page");
    return NextResponse.next()
  }
  
  // Check if request is for vendor pages (excluding login)
  const isVendorPage = path.startsWith('/vendor') && path !== '/vendor/login'
  
  // Get session token from cookies
  const sessionToken = request.cookies.get('session')?.value
  
  // Check for Firebase auth token which may be stored differently
  const firebaseToken = request.cookies.get('firebaseToken')?.value
  
  // Check if we're in development mode
  const isDevMode = process.env.NODE_ENV === 'development'
  
  // Check for test mode cookie which we'll set for the test account
  const testMode = request.cookies.get('testMode')?.value === 'true'
  
  // Log authentication info for debugging
  console.log(`Middleware: Path=${path}, Session=${sessionToken ? 'exists' : 'none'}, TestMode=${testMode}`);
  
  // In development, we'll bypass auth for the test account
  if (isDevMode && testMode && isVendorPage) {
    console.log("Middleware: Allowing access for test account");
    return NextResponse.next()
  }
  
  // If trying to access vendor pages without a token, redirect to login
  if (isVendorPage && !sessionToken && !firebaseToken) {
    console.log("Middleware: Redirecting to login page - no auth token found");
    const url = new URL('/vendor/login', request.url)
    // Add the original URL as a query parameter for redirection after login
    url.searchParams.set('redirect', encodeURIComponent(request.nextUrl.pathname))
    return NextResponse.redirect(url)
  }
  
  // If already logged in and trying to access login page, redirect to dashboard
  if (path === '/vendor/login' && (sessionToken || firebaseToken || (isDevMode && testMode))) {
    console.log("Middleware: Redirecting to dashboard - user already logged in");
    
    // Check if there's a redirect URL in the query parameters
    const redirectUrl = request.nextUrl.searchParams.get('redirect')
    const url = new URL(redirectUrl ? decodeURIComponent(redirectUrl) : '/vendor', request.url)
    
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

// Specify the paths that the middleware should run on
export const config = {
  matcher: ['/vendor/:path*'],
} 