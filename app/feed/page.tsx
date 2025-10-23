import { FeedNavbar } from "@/components/feed-navbar"
import { CreatePost } from "@/components/create-post"
import { FeedPost } from "@/components/feed-post"
import { FeedSidebar } from "@/components/feed-sidebar"
import { ProtectedRoute } from "@/components/protected-route"

// Mock data - in real app this would come from database
const mockPosts = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      avatar: "/professional-woman-smiling.png",
      role: "Product Designer",
      skills: ["UI/UX", "Figma", "Design Systems"],
    },
    content:
      "Just completed my 10th mentorship session this month! The energy and curiosity from learners keeps me inspired. Today we dove deep into design systems and component architecture. What did you learn today?",
    timestamp: "2 hours ago",
    reactions: { heart: 24, amplify: 8 },
    comments: 5,
    hasReacted: false,
  },
  {
    id: "2",
    author: {
      name: "Marcus Johnson",
      avatar: "/professional-man-smiling.png",
      role: "Software Engineer",
      skills: ["React", "Node.js", "TypeScript"],
    },
    content:
      "Reflection: Teaching others has made me a better developer. When you explain concepts, you truly understand them. Grateful for this community that values growth over ego.",
    timestamp: "5 hours ago",
    reactions: { heart: 42, amplify: 15 },
    comments: 12,
    hasReacted: true,
  },
  {
    id: "3",
    author: {
      name: "Priya Patel",
      avatar: "/professional-woman-confident.jpg",
      role: "Marketing Strategist",
      skills: ["Content Strategy", "SEO", "Analytics"],
    },
    content:
      "Big milestone: Just hit $2,000 in earnings from mentorship! But more importantly, I've helped 30+ people level up their marketing skills. Impact over income, always.",
    timestamp: "1 day ago",
    reactions: { heart: 67, amplify: 23 },
    comments: 18,
    hasReacted: false,
  },
]

export default function FeedPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <FeedNavbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-8 space-y-6">
              <CreatePost />

              <div className="space-y-4">
                {mockPosts.map((post) => (
                  <FeedPost key={post.id} post={post} />
                ))}
              </div>

              {/* Load more */}
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">You've reached the end of your feed</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <FeedSidebar />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
