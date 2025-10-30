"use client"

import { FeedNavbar } from "@/components/feed-navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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
              <h1 className="text-3xl font-bold">Privacy</h1>
              <p className="text-muted-foreground">Control who can see your information</p>
            </div>
          </div>

          <Card className="p-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
              <p className="text-muted-foreground">
                Privacy settings will be available soon
              </p>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
