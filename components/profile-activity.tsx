import { Card } from "@/components/ui/card"
import { Heart, MessageSquare } from "lucide-react"

const activities = [
  {
    id: "1",
    type: "post",
    content:
      "Just wrapped up an amazing session on design systems! The key is to start small and iterate. Don't try to build everything at once.",
    timestamp: "2 days ago",
    reactions: 24,
    comments: 5,
  },
  {
    id: "2",
    type: "post",
    content:
      "Reflection: Teaching others has made me a better designer. When you explain concepts, you truly understand them.",
    timestamp: "5 days ago",
    reactions: 42,
    comments: 12,
  },
]

export function ProfileActivity() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
            <p className="text-foreground leading-relaxed mb-3">{activity.content}</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>{activity.timestamp}</span>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{activity.reactions}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{activity.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
