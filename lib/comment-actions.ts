"use server"

import { createClient } from "@/lib/supabase/server"

export async function createComment(postId: string, content: string, parentCommentId?: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  if (!content.trim()) {
    return { error: "Comment content is required" }
  }

  const { data, error } = await supabase
    .from("post_comments")
    .insert({
      post_id: postId,
      author_id: user.id,
      content: content.trim(),
      parent_comment_id: parentCommentId || null,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getPostComments(postId: string) {
  const supabase = await createClient()

  const { data: comments, error } = await supabase
    .from("post_comments")
    .select(
      `
      id,
      content,
      created_at,
      author_id,
      parent_comment_id,
      profiles!post_comments_author_id_fkey(id, name, avatar_url)
    `
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true })

  if (error) {
    return { error: error.message }
  }

  // Transform comments into nested structure
  const commentMap = new Map()
  const rootComments: any[] = []

  comments.forEach((comment: any) => {
    const transformed = {
      id: comment.id,
      content: comment.content,
      timestamp: new Date(comment.created_at).toLocaleDateString(),
      author: comment.profiles,
      replies: [],
    }

    commentMap.set(comment.id, transformed)

    if (comment.parent_comment_id) {
      const parent = commentMap.get(comment.parent_comment_id)
      if (parent) {
        parent.replies.push(transformed)
      }
    } else {
      rootComments.push(transformed)
    }
  })

  return { data: rootComments }
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  // Verify ownership
  const { data: comment, error: fetchError } = await supabase
    .from("post_comments")
    .select("author_id")
    .eq("id", commentId)
    .single()

  if (fetchError || comment?.author_id !== user.id) {
    return { error: "You can only delete your own comments" }
  }

  const { error } = await supabase.from("post_comments").delete().eq("id", commentId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updateComment(commentId: string, content: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  if (!content.trim()) {
    return { error: "Comment content is required" }
  }

  // Verify ownership
  const { data: comment, error: fetchError } = await supabase
    .from("post_comments")
    .select("author_id")
    .eq("id", commentId)
    .single()

  if (fetchError || comment?.author_id !== user.id) {
    return { error: "You can only edit your own comments" }
  }

  const { data, error } = await supabase
    .from("post_comments")
    .update({ content: content.trim() })
    .eq("id", commentId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}
