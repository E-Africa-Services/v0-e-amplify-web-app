"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Smile, Send } from "lucide-react"

export function CreatePost() {
  const [content, setContent] = useState("")
  const [postCount] = useState(1) // In real app, track from database
  const maxPosts = 2

  const handlePost = () => {
    if (content.trim()) {
      // In real app, save to database
      console.log("Posting:", content)
      setContent("")
    }
  }

  return (
    <Card className="p-6">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-semibold text-primary">SC</span>
        </div>

        <div className="flex-1 space-y-4">
          <Textarea
            placeholder="What did you learn today? Share your growth journey..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-24 resize-none border-0 focus-visible:ring-0 p-0 text-base"
          />

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ImageIcon className="w-4 h-4 mr-2" />
                Image
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Smile className="w-4 h-4 mr-2" />
                Emoji
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {postCount}/{maxPosts} posts today
              </span>
              <Button
                onClick={handlePost}
                disabled={!content.trim() || postCount >= maxPosts}
                size="sm"
                className="rounded-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
