"use server"

import { createClient } from "@/lib/supabase/server"

export async function getDashboardStats(userId: string) {
  const supabase = await createClient()

  try {
    // Fetch user profile with skills
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select(`
        *,
        skills(*)
      `)
      .eq("user_id", userId)
      .single()

    if (profileError) {
      return { error: profileError.message }
    }

    // Check if profile exists and has valid id
    if (!profileData || !profileData.id) {
      return {
        error: "Profile not found or invalid. Please ensure your account is properly set up."
      }
    }

    // Fetch sessions count (as mentor and mentee) in a single query
    const { count: sessionsCount, error: sessionsError } = await supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })
      .or(`mentor_id.eq.${profileData.id},mentee_id.eq.${profileData.id}`)

    const totalSessions = sessionsCount || 0

    // Fetch credit balance
    const { data: creditData, error: creditError } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", userId)
      .single()

    const totalCredits = creditData?.balance || 0

    // Fetch user reviews for rating (now using guaranteed profileData.id)
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("reviewee_id", profileData.id)

    const averageRating =
      reviews && reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : "0"

    return {
      data: {
        profile: profileData,
        stats: {
          sessionsCount: totalSessions,
          connectionsCount: 0, // Can be calculated from sessions
          totalCredits,
          averageRating,
        },
      },
    }
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return { error: error instanceof Error ? error.message : "Failed to fetch dashboard stats" }
  }
}

export async function getRecentActivity(userId: string, limit = 10) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to fetch activity" }
  }
}

export async function getUpcomingSessions(userId: string) {
  const supabase = await createClient()

  try {
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from("mentorship_sessions")
      .select("*")
      .or(`mentor_id.eq.${userId},learner_id.eq.${userId}`)
      .gte("scheduled_at", now)
      .order("scheduled_at", { ascending: true })
      .limit(5)

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to fetch sessions" }
  }
}
