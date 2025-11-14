"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, TrendingUp, MoreHorizontal } from 'lucide-react'
import Link from "next/link"

interface Post {
  id: string
  author: {
    id: string
    name: string
    avatar_url: string
    role: string
  }
  content: string
  timestamp: string
  commentCount: number
  reactions: {
    heart: number
    amplify: number
  }
  hasReacted: boolean
}

export function FeedPost({ post }: { post: Post }) {
  const [hasReacted, setHasReacted] = useState(post.hasReacted)
  const [reactions, setReactions] = useState(post.reactions)

  const handleReact = async () => {
    setHasReacted(!hasReacted)
    setReactions({
      ...reactions,
      heart: hasReacted ? reactions.heart - 1 : reactions.heart + 1,
    })
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <Link href={`/profile/${post.author.id}`} className="flex gap-3 hover:opacity-80">
          <img
            src={post.author.avatar_url || "/placeholder.svg"}
            alt={post.author.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold hover:underline">{post.author.name}</h3>
            <p className="text-sm text-muted-foreground">{post.author.role}</p>
          </div>
        </Link>

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
          <span className="text-sm">{post.commentCount}</span>
        </Button>

        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">Amplify {reactions.amplify > 0 && `(${reactions.amplify})`}</span>
        </Button>
      </div>
    </Card>
  )
}
