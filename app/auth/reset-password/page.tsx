"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Lock, CheckCircle, AlertCircle } from "lucide-react"
import { updatePassword } from "@/lib/auth-actions"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Verify user has a valid password reset session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Reset password page - Current URL:', window.location.href)
        console.log('Reset password page - Search params:', Object.fromEntries(searchParams.entries()))
        console.log('Reset password page - Hash:', window.location.hash)
        
        // Check for different possible token formats in URL
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const type = searchParams.get('type')
        const token = searchParams.get('token')
        const errorCode = searchParams.get('error_code')
        const errorDescription = searchParams.get('error_description')
        
        // Also check hash for tokens (Supabase sometimes puts them there)
        const hash = window.location.hash
        const hashParams = new URLSearchParams(hash.substring(1))
        const hashAccessToken = hashParams.get('access_token')
        const hashRefreshToken = hashParams.get('refresh_token')
        const hashType = hashParams.get('type')
        
        console.log('Token parameters:', { 
          accessToken, refreshToken, type, token, 
          hashAccessToken, hashRefreshToken, hashType,
          errorCode, errorDescription 
        })

        // Handle errors first
        if (errorCode || errorDescription) {
          console.error('Password reset error:', errorCode, errorDescription)
          setError(errorDescription || "There was an error with your password reset link.")
          setIsAuthorized(false)
          setIsValidating(false)
          return
        }

        // Method 1: Tokens in URL hash (most common with Supabase)
        if (hashAccessToken && hashRefreshToken && hashType === 'recovery') {
          console.log('✓ Password reset tokens detected in hash - setting session')
          
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: hashAccessToken,
            refresh_token: hashRefreshToken,
          })
          
          if (sessionError) {
            console.error('Error setting session from hash:', sessionError)
            setError("There was an error with your reset link. Please try again.")
            setIsAuthorized(false)
          } else {
            console.log('✓ Session set successfully from hash tokens')
            setIsAuthorized(true)
          }
          setIsValidating(false)
          return
        }

        // Method 2: Tokens in search params
        if (accessToken && refreshToken && type === 'recovery') {
          console.log('✓ Password reset tokens detected in search params - setting session')
          
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          
          if (sessionError) {
            console.error('Error setting session from params:', sessionError)
            setError("There was an error with your reset link. Please try again.")
            setIsAuthorized(false)
          } else {
            console.log('✓ Session set successfully from search params')
            setIsAuthorized(true)
          }
          setIsValidating(false)
          return
        }

        // Method 3: Check existing session (user already authenticated)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          console.error("No valid session found:", sessionError)
          setError("Invalid or expired password reset link. Please request a new one.")
          setIsAuthorized(false)
          setIsValidating(false)
          return
        }

        console.log('✓ Valid session found:', session.user.email)
        setIsAuthorized(true)
        setIsValidating(false)
      } catch (err) {
        console.error("Error validating session:", err)
        setError("An error occurred. Please try again.")
        setIsAuthorized(false)
        setIsValidating(false)
      }
    }

    checkAuth()

    // Listen for PASSWORD_RECOVERY event from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change in reset password page:', event, session?.user?.email)
      
      if (event === 'PASSWORD_RECOVERY') {
        console.log('✓ PASSWORD_RECOVERY event detected')
        setIsAuthorized(true)
        setIsValidating(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    const result = await updatePassword(password)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setSuccess(true)
      setIsLoading(false)
      
      // Sign out the user so they have to log in with new password
      await supabase.auth.signOut()
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        window.location.href = "/login?reset=success"
      }, 3000)
    }
  }

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  // Show error if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 justify-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">E</span>
            </div>
            <span className="font-semibold text-2xl">E-Amplify</span>
          </Link>

          <Card className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button asChild className="w-full rounded-full">
                <Link href="/forgot-password">Request New Reset Link</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl">E</span>
          </div>
          <span className="font-semibold text-2xl">E-Amplify</span>
        </Link>

        <Card className="p-8">
          {!success ? (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Set new password</h1>
                <p className="text-muted-foreground">Enter your new password below</p>
              </div>

              {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Must be at least 6 characters</p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Password Reset Successful!</h2>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to login page...
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
