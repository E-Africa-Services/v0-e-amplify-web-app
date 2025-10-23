"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function getUserProfile(userId: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function updateUserProfile(
  userId: string,
  updates: {
    full_name?: string
    bio?: string
    avatar_url?: string
    cover_image_url?: string
    location?: string
    skills?: string[]
    roles?: string[]
  },
) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getCurrentUserProfile() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  return getUserProfile(user.id)
}
