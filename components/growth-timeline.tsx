import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock } from "lucide-react"

const timelineEvents = [
  {
    id: "1",
    title: "Completed React Advanced Patterns session",
    description: "1-hour mentorship with Marcus Johnson",
    timestamp: "2 hours ago",
    status: "completed",
    type: "session",
  },
  {
    id: "2",
    title: "Earned 'Consistent Learner' badge",
    description: "Completed 10 sessions this month",
    timestamp: "1 day ago",
    status: "completed",
    type: "achievement",
  },
  {
    id: "3",
    title: "Upcoming: Design Systems Workshop",
    description: "Scheduled with Sarah Chen",
    timestamp: "Tomorrow at 3:00 PM",
    status: "upcoming",
    type: "session",
  },
  {
    id: "4",
    title: "Posted growth reflection",
    description: "Shared learnings with the community",
    timestamp: "2 days ago",
    status: "completed",
    type: "post",
  },
  {
    id: "5",
    title: "Connected with 3 new mentors",
    description: "Expanded your network",
    timestamp: "3 days ago",
    status: "completed",
    type: "connection",
  },
]

export function GrowthTimeline() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Growth Timeline</h2>
        <span className="text-sm text-muted-foreground">Last 7 days</span>
      </div>

      <div className="space-y-6">
        {timelineEvents.map((event, i) => (
          <div key={event.id} className="flex gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              {event.status === "completed" ? (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              ) : event.status === "upcoming" ? (
                <Clock className="w-6 h-6 text-secondary" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground" />
              )}
              {i < timelineEvents.length - 1 && <div className="w-0.5 h-12 bg-border mt-2" />}
            </div>

            {/* Event content */}
            <div className="flex-1 pb-6">
              <h3 className="font-semibold mb-1">{event.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
              <span className="text-xs text-muted-foreground">{event.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
