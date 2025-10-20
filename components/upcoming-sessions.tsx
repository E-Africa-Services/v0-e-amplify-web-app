import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Calendar, Clock } from "lucide-react"

const upcomingSessions = [
  {
    id: "1",
    title: "Design Systems Workshop",
    mentor: "Sarah Chen",
    date: "Tomorrow",
    time: "3:00 PM",
    duration: "1 hour",
    avatar: "/professional-woman-smiling.png",
  },
  {
    id: "2",
    title: "React Performance Optimization",
    mentor: "Marcus Johnson",
    date: "Friday",
    time: "10:00 AM",
    duration: "1 hour",
    avatar: "/professional-man-smiling.png",
  },
]

export function UpcomingSessions() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Upcoming Sessions</h2>
        <Calendar className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {upcomingSessions.map((session) => (
          <div
            key={session.id}
            className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              <img
                src={session.avatar || "/placeholder.svg"}
                alt={session.mentor}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1 truncate">{session.title}</h3>
                <p className="text-xs text-muted-foreground">with {session.mentor}</p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>
                  {session.date} at {session.time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{session.duration}</span>
              </div>
            </div>

            <Button size="sm" className="w-full rounded-full">
              <Video className="w-3 h-3 mr-2" />
              Join Session
            </Button>
          </div>
        ))}

        {upcomingSessions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">No upcoming sessions</p>
            <Button size="sm" variant="outline">
              Book a Session
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
