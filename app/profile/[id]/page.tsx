import { FeedNavbar } from "@/components/feed-navbar"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileStats } from "@/components/profile-stats"
import { ProfileAbout } from "@/components/profile-about"
import { ProfileSkills } from "@/components/profile-skills"
import { ProfileReviews } from "@/components/profile-reviews"
import { ProfileActivity } from "@/components/profile-activity"
import { getUserProfile } from "@/lib/profile-actions"
import { getCurrentUser } from "@/lib/auth-actions"
import { redirect } from "next/navigation"

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    redirect("/login")
  }

  // Await params in Next.js 15
  const { id } = await params

  // If the ID is "me" or matches current user, show their profile
  const profileId = id === "me" ? currentUser.id : id
  
  const result = await getUserProfile(profileId)

  if (result.error || !result.data) {
    return (
      <div className="min-h-screen bg-background">
        <FeedNavbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground">
              {result.error || "Unable to load profile data"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const profile = result.data

  return (
    <div className="min-h-screen bg-background">
      <FeedNavbar />

      <div className="pt-16">
        <ProfileHeader profile={profile} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileAbout profile={profile} />
              <ProfileActivity />
              <ProfileReviews />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              <ProfileStats stats={profile.stats} />
              <ProfileSkills skills={profile.skills} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
