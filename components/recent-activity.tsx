import { Card } from "@/components/ui/card"
import { Heart, MessageSquare, UserPlus, Award } from "lucide-react"

const activities = [
  {
    id: "1",
    type: "reaction",
    user: "Marcus Johnson",
    action: "reacted to your post",
    timestamp: "2 hours ago",
    icon: Heart,
    color: "text-red-500",
  },
  {
    id: "2",
    type: "comment",
    user: "Sarah Chen",
    action: "commented on your reflection",
    timestamp: "5 hours ago",
    icon: MessageSquare,
    color: "text-primary",
  },
  {
    id: "3",
    type: "connection",
    user: "Priya Patel",
    action: "started following you",
    timestamp: "1 day ago",
    icon: UserPlus,
    color: "text-secondary",
  },
  {
    id: "4",
    type: "achievement",
    user: "System",
    action: "You earned a new badge!",
    timestamp: "2 days ago",
    icon: Award,
    color: "text-accent",
  },
]

export function RecentActivity() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${activity.color}`}>
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold">{activity.user}</span> {activity.action}
              </p>
              <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
