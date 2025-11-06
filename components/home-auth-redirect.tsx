"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"


export function HomeAuthRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if not loading and user is authenticated
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  // This component doesn't render anything
  return null
}
