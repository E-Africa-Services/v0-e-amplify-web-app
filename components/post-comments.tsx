"use client"

import { useState, useEffect } from "react"
import { getPostComments, createComment, deleteComment } from "@/lib/comment-actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Comment {
  id: string
  content: string
  timestamp: string
  author: {
    id: string
    name: string
    avatar_url: string
  }
  replies: Comment[]
}

export function PostComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadComments()
  }, [postId])

  async function loadComments() {
    setLoading(true)
    const result = await getPostComments(postId)
    if (result.data) {
      setComments(result.data)
    }
    setLoading(false)
  }

  async function handleSubmitComment() {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    const result = await createComment(postId, newComment)

    if (result.data) {
      setNewComment("")
      await loadComments()
    }
    setIsSubmitting(false)
  }

  async function handleDeleteComment(commentId: string) {
    const result = await deleteComment(commentId)
    if (result.success) {
      await loadComments()
    }
  }

  const CommentItem = ({ comment }: { comment: Comment }) => (
    <div className="mb-3 rounded-lg border border-gray-200 p-3">
      <div className="flex items-start gap-2">
        {comment.author.avatar_url && (
          <img
            src={comment.author.avatar_url || "/placeholder.svg"}
            alt={comment.author.name}
            className="h-8 w-8 rounded-full"
          />
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold">{comment.author.name}</p>
          <p className="text-xs text-gray-500">{comment.timestamp}</p>
          <p className="mt-1 text-sm">{comment.content}</p>
          <button
            onClick={() => handleDeleteComment(comment.id)}
            className="mt-1 text-xs text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {comment.replies.length > 0 && (
        <div className="ml-6 mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Comments ({comments.length})</h3>

      <div className="space-y-2">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="text-sm"
        />
        <Button onClick={handleSubmitComment} disabled={isSubmitting || !newComment.trim()}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet</p>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  )
}
