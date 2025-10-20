import { Button } from "@/components/ui/button"
import { Video, MessageSquare, Star, MapPin, Calendar } from "lucide-react"

interface Profile {
  name: string
  role: string
  avatar: string
  coverImage: string
  location: string
  joinedDate: string
  stats: {
    rating: number
    sessions: number
  }
  availability: {
    status: string
  }
  pricing: {
    perSession: number
  }
}

export function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
        <img
          src={profile.coverImage || "/placeholder.svg"}
          alt="Cover"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 sm:-mt-24">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            {/* Avatar */}
            <img
              src={profile.avatar || "/placeholder.svg"}
              alt={profile.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-background object-cover shadow-xl"
            />

            {/* Info */}
            <div className="flex-1 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-1">{profile.name}</h1>
                  <p className="text-lg text-muted-foreground mb-2">{profile.role}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      <span className="font-medium">
                        {profile.stats.rating} ({profile.stats.sessions} sessions)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profile.joinedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="rounded-full bg-transparent">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button size="lg" className="rounded-full">
                    <Video className="w-4 h-4 mr-2" />
                    Book Session - ${profile.pricing.perSession}
                  </Button>
                </div>
              </div>

              {/* Availability Badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {profile.availability.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
