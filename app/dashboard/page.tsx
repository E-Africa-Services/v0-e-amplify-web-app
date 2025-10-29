import { FeedNavbar } from "@/components/feed-navbar"
import { DashboardStats } from "@/components/dashboard-stats"
import { GrowthTimeline } from "@/components/growth-timeline"
import { UpcomingSessions } from "@/components/upcoming-sessions"
import { EarningsOverview } from "@/components/earnings-overview"
import { SkillProgress } from "@/components/skill-progress"
import { RecentActivity } from "@/components/recent-activity"
import { ProtectedRoute } from "@/components/protected-route"
import { getCurrentUser } from "@/lib/auth-actions"
import { getDashboardStats } from "@/lib/dashboard-actions"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const statsResult = await getDashboardStats(user.id)

  // Check if database tables are not set up yet
  if (statsResult.error && typeof statsResult.error === 'string' && 
      (statsResult.error.includes("Could not find the table") || 
       statsResult.error.includes("relation") && statsResult.error.includes("does not exist"))) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <FeedNavbar />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 text-center">
              <h1 className="text-2xl font-bold text-destructive mb-4">⚠️ Database Setup Required</h1>
              <p className="text-muted-foreground mb-6">
                The database tables haven't been created yet. Please run the SQL schema in Supabase.
              </p>
              <div className="bg-card border border-border rounded-lg p-6 text-left mb-6">
                <h2 className="font-semibold mb-3">Quick Setup Steps:</h2>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Open Supabase Dashboard: <a href={`https://supabase.com/dashboard/project/${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}/sql`} target="_blank" rel="noopener noreferrer" className="text-primary underline">SQL Editor</a></li>
                  <li>Copy the contents of <code className="bg-muted px-2 py-1 rounded">/supabase/URGENT_RUN_THIS_FIRST.sql</code></li>
                  <li>Paste into SQL Editor and click "Run"</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <FeedNavbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {statsResult.data?.profile?.name || user.email?.split('@')[0] || "User"}!</h1>
            <p className="text-muted-foreground">Track your growth and impact</p>
          </div>

          {/* Stats Overview */}
          <DashboardStats stats={statsResult.data?.stats} />

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
    </ProtectedRoute>
  )
}
