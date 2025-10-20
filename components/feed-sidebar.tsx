import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, TrendingUp, Users, Calendar } from "lucide-react"
import Link from "next/link"

const trendingSessions = [
  { title: "Design Systems 101", mentor: "Sarah Chen", time: "Today, 3:00 PM" },
  { title: "React Best Practices", mentor: "Marcus Johnson", time: "Tomorrow, 10:00 AM" },
  { title: "Marketing Strategy", mentor: "Priya Patel", time: "Tomorrow, 2:00 PM" },
]

const suggestedMentors = [
  { name: "Alex Rivera", role: "Data Scientist", avatar: "/placeholder.svg?height=40&width=40" },
  { name: "Emma Wilson", role: "UX Researcher", avatar: "/placeholder.svg?height=40&width=40" },
  { name: "James Lee", role: "DevOps Engineer", avatar: "/placeholder.svg?height=40&width=40" },
]

export function FeedSidebar() {
  return (
    <div className="space-y-6 sticky top-20">
      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
            <Link href="/discover">
              <Users className="w-4 h-4 mr-2" />
              Find Mentors
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Video className="w-4 h-4 mr-2" />
            Start Session
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
            <Link href="/dashboard">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Progress
            </Link>
          </Button>
        </div>
      </Card>

      {/* Trending Sessions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Trending Sessions</h3>
          <Calendar className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {trendingSessions.map((session, i) => (
            <div key={i} className="space-y-1">
              <h4 className="text-sm font-medium">{session.title}</h4>
              <p className="text-xs text-muted-foreground">with {session.mentor}</p>
              <p className="text-xs text-primary">{session.time}</p>
            </div>
          ))}
        </div>
        <Button variant="link" className="w-full mt-4 text-primary" asChild>
          <Link href="/discover">View All Sessions</Link>
        </Button>
      </Card>

      {/* Suggested Mentors */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Suggested for You</h3>
        <div className="space-y-4">
          {suggestedMentors.map((mentor, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={mentor.avatar || "/placeholder.svg"}
                  alt={mentor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-medium">{mentor.name}</h4>
                  <p className="text-xs text-muted-foreground">{mentor.role}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="rounded-full bg-transparent">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Community Stats */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h3 className="font-semibold mb-4">Community Impact</h3>
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-primary">10,247</div>
            <div className="text-xs text-muted-foreground">Active Members</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">52,891</div>
            <div className="text-xs text-muted-foreground">Sessions This Month</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">4.9/5</div>
            <div className="text-xs text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
