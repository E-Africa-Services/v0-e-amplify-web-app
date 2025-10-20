import { Card } from "@/components/ui/card"
import { Video, Users, DollarSign, Star } from "lucide-react"

interface Stats {
  sessions: number
  rating: number
  students: number
  earnings: string
}

export function ProfileStats({ stats }: { stats: Stats }) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Stats</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Sessions</span>
          </div>
          <span className="font-bold text-lg">{stats.sessions}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-sm text-muted-foreground">Average Rating</span>
          </div>
          <span className="font-bold text-lg">{stats.rating}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">Students Mentored</span>
          </div>
          <span className="font-bold text-lg">{stats.students}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Earnings</span>
          </div>
          <span className="font-bold text-lg">{stats.earnings}</span>
        </div>
      </div>
    </Card>
  )
}
