"use client"

import { FeedNavbar } from "@/components/feed-navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard,
  HelpCircle,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const { user } = useAuth()

  const settingsSections = [
    {
      title: "Account Preferences",
      icon: User,
      href: "/settings/account",
      description: "Edit your profile, name, bio, and skills",
    },
    {
      title: "Sign in & Security",
      icon: Lock,
      href: "/settings/security",
      description: "Change password and manage security settings",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/settings/notifications",
      description: "Manage how you receive notifications",
    },
    {
      title: "Privacy",
      icon: Shield,
      href: "/settings/privacy",
      description: "Control who can see your information",
    },
    {
      title: "Credits & Billing",
      icon: CreditCard,
      href: "/settings/billing",
      description: "Manage your credits and payment methods",
    },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <FeedNavbar />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="mb-8 flex items-center gap-4">
            <Link href="/feed">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              {user?.email && (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
                  {user.email.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {settingsSections.map((section) => {
              const Icon = section.icon
              return (
                <Link key={section.href} href={section.href}>
                  <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{section.title}</h3>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <Link href="/help">
              <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Help Center</h3>
                    <p className="text-sm text-muted-foreground">Get help and support</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
