"use client"

import { useState } from "react"
import { FeedNavbar } from "@/components/feed-navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function SecurityPage() {
  const { user } = useAuth()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePasswordChange = async () => {
    if (!user) return

    setPasswordError("")
    setPasswordSuccess("")

    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All password fields are required")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("New password must be different from current password")
      return
    }

    setIsChangingPassword(true)
    const supabase = createClient()

    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: passwordData.currentPassword,
      })

      if (signInError) {
        setPasswordError("Current password is incorrect")
        setIsChangingPassword(false)
        return
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (updateError) {
        setPasswordError(updateError.message)
      } else {
        setPasswordSuccess("Password changed successfully!")
        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setTimeout(() => setPasswordSuccess(""), 5000)
      }
    } catch (err) {
      setPasswordError("An error occurred. Please try again.")
    }

    setIsChangingPassword(false)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <FeedNavbar />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="mb-8 flex items-center gap-4">
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Sign in & Security</h1>
              <p className="text-muted-foreground">Manage your password and security settings</p>
            </div>
          </div>

          {/* Password Change Section */}
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </h2>
                <p className="text-sm text-muted-foreground">
                  Update your password to keep your account secure
                </p>
              </div>

              {passwordError && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="p-3 rounded-lg bg-green-500/10 text-green-600 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  {passwordSuccess}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="mt-1.5"
                    disabled={isChangingPassword}
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="mt-1.5"
                    disabled={isChangingPassword}
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Must be at least 6 characters</p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="mt-1.5"
                    disabled={isChangingPassword}
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                  className="rounded-full"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Additional Security Info */}
          <Card className="p-6 mt-6 bg-muted/50">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold">Security Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use a strong, unique password</li>
                  <li>• Don't share your password with anyone</li>
                  <li>• Change your password regularly</li>
                  <li>• Enable two-factor authentication when available</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
