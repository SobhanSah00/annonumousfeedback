import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl

  // If token exists
  if (token) {
    // Redirect users to the dashboard if they are accessing public pages
    if (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname === '/' || // root path
      url.pathname.startsWith('/verify')
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // If the token exists and the user is accessing protected routes, let them proceed
    return NextResponse.next()
  }

  // If no token and trying to access protected routes, redirect to sign-in
  if (
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/verify')
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // If no token and accessing public pages, let them proceed
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ]
}
