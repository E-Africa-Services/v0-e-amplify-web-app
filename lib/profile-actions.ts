"use server"

import { createClient } from "@/lib/supabase/server"

export async function getUserProfile(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", userId).maybeSingle()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function updateUserProfile(
  userId: string,
  updates: {
    name?: string
    bio?: string
    avatar_url?: string
    cover_image_url?: string
    location?: string
    skills?: string[]
    roles?: string[]
  },
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getCurrentUserProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  return getUserProfile(user.id)
}
