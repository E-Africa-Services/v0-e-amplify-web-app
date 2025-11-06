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

        // Check if there are password recovery tokens in the URL
        const hash = typeof window !== "undefined" ? window.location.hash : ""
        const hasRecoveryTokens = hash.includes("access_token") && hash.includes("type=recovery")
        
        console.log("AuthContext init - pathname:", pathname)
        console.log("AuthContext init - has recovery tokens:", hasRecoveryTokens)
        
        // If there are recovery tokens, redirect to reset password page immediately
        if (hasRecoveryTokens && pathname === "/") {
          console.log("✓ Recovery tokens detected, redirecting to reset password page")
          window.location.href = "/auth/reset-password" + hash
          return
        }

        // Auto-redirect authenticated users from home/login to feed
        // BUT: Don't redirect if this is a password reset flow
        const isPasswordResetFlow = pathname.includes("/auth/reset-password") || 
                                    pathname.includes("/auth/callback") ||
                                    hasRecoveryTokens
        
        if (session && (pathname === "/" || pathname === "/login") && !isPasswordResetFlow) {
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

      // Handle auth events
      if (event === "SIGNED_IN") {
        // Don't redirect if user is on password reset flow
        const currentPath = window.location.pathname
        const currentHash = window.location.hash
        const hasRecoveryTokens = currentHash.includes("access_token") && currentHash.includes("type=recovery")
        const isPasswordResetFlow = currentPath === "/auth/reset-password" || 
                                    currentPath === "/auth/callback" ||
                                    hasRecoveryTokens
        
        if (!isPasswordResetFlow) {
          console.log("✓ SIGNED_IN, redirecting to feed")
          router.push("/feed")
          router.refresh()
        } else {
          console.log("✓ SIGNED_IN during password reset, staying on current page")
        }
      } else if (event === "SIGNED_OUT") {
        router.push("/")
        router.refresh()
      } else if (event === "PASSWORD_RECOVERY") {
        // PASSWORD_RECOVERY event means user clicked reset link
        // Redirect to reset password page if not already there
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
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          status: 500,
        } as AuthError
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
