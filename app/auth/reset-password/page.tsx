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
import { useRouter } from "next/navigation"
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
  const supabase = createClient()

  // Verify user has a valid password reset session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          setError("Invalid or expired password reset link. Please request a new one.")
          setIsAuthorized(false)
          setIsValidating(false)
          return
        }

        // Check if email is verified
        if (!session.user.email_confirmed_at) {
          setError("Email not verified. Please verify your email first.")
          setIsAuthorized(false)
          setIsValidating(false)
          return
        }

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
  }, [supabase])

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
      // Redirect to feed after 2 seconds
      setTimeout(() => {
        router.push("/feed")
      }, 2000)
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
              <h2 className="text-2xl font-bold mb-2">Password updated!</h2>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully updated. Redirecting to feed...
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
