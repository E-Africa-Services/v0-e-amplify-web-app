"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const { user, loading, signIn } = useAuth()
  const searchParams = useSearchParams()

  // Check if redirected from successful signup or email verification
  useEffect(() => {
    if (searchParams.get('signup') === 'success') {
      setShowSuccess(true)
      setSuccessMessage("Account created successfully! Please check your email to verify your account, then sign in.")
      // Hide success message after 8 seconds
      const timer = setTimeout(() => setShowSuccess(false), 8000)
      return () => clearTimeout(timer)
    } else if (searchParams.get('verified') === 'true') {
      setShowSuccess(true)
      setSuccessMessage("Email verified successfully! You can now sign in with your credentials.")
      // Hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000)
      return () => clearTimeout(timer)
    } else if (searchParams.get('reset') === 'success') {
      setShowSuccess(true)
      setSuccessMessage("Password reset successfully! You can now sign in with your new password.")
      // Hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  // If already logged in, they'll be redirected by AuthContext
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validate email
    if (!email.trim()) {
      setError("Please enter your email address")
      setIsLoading(false)
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }
    
    // Validate password
    if (!password) {
      setError("Please enter your password")
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)

    const { error: signInError } = await signIn(email.trim(), password)

    if (signInError) {
      // Provide user-friendly error messages
      let errorMessage = signInError.message
      
      if (signInError.message.includes("Invalid login credentials") || 
          signInError.message.includes("Invalid email or password")) {
        errorMessage = "Invalid email or password. Please try again."
      } else if (signInError.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email before signing in. Check your inbox for the verification link."
      } else if (signInError.message.includes("network") || signInError.message.includes("fetch")) {
        errorMessage = "Network error. Please check your connection and try again."
      }
      
      setError(errorMessage)
      setIsLoading(false)
    }
    // If successful, AuthContext handles redirect to feed
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to continue your growth journey</p>
          </div>

          {showSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-primary">{successMessage}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-destructive font-medium">Login failed</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" disabled={isLoading} />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/onboarding" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
