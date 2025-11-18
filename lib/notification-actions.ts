"use server"

import { createClient } from "@/lib/supabase/server"

export type NotificationType = "follow" | "comment" | "message" | "session" | "post"

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  relatedUserId?: string,
  relatedSessionId?: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      type,
      title,
      message,
      related_user_id: relatedUserId || null,
      related_session_id: relatedSessionId || null,
      is_read: false,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating notification:", error)
    return { error: error.message }
  }

  return { data }
}

export async function getNotifications(limit = 20) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    return { error: error.message }
  }

  const transformedNotifications = notifications.map((notif: any) => ({
    id: notif.id,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    timestamp: new Date(notif.created_at).toLocaleDateString(),
    isRead: notif.is_read,
    relatedUserId: notif.related_user_id,
    relatedSessionId: notif.related_session_id,
  }))

  return { data: transformedNotifications }
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  // Verify ownership
  const { data: notification, error: fetchError } = await supabase
    .from("notifications")
    .select("user_id")
    .eq("id", notificationId)
    .single()

  if (fetchError || notification?.user_id !== user.id) {
    return { error: "You can only mark your own notifications as read" }
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function deleteNotification(notificationId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  // Verify ownership
  const { data: notification, error: fetchError } = await supabase
    .from("notifications")
    .select("user_id")
    .eq("id", notificationId)
    .single()

  if (fetchError || notification?.user_id !== user.id) {
    return { error: "You can only delete your own notifications" }
  }

  const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function getUnreadCount() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  if (error) {
    return { error: error.message }
  }

  return { data: { unreadCount: count || 0 } }
}
