import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/feed"
  const type = searchParams.get("type")
  const error = searchParams.get("error")
  const error_description = searchParams.get("error_description")
  const token_hash = searchParams.get("token_hash")
  const redirect_type = searchParams.get("redirect_type")

  console.log("=== Auth Callback Debug ===")
  console.log("Full URL:", request.url)
  console.log("Params:", {
    code: !!code,
    next,
    type,
    token_hash: !!token_hash,
    redirect_type,
    error,
  })

  // Handle errors from Supabase
  if (error) {
    console.error("Auth callback error:", error, error_description)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error_description || error)}`)
  }

  if (code) {
    const supabase = await createClient()

    const isPasswordRecovery = type === "recovery" || redirect_type === "recovery" || !!token_hash

    console.log("Before exchange - isPasswordRecovery:", isPasswordRecovery)

    const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("Error exchanging code:", exchangeError)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
    }

    if (data.session) {
      console.log("Session established - redirecting based on flow type")

      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"

      if (isPasswordRecovery) {
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
