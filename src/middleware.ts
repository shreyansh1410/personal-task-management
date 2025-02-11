import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import * as jose from 'jose'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || 
                request.headers.get("Authorization")?.replace("Bearer ", "")

  if (!token) {
    console.log("No token found, redirecting to login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Create a TextEncoder
    const encoder = new TextEncoder()
    
    // Convert JWT_SECRET to Uint8Array
    const secret = encoder.encode(process.env.JWT_SECRET!)

    // Verify the token
    await jose.jwtVerify(token, secret)
    
    const response = NextResponse.next()
    return response
  } catch (error) {
    console.log("Token verification failed:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"]
}