import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

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

    // Redirect authenticated users trying to access login/signup pages
    if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/onboarding")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  } catch (error) {
    // If there's a network error or other issue, just continue without blocking
    // This prevents middleware from breaking the app due to Supabase connectivity issues
    console.error("Middleware auth check error:", error)
  }

  return supabaseResponse
}
