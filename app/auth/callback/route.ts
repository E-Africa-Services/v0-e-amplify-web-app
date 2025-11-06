import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/feed"
  const type = searchParams.get("type") // Check if this is a password recovery
  const error = searchParams.get("error")
  const error_description = searchParams.get("error_description")

  console.log("=== Auth Callback Debug ===")
  console.log("Full URL:", request.url)
  console.log("Params:", { code: !!code, next, type, error })
  console.log("Origin:", origin)

  // Handle errors from Supabase
  if (error) {
    console.error("Auth callback error:", error, error_description)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error_description || error)}`)
  }

  if (code) {
    const supabase = await createClient()
    
    // Check if this is a password recovery BEFORE exchanging code
    const isPasswordRecovery = type === "recovery"
    
    console.log("Before exchange - isPasswordRecovery:", isPasswordRecovery)
    
    const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error("Error exchanging code:", exchangeError)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
    }
    
    if (data.session) {
      const user = data.session.user
      console.log("Session established:", { 
        userId: user.id, 
        type,
        isPasswordRecovery,
        aud: user.aud,
        recoveryMode: user.aud === "authenticated" && user.app_metadata?.provider === "email"
      })
      
      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"
      
      // Check multiple ways to detect password recovery
      // 1. Explicit type=recovery parameter
      // 2. Check if user metadata indicates recovery
      const isRecovery = isPasswordRecovery || 
                         user.aud === "authenticated" && !next.includes("verified")
      
      // IMPORTANT: Redirect to reset password page FIRST for password recovery
      if (isRecovery && type === "recovery") {
        const resetUrl = "/auth/reset-password"
        console.log("✓ Password recovery detected - redirecting to:", resetUrl)
        if (forwardedHost) {
          return NextResponse.redirect(`${isLocalEnv ? "http" : "https"}://${forwardedHost}${resetUrl}`)
        } else {
          return NextResponse.redirect(`${origin}${resetUrl}`)
        }
      }
      
      // Regular email verification - redirect to next page
      console.log("✓ Email verification - redirecting to:", next)
      if (forwardedHost) {
        return NextResponse.redirect(`${isLocalEnv ? "http" : "https"}://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // If no code or error, redirect to login
  console.log("No code found, redirecting to login")
  return NextResponse.redirect(`${origin}/login`)
}
