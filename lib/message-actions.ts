"use server"

import { createClient } from "@/lib/supabase/server"

export async function sendMessage(recipientId: string, content: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  if (user.id === recipientId) {
    return { error: "You cannot send messages to yourself" }
  }

  if (!content.trim()) {
    return { error: "Message content is required" }
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: user.id,
      recipient_id: recipientId,
      content: content.trim(),
      is_read: false,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getConversations() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  // Get all unique conversation partners
  const { data: messages, error } = await supabase
    .from("messages")
    .select(
      `
      id,
      sender_id,
      recipient_id,
      content,
      created_at,
      is_read,
      senderProfile:profiles!messages_sender_id_fkey(id, name, avatar_url),
      recipientProfile:profiles!messages_recipient_id_fkey(id, name, avatar_url)
    `
    )
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  // Group messages by conversation
  const conversations = new Map()

  messages.forEach((msg: any) => {
    const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id
    const otherUserProfile = msg.sender_id === user.id ? msg.recipientProfile : msg.senderProfile

    if (!conversations.has(otherUserId)) {
      conversations.set(otherUserId, {
        userId: otherUserId,
        profile: otherUserProfile,
        lastMessage: msg.content,
        lastMessageTime: msg.created_at,
        unreadCount: 0,
      })
    }

    // Count unread messages for this user
    if (msg.recipient_id === user.id && !msg.is_read) {
      const conv = conversations.get(otherUserId)
      conv.unreadCount += 1
    }
  })

  const conversationList = Array.from(conversations.values()).sort(
    (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  )

  return { data: conversationList }
}

export async function getConversationMessages(otherUserId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select(
      `
      id,
      sender_id,
      content,
      created_at,
      is_read,
      senderProfile:profiles!messages_sender_id_fkey(id, name, avatar_url)
    `
    )
    .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
    .order("created_at", { ascending: true })

  if (error) {
    return { error: error.message }
  }

  // Mark received messages as read
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("recipient_id", user.id)
    .eq("sender_id", otherUserId)

  const transformedMessages = messages.map((msg: any) => ({
    id: msg.id,
    content: msg.content,
    timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    sender: msg.senderProfile,
    isOwn: msg.sender_id === user.id,
    isRead: msg.is_read,
  }))

  return { data: transformedMessages }
}

export async function markMessagesAsRead(otherUserId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("recipient_id", user.id)
    .eq("sender_id", otherUserId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
