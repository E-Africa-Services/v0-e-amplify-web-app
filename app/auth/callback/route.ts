import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/feed"
  const type = searchParams.get("type") // Check if this is a password recovery

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successfully verified email and exchanged code for session
      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"
      
      // If this is a password recovery flow, redirect to reset password page
      if (type === "recovery") {
        const resetUrl = "/auth/reset-password"
        if (forwardedHost) {
          return NextResponse.redirect(`${isLocalEnv ? "http" : "https"}://${forwardedHost}${resetUrl}`)
        } else {
          return NextResponse.redirect(`${origin}${resetUrl}`)
        }
      }
      
      if (forwardedHost) {
        return NextResponse.redirect(`${isLocalEnv ? "http" : "https"}://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // If no code or error, redirect to home
  return NextResponse.redirect(`${origin}/`)
}
