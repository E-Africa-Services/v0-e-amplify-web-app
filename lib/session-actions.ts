"use server"

import { createClient } from "@/lib/supabase/server"

export async function createSession(
  title: string,
  description: string,
  scheduledAt: Date,
  durationMinutes: number,
  price: number,
  menteeId?: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  if (!title || !description || !scheduledAt || durationMinutes <= 0 || price < 0) {
    return { error: "All fields are required" }
  }

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      mentor_id: user.id,
      mentee_id: menteeId || null,
      title,
      description,
      scheduled_at: scheduledAt.toISOString(),
      duration_minutes: durationMinutes,
      price,
      status: "scheduled",
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getUpcomingSessions(limit = 10) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select(
      `
      id,
      title,
      description,
      scheduled_at,
      duration_minutes,
      price,
      status,
      mentor_id,
      mentee_id,
      profiles!sessions_mentor_id_fkey(id, name, avatar_url, role)
    `
    )
    .or(`mentor_id.eq.${user.id},mentee_id.eq.${user.id}`)
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(limit)

  if (error) {
    return { error: error.message }
  }

  const transformedSessions = sessions.map((session: any) => ({
    id: session.id,
    title: session.title,
    description: session.description,
    scheduledAt: new Date(session.scheduled_at).toLocaleDateString(),
    time: new Date(session.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    duration: `${session.duration_minutes} min`,
    price: session.price,
    status: session.status,
    mentor: session.profiles,
    isMentor: session.mentor_id === user.id,
  }))

  return { data: transformedSessions }
}

export async function joinSession(sessionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  // Check if session exists and is available
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, mentee_id, status")
    .eq("id", sessionId)
    .single()

  if (sessionError || !session) {
    return { error: "Session not found" }
  }

  if (session.mentee_id && session.mentee_id !== user.id) {
    return { error: "Session is already booked by another user" }
  }

  if (session.status !== "scheduled") {
    return { error: "Session is not available for booking" }
  }

  const { data, error } = await supabase
    .from("sessions")
    .update({ mentee_id: user.id, status: "booked" })
    .eq("id", sessionId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function cancelSession(sessionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  // Verify ownership
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("mentor_id, mentee_id")
    .eq("id", sessionId)
    .single()

  if (sessionError || (session?.mentor_id !== user.id && session?.mentee_id !== user.id)) {
    return { error: "You can only cancel your own sessions" }
  }

  const { data, error } = await supabase
    .from("sessions")
    .update({ status: "cancelled" })
    .eq("id", sessionId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function completeSession(sessionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  // Only mentor can mark as complete
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("mentor_id")
    .eq("id", sessionId)
    .single()

  if (sessionError || session?.mentor_id !== user.id) {
    return { error: "Only the mentor can mark session as complete" }
  }

  const { data, error } = await supabase
    .from("sessions")
    .update({ status: "completed" })
    .eq("id", sessionId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}
