import { FeedNavbar } from "@/components/feed-navbar"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileStats } from "@/components/profile-stats"
import { ProfileAbout } from "@/components/profile-about"
import { ProfileSkills } from "@/components/profile-skills"
import { ProfileReviews } from "@/components/profile-reviews"
import { ProfileActivity } from "@/components/profile-activity"

// Mock profile data - in real app this would come from database
const mockProfile = {
  id: "1",
  name: "Sarah Chen",
  role: "Senior Product Designer",
  avatar: "/professional-woman-smiling.png",
  coverImage: "/abstract-gradient.png",
  bio: "Product designer with 10+ years of experience creating delightful user experiences. Passionate about mentoring the next generation of designers and helping them find their unique voice in the industry.",
  location: "San Francisco, CA",
  joinedDate: "January 2024",
  skills: ["UI/UX Design", "Figma", "Design Systems", "User Research", "Prototyping", "Interaction Design"],
  stats: {
    sessions: 127,
    rating: 4.9,
    students: 45,
    earnings: "$6,350",
  },
  availability: {
    status: "Available Now",
    nextSlot: "Today at 3:00 PM",
  },
  pricing: {
    perSession: 50,
    perMonth: 180,
  },
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <FeedNavbar />

      <div className="pt-16">
        <ProfileHeader profile={mockProfile} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileAbout profile={mockProfile} />
              <ProfileActivity />
              <ProfileReviews />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              <ProfileStats stats={mockProfile.stats} />
              <ProfileSkills skills={mockProfile.skills} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
