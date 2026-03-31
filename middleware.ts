import { updateSession } from "@/lib/supabase/proxy"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // Update session and get response
  const response = await updateSession(request)
  
  // Protected routes that require authentication
  const protectedPaths = ["/dashboard", "/workouts", "/nutrition", "/progress", "/coach", "/profile"]
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // If accessing protected route, the layout will handle the redirect
  // The updateSession ensures cookies are refreshed
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - frames folder (animation frames)
     */
    "/((?!_next/static|_next/image|favicon.ico|frames/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
