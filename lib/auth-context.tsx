"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User, AuthError, Session } from "@supabase/supabase-js"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // Helper function to check for recovery tokens in URL hash
  const hasRecoveryTokens = () => {
    if (typeof window === "undefined") return false
    const hash = window.location.hash
    return hash.includes("access_token") && hash.includes("type=recovery")
  }

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        if (hasRecoveryTokens()) {
          console.log("✓ Recovery tokens detected - staying on current page")
          return
        }

        // Auto-redirect authenticated users from home/login to feed
        if (session && (pathname === "/" || pathname === "/login")) {
          console.log("✓ Authenticated user, redirecting to feed")
          router.push("/feed")
        }
      } catch (error) {
        console.error("Error getting session:", error)
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      console.log("AuthContext event:", event)

      if (hasRecoveryTokens()) {
        console.log("✓ Recovery tokens present - preventing redirect")
        return
      }

      // Handle auth events
      if (event === "SIGNED_IN") {
        const currentPath = window.location.pathname
        const isPasswordResetPath = currentPath === "/auth/reset-password" || currentPath === "/auth/callback"

        if (!isPasswordResetPath) {
          console.log("✓ SIGNED_IN, redirecting to feed")
          router.push("/feed")
          router.refresh()
        } else {
          console.log("✓ SIGNED_IN on auth page, staying on current page")
        }
      } else if (event === "SIGNED_OUT") {
        router.push("/")
        router.refresh()
      } else if (event === "PASSWORD_RECOVERY") {
        console.log("✓ PASSWORD_RECOVERY event detected")
        if (window.location.pathname !== "/auth/reset-password") {
          window.location.href = "/auth/reset-password" + window.location.hash
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, pathname])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : "An unexpected error occurred",
          status: 500,
        } as AuthError,
      }
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const refreshSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.refreshSession()
      setSession(session)
      setUser(session?.user ?? null)
    } catch (error) {
      console.error("Error refreshing session:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
