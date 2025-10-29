"use client"

import { useState, useEffect } from "react"
import { FeedNavbar } from "@/components/feed-navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { updateUserProfile } from "@/lib/profile-actions"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    skills: "",
  })

  useEffect(() => {
    if (user) {
      loadUserProfile()
    }
  }, [user])

  const loadUserProfile = async () => {
    setIsLoading(true)
    setError("")
    const supabase = createClient()

    // Query from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user?.id)
      .maybeSingle()

    if (profileError) {
      setError("Failed to load profile: " + profileError.message)
      setIsLoading(false)
      return
    }

    if (profile) {
      // Get skills for this profile
      const { data: skills } = await supabase
        .from("skills")
        .select("skill_name")
        .eq("profile_id", profile.id)

      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        skills: skills?.map(s => s.skill_name).join(", ") || "",
      })
    } else {
      // Profile doesn't exist yet - shouldn't happen if schema trigger is working
      setError("Profile not found. Please log out and log in again.")
    }
    
    setIsLoading(false)
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    setError("")
    setSuccess("")

    const result = await updateUserProfile(user.id, {
      name: formData.name,
      bio: formData.bio,
      location: formData.location,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    })

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess("Profile updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    }
    setIsSaving(false)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <FeedNavbar />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Manage your profile and preferences</p>
            </div>
          </div>

          {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-600 text-sm">{success}</div>}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
            </div>
          ) : (
            <Card className="p-8">
              <div className="space-y-6">
                {/* Profile Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={user?.email || ""} disabled className="mt-1.5 bg-muted" />
                      <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1.5"
                        disabled={isSaving}
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="mt-1.5"
                        disabled={isSaving}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="mt-1.5 min-h-24"
                        disabled={isSaving}
                      />
                    </div>

                    <div>
                      <Label htmlFor="skills">Skills</Label>
                      <Input
                        id="skills"
                        placeholder="e.g., React, Design, Marketing"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        className="mt-1.5"
                        disabled={isSaving}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Separate skills with commas</p>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-border">
                  <Button onClick={handleSave} disabled={isSaving} className="rounded-full">
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
