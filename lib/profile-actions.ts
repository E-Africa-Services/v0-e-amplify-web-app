"use server"

import { createClient } from "@/lib/supabase/server"

export async function getUserProfile(userId: string) {
  const supabase = await createClient()

  // Query from profiles table and join with skills
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (profileError) {
    return { error: profileError.message }
  }

  if (!profile) {
    return { error: "Profile not found" }
  }

  // Get skills for this profile
  const { data: skills, error: skillsError } = await supabase
    .from("skills")
    .select("skill_name")
    .eq("profile_id", profile.id)

  // Get stats (sessions count, etc)
  const { data: mentorSessions } = await supabase
    .from("sessions")
    .select("id")
    .eq("mentor_id", profile.id)

  const { data: menteeSessions } = await supabase
    .from("sessions")
    .select("id")
    .eq("mentee_id", profile.id)

  const { data: credits } = await supabase
    .from("credits")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle()

  // Combine all data
  return {
    data: {
      ...profile,
      skills: skills?.map(s => s.skill_name) || [],
      stats: {
        sessions: (mentorSessions?.length || 0) + (menteeSessions?.length || 0),
        rating: 4.9, // TODO: Calculate from reviews
        students: menteeSessions?.length || 0,
        earnings: credits?.balance || 0,
      }
    }
  }
}

export async function updateUserProfile(
  userId: string,
  updates: {
    name?: string
    bio?: string
    avatar_url?: string
    location?: string
    skills?: string[]
    role?: string
  },
) {
  const supabase = await createClient()

  // Get the profile_id for this user
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle()

  if (!profile) {
    return { error: "Profile not found" }
  }

  // Update profile
  const { name, bio, avatar_url, location, role, skills } = updates
  const profileUpdates: any = {}
  
  if (name !== undefined) profileUpdates.name = name
  if (bio !== undefined) profileUpdates.bio = bio
  if (avatar_url !== undefined) profileUpdates.avatar_url = avatar_url
  if (location !== undefined) profileUpdates.location = location
  if (role !== undefined) profileUpdates.role = role

  const { error: profileError } = await supabase
    .from("profiles")
    .update(profileUpdates)
    .eq("user_id", userId)

  if (profileError) {
    return { error: profileError.message }
  }

  // Update skills if provided
  if (skills && Array.isArray(skills)) {
    // Delete existing skills
    await supabase.from("skills").delete().eq("profile_id", profile.id)

    // Insert new skills
    if (skills.length > 0) {
      const skillsData = skills.map(skill => ({
        profile_id: profile.id,
        skill_name: skill,
      }))

      const { error: skillsError } = await supabase.from("skills").insert(skillsData)

      if (skillsError) {
        return { error: skillsError.message }
      }
    }
  }

  return { data: { success: true } }
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
