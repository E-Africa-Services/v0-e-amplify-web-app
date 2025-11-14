"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Smile, Send } from 'lucide-react'
import { useAuth } from "@/lib/auth-context"
import { createPost } from "@/lib/feed-actions"

export function CreatePost({ onPostCreated }: { onPostCreated?: () => void }) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("")
  const { user } = useAuth()

  const emojis = ["🎉", "😊", "🚀", "💡", "❤️", "👏", "🔥", "⭐"]

  const handlePost = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const result = await createPost(content, undefined, selectedEmoji)
      if (result.error) {
        setError(result.error)
      } else {
        setContent("")
        setSelectedEmoji("")
        onPostCreated?.()
      }
    } catch (err) {
      setError("Failed to create post")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <Card className="p-6">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-semibold text-primary">
            {user.user_metadata?.name?.[0]?.toUpperCase() || "U"}
          </span>
        </div>

        <div className="flex-1 space-y-4">
          <Textarea
            placeholder="What did you learn today? Share your growth journey..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-24 resize-none border-0 focus-visible:ring-0 p-0 text-base"
            disabled={isLoading}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Image
              </Button>

              {/* Emoji Selector */}
              <div className="flex gap-1">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant={selectedEmoji === emoji ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedEmoji(selectedEmoji === emoji ? "" : emoji)}
                    disabled={isLoading}
                    className="text-lg h-auto px-2 py-1"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handlePost}
              disabled={!content.trim() || isLoading}
              size="sm"
              className="rounded-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? "Posting..." : "Share"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
