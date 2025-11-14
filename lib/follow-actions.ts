"use server"

import { createClient } from "@/lib/supabase/server"

export async function followUser(userId: string) {
  const supabase = await createClient()

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    return { error: "User not authenticated" }
  }

  if (userId === currentUser.id) {
    return { error: "You cannot follow yourself" }
  }

  const { error } = await supabase.from("followers").insert({
    follower_id: currentUser.id,
    following_id: userId,
  })

  if (error) {
    if (error.message.includes("duplicate")) {
      return { error: "You are already following this user" }
    }
    return { error: error.message }
  }

  return { success: true }
}

export async function unfollowUser(userId: string) {
  const supabase = await createClient()

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    return { error: "User not authenticated" }
  }

  const { error } = await supabase
    .from("followers")
    .delete()
    .eq("follower_id", currentUser.id)
    .eq("following_id", userId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function isFollowing(userId: string) {
  const supabase = await createClient()

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    return { data: false }
  }

  const { data, error } = await supabase
    .from("followers")
    .select("id")
    .eq("follower_id", currentUser.id)
    .eq("following_id", userId)
    .maybeSingle()

  if (error) {
    return { error: error.message }
  }

  return { data: !!data }
}

export async function getFollowerCount(userId: string) {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("followers")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId)

  if (error) {
    return { error: error.message }
  }

  return { data: count || 0 }
}

export async function getFollowingCount(userId: string) {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("followers")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId)

  if (error) {
    return { error: error.message }
  }

  return { data: count || 0 }
}
