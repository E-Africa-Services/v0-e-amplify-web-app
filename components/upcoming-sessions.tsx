"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Calendar, Clock } from 'lucide-react'
import { useEffect, useState } from "react"

interface Session {
  id: string
  title: string
  mentor_id: string
  mentor: {
    name: string
    avatar_url: string
  }
  scheduled_at: string
  duration_minutes: number
}

export function UpcomingSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/sessions?upcoming=true&limit=5")
        const data = await response.json()
        setSessions(data.data || [])
      } catch (error) {
        console.error("Failed to fetch sessions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Upcoming Sessions</h2>
        <Calendar className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading sessions...</div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={session.mentor.avatar_url || "/placeholder.svg"}
                  alt={session.mentor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 truncate">{session.title}</h3>
                  <p className="text-xs text-muted-foreground">with {session.mentor.name}</p>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(session.scheduled_at)} at {new Date(session.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{session.duration_minutes} minutes</span>
                </div>
              </div>

              <Button size="sm" className="w-full rounded-full">
                <Video className="w-3 h-3 mr-2" />
                Join Session
              </Button>
            </div>
          ))
        ) : (
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
