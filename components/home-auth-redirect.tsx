"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"


export function HomeAuthRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [hasCheckedHash, setHasCheckedHash] = useState(false)

  useEffect(() => {
    // CRITICAL: Check for password reset IMMEDIATELY on mount
    // This must happen BEFORE auth context tries to redirect
    if (typeof window !== "undefined" && !hasCheckedHash) {
      const hash = window.location.hash
      const search = window.location.search
      
      console.log("HomeAuthRedirect - Full URL:", window.location.href)
      console.log("HomeAuthRedirect - Hash:", hash)
      console.log("HomeAuthRedirect - Search:", search)
      
      // Check for password reset tokens in URL hash
      // Supabase uses: #access_token=xxx&type=recovery or #access_token=xxx&refresh_token=xxx&type=recovery
      if (hash.includes("access_token") && hash.includes("type=recovery")) {
        console.log("✓ Password reset detected in URL hash, redirecting to reset form")
        setHasCheckedHash(true)
        // Use replace instead of push to avoid back button issues
        window.location.href = "/auth/reset-password" + hash
        return
      }
      
      // Also check if type=recovery is in the search params (some configurations)
      if (search.includes("type=recovery")) {
        console.log("✓ Password reset detected in search params, redirecting to reset form")
        setHasCheckedHash(true)
        window.location.href = "/auth/reset-password" + hash
        return
      }
      
      // Check for error in hash (e.g., expired token)
      if (hash.includes("error=")) {
        const errorMatch = hash.match(/error_description=([^&]+)/)
        const errorDescription = errorMatch ? decodeURIComponent(errorMatch[1]) : "An error occurred"
        console.log("✗ Error detected in hash:", errorDescription)
        setHasCheckedHash(true)
        router.push(`/login?error=${encodeURIComponent(errorDescription)}`)
        return
      }
      
      setHasCheckedHash(true)
    }
    
    // Only redirect if not loading and user is authenticated
    // BUT: Don't redirect if we're already handling a password reset
    if (!loading && user && hasCheckedHash) {
      const hash = window.location.hash
      const isPasswordReset = hash.includes("type=recovery")
      
      if (!isPasswordReset) {
        console.log("✓ Authenticated user, redirecting to dashboard")
        router.push("/dashboard")
      }
    }
  }, [user, loading, router, hasCheckedHash])

  // This component doesn't render anything
  return null
}
