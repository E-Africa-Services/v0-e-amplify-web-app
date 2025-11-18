"use client"

import { useState, useEffect, useRef } from "react"
import { getConversationMessages, sendMessage } from "@/lib/message-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  content: string
  timestamp: string
  sender: {
    id: string
    name: string
    avatar_url: string
  }
  isOwn: boolean
}

export function MessageThread({ userId, userName }: { userId: string; userName: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadMessages()
    // Refresh messages every 2 seconds
    const interval = setInterval(loadMessages, 2000)
    return () => clearInterval(interval)
  }, [userId])

  async function loadMessages() {
    setLoading(true)
    const result = await getConversationMessages(userId)
    if (result.data) {
      setMessages(result.data)
    }
    setLoading(false)
  }

  async function handleSendMessage() {
    if (!newMessage.trim()) return

    setIsSubmitting(true)
    const result = await sendMessage(userId, newMessage)

    if (result.data) {
      setNewMessage("")
      await loadMessages()
    }
    setIsSubmitting(false)
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-200 p-4">
        <h2 className="font-semibold">{userName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {loading && messages.length === 0 ? (
          <p className="text-sm text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500">No messages yet. Start a conversation!</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.isOwn ? "justify-end" : "justify-start"}`}
            >
              {!message.isOwn && message.sender.avatar_url && (
                <img
                  src={message.sender.avatar_url || "/placeholder.svg"}
                  alt={message.sender.name}
                  className="h-6 w-6 rounded-full"
                />
              )}
              <div
                className={`rounded-lg px-3 py-2 ${
                  message.isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70">{message.timestamp}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isSubmitting}
          />
          <Button onClick={handleSendMessage} disabled={isSubmitting || !newMessage.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
