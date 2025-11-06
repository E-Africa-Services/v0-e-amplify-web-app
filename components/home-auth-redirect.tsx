"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"


export function HomeAuthRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if this is a password reset flow
    // Supabase redirects to the base URL with hash fragments containing tokens
    if (typeof window !== "undefined") {
      const hash = window.location.hash
      
      // Check for password reset tokens in URL hash
      // Supabase uses: #access_token=xxx&type=recovery
      if (hash.includes("access_token") && hash.includes("type=recovery")) {
        console.log("Password reset detected in URL hash, redirecting to reset form")
        router.push("/auth/reset-password")
        return
      }
      
      // Check for error in hash (e.g., expired token)
      if (hash.includes("error=")) {
        const errorMatch = hash.match(/error_description=([^&]+)/)
        const errorDescription = errorMatch ? decodeURIComponent(errorMatch[1]) : "An error occurred"
        router.push(`/login?error=${encodeURIComponent(errorDescription)}`)
        return
      }
    }
    
    // Only redirect if not loading and user is authenticated
    // BUT: Don't redirect if we're already handling a password reset
    if (!loading && user) {
      const hash = window.location.hash
      const isPasswordReset = hash.includes("type=recovery")
      
      if (!isPasswordReset) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, router])

  // This component doesn't render anything
  return null
}
