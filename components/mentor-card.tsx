import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Video, Calendar } from "lucide-react"
import Link from "next/link"

interface Mentor {
  id: string
  name: string
  role: string
  avatar: string
  skills: string[]
  bio: string
  rating: number
  sessions: number
  price: number
  availability: string
  isAvailable: boolean
}

export function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={mentor.avatar || "/placeholder.svg"}
          alt={mentor.name}
          className="w-16 h-16 rounded-2xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{mentor.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{mentor.role}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium">{mentor.rating}</span>
            <span className="text-xs text-muted-foreground">({mentor.sessions} sessions)</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{mentor.bio}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mentor.skills.slice(0, 4).map((skill, i) => (
          <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {skill}
          </span>
        ))}
      </div>

      {/* Availability and Price */}
      <div className="flex items-center justify-between mb-4 pt-4 border-t border-border mt-auto">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className={`text-sm ${mentor.isAvailable ? "text-primary font-medium" : "text-muted-foreground"}`}>
            {mentor.availability}
          </span>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">${mentor.price}</div>
          <div className="text-xs text-muted-foreground">per session</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 rounded-full bg-transparent" asChild>
          <Link href={`/profile/${mentor.id}`}>View Profile</Link>
        </Button>
        <Button className="flex-1 rounded-full" disabled={!mentor.isAvailable}>
          <Video className="w-4 h-4 mr-2" />
          Book Now
        </Button>
      </div>
    </Card>
  )
}
