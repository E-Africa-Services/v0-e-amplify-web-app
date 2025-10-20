"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, TrendingUp, MoreHorizontal } from "lucide-react"

interface Post {
  id: string
  author: {
    name: string
    avatar: string
    role: string
    skills: string[]
  }
  content: string
  timestamp: string
  reactions: {
    heart: number
    amplify: number
  }
  comments: number
  hasReacted: boolean
}

export function FeedPost({ post }: { post: Post }) {
  const [hasReacted, setHasReacted] = useState(post.hasReacted)
  const [reactions, setReactions] = useState(post.reactions)

  const handleReact = () => {
    setHasReacted(!hasReacted)
    setReactions({
      ...reactions,
      heart: hasReacted ? reactions.heart - 1 : reactions.heart + 1,
    })
  }

  const handleAmplify = () => {
    // In real app, boost the post
    setReactions({
      ...reactions,
      amplify: reactions.amplify + 1,
    })
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <img
            src={post.author.avatar || "/placeholder.svg"}
            alt={post.author.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{post.author.name}</h3>
            <p className="text-sm text-muted-foreground">{post.author.role}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {post.author.skills.slice(0, 3).map((skill, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{post.timestamp}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <p className="text-foreground leading-relaxed mb-4">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReact}
          className={`gap-2 ${hasReacted ? "text-red-500 hover:text-red-600" : "text-muted-foreground"}`}
        >
          <Heart className={`w-4 h-4 ${hasReacted ? "fill-current" : ""}`} />
          <span className="text-sm">{reactions.heart}</span>
        </Button>

        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm">{post.comments}</span>
        </Button>

        <Button variant="ghost" size="sm" onClick={handleAmplify} className="gap-2 text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">Amplify {reactions.amplify > 0 && `(${reactions.amplify})`}</span>
        </Button>
      </div>
    </Card>
  )
}
