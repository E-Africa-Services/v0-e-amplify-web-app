import { FeedNavbar } from "@/components/feed-navbar"
import { DashboardStats } from "@/components/dashboard-stats"
import { GrowthTimeline } from "@/components/growth-timeline"
import { UpcomingSessions } from "@/components/upcoming-sessions"
import { EarningsOverview } from "@/components/earnings-overview"
import { SkillProgress } from "@/components/skill-progress"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <FeedNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-muted-foreground">Track your growth and impact</p>
        </div>

        {/* Stats Overview */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <GrowthTimeline />
            <SkillProgress />
            <RecentActivity />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <UpcomingSessions />
            <EarningsOverview />
          </div>
        </div>
      </div>
    </div>
  )
}
