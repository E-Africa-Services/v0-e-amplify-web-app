"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle } from "lucide-react"
import Link from "next/link"
import { signUp } from "@/lib/auth-actions"
import { useRouter } from "next/navigation"

type UserGoal = "learn" | "teach" | "collaborate" | null

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState<UserGoal>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: "",
    teachTopics: "",
    learnTopics: "",
    whyHere: "",
    availability: "",
  })

  const totalSteps = 4

  const handleNext = () => {
    setError("")
    
    // Validate each step before proceeding
    if (step === 1 && !goal) {
      setError("Please select your primary goal to continue")
      return
    }
    
    if (step === 2) {
      if (!formData.name.trim()) {
        setError("Please enter your full name")
        return
      }
      if (!formData.email.trim()) {
        setError("Please enter your email address")
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address")
        return
      }
      if (!formData.password) {
        setError("Please create a password")
        return
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }
    }
    
    if (step < totalSteps) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = async () => {
    setError("")
    
    // Validate required fields
    if (!formData.name.trim()) {
      setError("Please enter your full name")
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!formData.password) {
      setError("Please create a password")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (!goal) {
      setError("Please select your primary goal")
      return
    }

    setIsLoading(true)

    const result = await signUp(
      formData.email.trim(),
      formData.password,
      formData.name.trim(),
      goal,
      formData.skills.trim(),
      formData.whyHere.trim()
    )

    if (result?.error) {
      // Provide user-friendly error messages
      let errorMessage = result.error
      
      if (result.error.includes("already registered") || result.error.includes("already exists")) {
        errorMessage = "This email is already registered. Please sign in instead."
      } else if (result.error.includes("Invalid email")) {
        errorMessage = "Please enter a valid email address."
      } else if (result.error.includes("Password")) {
        errorMessage = "Password must be at least 6 characters long."
      } else if (result.error.includes("network") || result.error.includes("fetch")) {
        errorMessage = "Network error. Please check your connection and try again."
      }
      
      setError(errorMessage)
      setIsLoading(false)
    } else {
      // Redirect to login page with success message
      router.push("/login?signup=success")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">E</span>
            </div>
            <span className="font-semibold text-xl">E-Amplify</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome to your journey</h1>
          <p className="text-muted-foreground">Let's set up your purpose card in a few simple steps</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full mx-1 transition-all ${i + 1 <= step ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Step {step} of {totalSteps}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <Card className="p-8">
          {/* Step 1: Choose Goal */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">What brings you here?</h2>
                <p className="text-muted-foreground">Choose your primary goal to get started</p>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={() => setGoal("learn")}
                  className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
                    goal === "learn" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">I want to learn</h3>
                      <p className="text-sm text-muted-foreground">Connect with mentors and grow your skills</p>
                    </div>
                    {goal === "learn" && <Check className="w-6 h-6 text-primary" />}
                  </div>
                </button>

                <button
                  onClick={() => setGoal("teach")}
                  className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
                    goal === "teach" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">I want to teach</h3>
                      <p className="text-sm text-muted-foreground">Share your expertise and earn with impact</p>
                    </div>
                    {goal === "teach" && <Check className="w-6 h-6 text-primary" />}
                  </div>
                </button>

                <button
                  onClick={() => setGoal("collaborate")}
                  className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
                    goal === "collaborate" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">I want to collaborate</h3>
                      <p className="text-sm text-muted-foreground">Work with peers on projects and ideas</p>
                    </div>
                    {goal === "collaborate" && <Check className="w-6 h-6 text-primary" />}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Basic Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
                <p className="text-muted-foreground">Basic information to get you started</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1.5"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1.5"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Your Skills</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., Product Design, Marketing, Python"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="mt-1.5"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Separate multiple skills with commas</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Purpose Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Define your purpose</h2>
                <p className="text-muted-foreground">Help others understand what you're looking for</p>
              </div>

              <div className="space-y-4">
                {(goal === "teach" || goal === "collaborate") && (
                  <div>
                    <Label htmlFor="teachTopics">What can you teach or share?</Label>
                    <Textarea
                      id="teachTopics"
                      placeholder="Describe the topics, skills, or experiences you can share..."
                      value={formData.teachTopics}
                      onChange={(e) => setFormData({ ...formData, teachTopics: e.target.value })}
                      className="mt-1.5 min-h-24"
                      disabled={isLoading}
                    />
                  </div>
                )}

                {(goal === "learn" || goal === "collaborate") && (
                  <div>
                    <Label htmlFor="learnTopics">What do you want to learn?</Label>
                    <Textarea
                      id="learnTopics"
                      placeholder="Describe what you're looking to learn or improve..."
                      value={formData.learnTopics}
                      onChange={(e) => setFormData({ ...formData, learnTopics: e.target.value })}
                      className="mt-1.5 min-h-24"
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="whyHere">Why are you here?</Label>
                  <Textarea
                    id="whyHere"
                    placeholder="Share your motivation and what you hope to achieve..."
                    value={formData.whyHere}
                    onChange={(e) => setFormData({ ...formData, whyHere: e.target.value })}
                    className="mt-1.5 min-h-24"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preview Purpose Card */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Purpose Card</h2>
                <p className="text-muted-foreground">Review your profile before we get started</p>
              </div>

              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                    {formData.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{formData.name || "Your Name"}</h3>
                    <p className="text-sm text-muted-foreground">{formData.email || "your.email@example.com"}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.split(",").map((skill, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {formData.teachTopics && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">What I teach</h4>
                      <p className="text-sm text-muted-foreground">{formData.teachTopics}</p>
                    </div>
                  )}

                  {formData.learnTopics && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">What I need</h4>
                      <p className="text-sm text-muted-foreground">{formData.learnTopics}</p>
                    </div>
                  )}

                  {formData.whyHere && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Why I'm here</h4>
                      <p className="text-sm text-muted-foreground">{formData.whyHere}</p>
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex items-center gap-2 p-4 rounded-xl bg-secondary/10 text-secondary-foreground">
                <Sparkles className="w-5 h-5 text-secondary" />
                <p className="text-sm">
                  Your purpose card will be visible to the community and help you connect with the right people.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button variant="ghost" onClick={handleBack} disabled={step === 1 || isLoading} className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < totalSteps ? (
              <Button onClick={handleNext} disabled={(step === 1 && !goal) || isLoading} className="rounded-full">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={isLoading} className="rounded-full">
                {isLoading ? "Creating account..." : "Complete Setup"}
                {!isLoading && <Check className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
