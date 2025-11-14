"use client"

import { Button } from "@/components/ui/button"
import { Video, MessageSquare, Star, MapPin, Calendar, UserPlus, UserCheck } from 'lucide-react'
import { useState } from "react"
import { followUser, unfollowUser } from "@/lib/follow-actions"

interface Profile {
  id: string
  name: string
  role?: string | null
  avatar_url?: string | null
  location?: string | null
  created_at?: string
  stats?: {
    rating: number
    sessions: number
  }
  pricing?: {
    perSession: number
  }
  isCurrentUser?: boolean
  isFollowing?: boolean
}

export function ProfileHeader({ profile }: { profile: Profile }) {
  // Format the joined date
  const joinedDate = (() => {
    if (!profile.created_at) return 'Recently'
    try {
      const date = new Date(profile.created_at)
      if (isNaN(date.getTime())) return 'Recently'
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    } catch {
      return 'Recently'
    }
  })()

  const [isFollowing, setIsFollowing] = useState(profile.isFollowing || false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollowToggle = async () => {
    setIsLoading(true)
    try {
      if (isFollowing) {
        const result = await unfollowUser(profile.id)
        if (!result.error) {
          setIsFollowing(false)
        }
      } else {
        const result = await followUser(profile.id)
        if (!result.error) {
          setIsFollowing(true)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 sm:-mt-24">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            {/* Avatar */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-background shadow-xl bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.name}
                  className="w-full h-full rounded-3xl object-cover"
                />
              ) : (
                profile.name.charAt(0).toUpperCase() || '?'
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-1">{profile.name}</h1>
                  <p className="text-lg text-muted-foreground mb-2">
                    {profile.role || 'Member'}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {profile.stats && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-secondary text-secondary" />
                        <span className="font-medium">
                          {profile.stats.rating} ({profile.stats.sessions} sessions)
                        </span>
                      </div>
                    )}
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {joinedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {!profile.isCurrentUser && (
                    <>
                      <Button variant="outline" size="lg" className="rounded-full bg-transparent">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button 
                        size="lg" 
                        className="rounded-full"
                        onClick={handleFollowToggle}
                        disabled={isLoading}
                        variant={isFollowing ? "outline" : "default"}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                    </>
                  )}
                  <Button size="lg" className="rounded-full">
                    <Video className="w-4 h-4 mr-2" />
                    {profile.pricing?.perSession 
                      ? `Book Session - $${profile.pricing.perSession}`
                      : 'Book Session'
                    }
                  </Button>
                </div>
              </div>

              {/* Availability Badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Available for sessions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
