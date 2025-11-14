"use server"

import { createClient } from "@/lib/supabase/server"

export async function createPost(content: string, imageUrl?: string, emoji?: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  // Validate content
  if (!content.trim() && !imageUrl) {
    return { error: "Post content or image is required" }
  }

  // Combine content with emoji if provided
  let fullContent = content
  if (emoji) {
    fullContent = `${emoji} ${content}`
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      content: fullContent,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getFeedPosts(limit = 20, offset = 0) {
  const supabase = await createClient()

  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        content,
        created_at,
        updated_at,
        author_id,
        profiles:author_id(id, name, avatar_url, role),
        post_comments(id),
        post_reactions:post_comments(author_id)
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return { error: error.message }
    }

    // Transform data for frontend
    const transformedPosts = posts.map((post: any) => ({
      id: post.id,
      content: post.content,
      timestamp: new Date(post.created_at).toLocaleDateString(),
      author: post.profiles,
      commentCount: post.post_comments?.length || 0,
      reactions: {
        heart: 0,
        amplify: 0,
      },
      hasReacted: false,
    }))

    return { data: transformedPosts }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to fetch posts" }
  }
}

export async function deletePost(postId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  // Verify ownership
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single()

  if (fetchError || post?.author_id !== user.id) {
    return { error: "You can only delete your own posts" }
  }

  const { error } = await supabase.from("posts").delete().eq("id", postId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
