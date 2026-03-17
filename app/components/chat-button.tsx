"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/card"
import { MessageCircle, Send, X, Minus } from "lucide-react"
import messagesData from "@/app/chatbox/messages.json"

const brand = {
  primary:     '#00273D',
  primaryDark: '#001D2E',
  light:       '#EAF1F5',
  border:      '#e5e7eb',
}

type Message = {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  avatar: string;
};

export function ChatButton() {
  const [isOpen,       setIsOpen]       = useState(false)
  const [isMinimized,  setIsMinimized]  = useState(false)
  const [messages,     setMessages]     = useState<Message[]>([
    {
      id: 1,
      sender: 'assistant',
      text: 'Hello! I am your assistant. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: messagesData.assistant.avatar,
    }
  ])
  const [inputValue,   setInputValue]   = useState('')
  const [isLoading,    setIsLoading]    = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen, isMinimized])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userText = inputValue
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    setInputValue('')
    setIsLoading(true)

    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      timestamp: time,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    }

    setMessages((prev) => [...prev, userMsg])

    try {
      const apiMessages = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }))
      apiMessages.push({ role: 'user', content: userText })

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) throw new Error('API Error')
      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: messagesData.assistant.avatar,
        },
      ])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Floating button ──
  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Chat"
          className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-150 hover:shadow-xl active:scale-95 sm:h-15 sm:w-15"
          style={{ backgroundColor: brand.primary }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.primaryDark)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.primary)}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      <Card
        className={`
          flex flex-col overflow-hidden rounded-2xl shadow-2xl border
          transition-all duration-300 ease-in-out
          w-[calc(100vw-2.5rem)] sm:w-[360px]
          ${isMinimized ? 'h-[60px]' : 'h-[75vh] sm:h-[520px]'}
        `}
        style={{ borderColor: brand.border }}
      >

        {/* ── Header ── */}
        <CardHeader
          className="flex shrink-0 flex-row items-center justify-between space-y-0 border-b px-4 py-3"
          style={{ backgroundColor: brand.primary, borderColor: brand.primaryDark }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-8 w-8 shrink-0 border-2 border-white/20">
              <AvatarImage src={messagesData.assistant.avatar} />
              <AvatarFallback className="text-xs" style={{ backgroundColor: brand.light, color: brand.primary }}>
                AI
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {messagesData.assistant.name}
              </p>
              {!isMinimized && (
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                  </span>
                  <span className="text-xs text-white/70">{messagesData.assistant.status}</span>
                </div>
              )}
            </div>
          </div>

          {/* Minimize + Close */}
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Minus size={15} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-red-500/20 hover:text-red-300"
            >
              <X size={15} />
            </button>
          </div>
        </CardHeader>

        {/* ── Messages ── */}
        {!isMinimized && (
          <>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div ref={scrollRef} className="space-y-4 px-4 py-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src={msg.avatar} />
                        <AvatarFallback className="text-xs">
                          {msg.sender === 'user' ? 'U' : 'A'}
                        </AvatarFallback>
                      </Avatar>

                      <div className={`flex max-w-[75%] flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                          className="rounded-2xl px-3 py-2 text-sm leading-relaxed"
                          style={
                            msg.sender === 'user'
                              ? { backgroundColor: brand.primary, color: '#fff', borderBottomRightRadius: '4px' }
                              : { backgroundColor: brand.light, color: brand.primary, borderBottomLeftRadius: '4px' }
                          }
                        >
                          {msg.text}
                        </div>
                        <span className="mt-1 text-[10px] text-gray-400">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Loading dots */}
                  {isLoading && (
                    <div className="flex items-end gap-2">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src={messagesData.assistant.avatar} />
                        <AvatarFallback className="text-xs">A</AvatarFallback>
                      </Avatar>
                      <div
                        className="flex items-center gap-1 rounded-2xl px-4 py-3"
                        style={{ backgroundColor: brand.light, borderBottomLeftRadius: '4px' }}
                      >
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="h-1.5 w-1.5 animate-bounce rounded-full"
                            style={{ backgroundColor: brand.primary, animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* ── Input footer ── */}
            <CardFooter
              className="shrink-0 border-t p-3"
              style={{ borderColor: brand.border, backgroundColor: '#fff' }}
            >
              <form
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex w-full items-center gap-2"
              >
                <input
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 disabled:opacity-50"
                  style={{
                    borderColor: brand.border,
                    color: brand.primary,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = brand.primary)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = brand.border)}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition-all hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ backgroundColor: brand.primary }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.primaryDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.primary)}
                >
                  <Send size={15} />
                </button>
              </form>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}