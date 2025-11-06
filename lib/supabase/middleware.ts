import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // CRITICAL: Check if this is a password reset redirect from Supabase
  // Supabase redirects to base URL with hash fragment, we need to redirect to reset form
  const url = request.nextUrl
  const hash = url.hash // Note: hash might not be available in middleware
  
  // Check if URL contains password reset indicators
  // When Supabase redirects after email verification, it adds these to the URL
  console.log("Middleware - URL:", url.toString())
  console.log("Middleware - Pathname:", url.pathname)
  console.log("Middleware - Search:", url.search)
  
  // If landing on home page with no specific params, let it through for client-side handling
  // The HomeAuthRedirect component will handle hash-based detection
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // DON'T redirect authenticated users from home page - let client-side handle it
    // This allows password reset flow to work (user is authenticated via recovery token)
    
    // Only redirect authenticated users trying to access login/signup pages
    // BUT: Allow access to reset-password page even when authenticated
    if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/onboarding")) {
      // Don't redirect if this might be a password reset flow
      if (request.nextUrl.pathname !== "/onboarding") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  } catch (error) {
    // If there's a network error or other issue, just continue without blocking
    // This prevents middleware from breaking the app due to Supabase connectivity issues
    console.error("Middleware auth check error:", error)
  }

  return supabaseResponse
}
