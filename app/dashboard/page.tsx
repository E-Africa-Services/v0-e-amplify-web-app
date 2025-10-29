import { FeedNavbar } from "@/components/feed-navbar"
import { DashboardStats } from "@/components/dashboard-stats"
import { GrowthTimeline } from "@/components/growth-timeline"
import { UpcomingSessions } from "@/components/upcoming-sessions"
import { EarningsOverview } from "@/components/earnings-overview"
import { SkillProgress } from "@/components/skill-progress"
import { RecentActivity } from "@/components/profile-activity"
import { ProtectedRoute } from "@/components/protected-route"
import { getCurrentUser } from "@/lib/auth-actions"
import { getDashboardStats } from "@/lib/dashboard-actions"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const statsResult = await getDashboardStats(user.id)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <FeedNavbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {statsResult.data?.profile?.name || "User"}!</h1>
            <p className="text-muted-foreground">Track your growth and impact</p>
          </div>

          {/* Stats Overview */}
          <DashboardStats stats={statsResult.data?.stats} />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <GrowthTimeline />
              <SkillProgress skills={statsResult.data?.profile?.skills} />
              <RecentActivity userId={user.id} />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              <UpcomingSessions userId={user.id} />
              <EarningsOverview earnings={statsResult.data?.stats?.totalCredits} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
