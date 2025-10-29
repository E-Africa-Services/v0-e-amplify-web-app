"use server"

import { createClient } from "@/lib/supabase/server"

export async function getDashboardStats(userId: string) {
  const supabase = await createClient()

  try {
    // Fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (profileError) {
      return { error: profileError.message }
    }

    // Fetch mentorship sessions count
    const { count: sessionsCount, error: sessionsError } = await supabase
      .from("mentorship_sessions")
      .select("*", { count: "exact", head: true })
      .or(`mentor_id.eq.${userId},learner_id.eq.${userId}`)

    // Fetch connections count
    const { count: connectionsCount, error: connectionsError } = await supabase
      .from("connections")
      .select("*", { count: "exact", head: true })
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)

    // Fetch credit balance
    const { data: creditData, error: creditError } = await supabase
      .from("credit_transactions")
      .select("amount")
      .eq("user_id", userId)

    const totalCredits = creditData?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0

    // Fetch user reviews for rating
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("mentor_id", userId)

    const averageRating =
      reviews && reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : "0"

    return {
      data: {
        profile: userProfile,
        stats: {
          sessionsCount: sessionsCount || 0,
          connectionsCount: connectionsCount || 0,
          totalCredits,
          averageRating,
        },
      },
    }
  } catch (error) {
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
