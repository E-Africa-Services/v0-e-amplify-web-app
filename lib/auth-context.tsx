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

        // CRITICAL: Check if this is a password reset flow BEFORE any redirects
        // Password reset tokens appear in URL hash: #access_token=xxx&type=recovery
        const hash = typeof window !== "undefined" ? window.location.hash : ""
        const isPasswordResetHash = hash.includes("type=recovery") && hash.includes("access_token")
        
        console.log("AuthContext init - pathname:", pathname)
        console.log("AuthContext init - hash:", hash)
        console.log("AuthContext init - isPasswordResetHash:", isPasswordResetHash)
        console.log("AuthContext init - session:", !!session)
        
        // If this is a password reset, redirect to reset form immediately
        if (isPasswordResetHash && pathname === "/") {
          console.log("✓ Password reset detected in auth context, redirecting to reset form")
          router.push("/auth/reset-password")
          return
        }

        // Auto-redirect authenticated users from home/login to feed
        // BUT: Don't redirect if this is a password reset flow
        const isPasswordResetFlow = pathname.includes("/auth/reset-password") || 
                                    pathname.includes("/auth/callback") ||
                                    isPasswordResetHash
        
        if (session && (pathname === "/" || pathname === "/login") && !isPasswordResetFlow) {
          console.log("✓ Authenticated user on home/login, redirecting to feed")
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

      console.log("AuthContext event:", event, "pathname:", window.location.pathname)

      // Handle auth events
      if (event === "SIGNED_IN") {
        // Don't redirect if user is on password reset flow
        const currentPath = window.location.pathname
        const currentHash = window.location.hash
        const isPasswordResetFlow = currentPath === "/auth/reset-password" || 
                                    currentPath === "/auth/callback" ||
                                    currentHash.includes("type=recovery")
        
        if (!isPasswordResetFlow) {
          console.log("✓ SIGNED_IN event, redirecting to feed")
          router.push("/feed")
          router.refresh()
        } else {
          console.log("✓ SIGNED_IN event during password reset, staying on current page")
        }
      } else if (event === "SIGNED_OUT") {
        router.push("/")
        router.refresh()
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
