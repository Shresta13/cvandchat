"use client"

import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/card"
import { MessageCircle, Send, X, Minus, Sparkles } from "lucide-react"
import messagesData from "@/app/chatbox/messages.json"

type Message = {
  id: number
  sender: string
  text: string
  timestamp: string
  avatar: string
}

export function ChatButton() {
  const [isOpen,      setIsOpen]      = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages,    setMessages]    = useState<Message[]>([
    {
      id: 1,
      sender: "assistant",
      text: "Hello! I'm your assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: messagesData.assistant.avatar,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading,  setIsLoading]  = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen, isMinimized])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return
    const userText = inputValue
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    setInputValue("")
    setIsLoading(true)

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: userText,
      timestamp: time,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
    }
    setMessages((prev) => [...prev, userMsg])

    try {
      const apiMessages = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }))
      apiMessages.push({ role: "user", content: userText })

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      })
      if (!res.ok) throw new Error("API Error")
      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "assistant",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: messagesData.assistant.avatar,
        },
      ])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  /* ── Floating button ── */
  if (!isOpen) {
    return (
      <>
        <style>{floatingBtnStyles}</style>
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Chat"
            className="chat-fab"
          >
            <span className="chat-fab-ring" />
            <MessageCircle size={22} className="relative z-10 text-white" />
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{chatStyles}</style>
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`chat-card ${isMinimized ? "minimized" : ""}`}>

          {/* ── Header ── */}
          <div className="chat-header">
            <div className="header-glow" />
            <div className="flex items-center gap-3 min-w-0 relative z-10">
              <div className="avatar-wrap">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={messagesData.assistant.avatar} />
                  <AvatarFallback className="avatar-fallback">AI</AvatarFallback>
                </Avatar>
                <span className="status-dot" />
              </div>
              <div className="min-w-0">
                <p className="header-name">{messagesData.assistant.name}</p>
                {!isMinimized && (
                  <p className="header-status">{messagesData.assistant.status}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 relative z-10">
              <button className="icon-btn" onClick={() => setIsMinimized(!isMinimized)} aria-label="Minimize">
                <Minus size={14} />
              </button>
              <button className="icon-btn close-btn" onClick={() => setIsOpen(false)} aria-label="Close">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          {!isMinimized && (
            <>
              <div className="chat-body">
                <div ref={scrollRef} className="messages-wrap">

                  {/* Date chip */}
                  <div className="date-chip">Today</div>

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`msg-row ${msg.sender === "user" ? "user" : "assistant"}`}
                    >
                      {msg.sender === "assistant" && (
                        <Avatar className="h-7 w-7 shrink-0 self-end">
                          <AvatarImage src={msg.avatar} />
                          <AvatarFallback className="avatar-fallback text-[10px]">A</AvatarFallback>
                        </Avatar>
                      )}

                      <div className="bubble-group">
                        <div className={`bubble ${msg.sender}`}>
                          {msg.text}
                        </div>
                        <span className="msg-time">{msg.timestamp}</span>
                      </div>

                      {msg.sender === "user" && (
                        <Avatar className="h-7 w-7 shrink-0 self-end">
                          <AvatarImage src={msg.avatar} />
                          <AvatarFallback className="avatar-fallback text-[10px]">U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isLoading && (
                    <div className="msg-row assistant">
                      <Avatar className="h-7 w-7 shrink-0 self-end">
                        <AvatarImage src={messagesData.assistant.avatar} />
                        <AvatarFallback className="avatar-fallback text-[10px]">A</AvatarFallback>
                      </Avatar>
                      <div className="bubble assistant typing-bubble">
                        <span className="dot" style={{ animationDelay: "0s" }} />
                        <span className="dot" style={{ animationDelay: "0.18s" }} />
                        <span className="dot" style={{ animationDelay: "0.36s" }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Input ── */}
              <div className="chat-footer">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage() }}
                  className="input-row"
                >
                  <input
                    className="chat-input"
                    placeholder="Type a message…"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="send-btn"
                    aria-label="Send"
                  >
                    <Send size={15} />
                  </button>
                </form>
                <p className="powered-by">
                  <Sparkles size={10} style={{ display: "inline", marginRight: 3 }} />
                  Powered by AI
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const floatingBtnStyles = `
  .chat-fab {
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00273D 0%, #004d75 100%);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0,39,61,0.45), 0 1px 4px rgba(0,0,0,0.2);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .chat-fab:hover {
    transform: scale(1.07);
    box-shadow: 0 6px 28px rgba(0,39,61,0.55);
  }
  .chat-fab:active { transform: scale(0.96); }
  .chat-fab-ring {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid rgba(0,39,61,0.25);
    animation: pulse-ring 2.5s ease-out infinite;
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: 0.6; }
    70%  { transform: scale(1.3); opacity: 0; }
    100% { transform: scale(1.3); opacity: 0; }
  }
`

const chatStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  .chat-card {
    font-family: 'DM Sans', sans-serif;
    width: min(370px, calc(100vw - 2.5rem));
    height: 520px;
    border-radius: 20px;
    background: #ffffff;
    box-shadow:
      0 24px 60px rgba(0,39,61,0.18),
      0 4px 16px rgba(0,0,0,0.08),
      0 0 0 1px rgba(0,39,61,0.07);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: height 0.3s cubic-bezier(.4,0,.2,1);
  }
  .chat-card.minimized {
    height: 62px;
  }

  /* Header */
  .chat-header {
    position: relative;
    background: linear-gradient(135deg, #00273D 0%, #00405f 100%);
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    flex-shrink: 0;
  }
  .header-glow {
    position: absolute;
    top: -30px; right: -20px;
    width: 120px; height: 120px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .avatar-wrap {
    position: relative;
  }
  .status-dot {
    position: absolute;
    bottom: 1px; right: 1px;
    width: 9px; height: 9px;
    border-radius: 50%;
    background: #4ade80;
    border: 2px solid #00273D;
  }
  .avatar-fallback {
    background: #EAF1F5;
    color: #00273D;
    font-size: 11px;
    font-weight: 600;
  }
  .header-name {
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.01em;
    line-height: 1.2;
    margin: 0;
  }
  .header-status {
    color: rgba(255,255,255,0.55);
    font-size: 11px;
    margin: 2px 0 0;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .header-status::before {
    content: '';
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #4ade80;
    flex-shrink: 0;
  }
  .icon-btn {
    width: 28px; height: 28px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.65);
    background: transparent;
    transition: background 0.15s, color 0.15s;
  }
  .icon-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
  .close-btn:hover { background: rgba(239,68,68,0.22); color: #fca5a5; }

  /* Body */
  .chat-body {
    flex: 1;
    overflow-y: auto;
    background: #f7f9fb;
    padding: 0;
    scrollbar-width: thin;
    scrollbar-color: #d1dde5 transparent;
  }
  .chat-body::-webkit-scrollbar { width: 4px; }
  .chat-body::-webkit-scrollbar-track { background: transparent; }
  .chat-body::-webkit-scrollbar-thumb { background: #d1dde5; border-radius: 4px; }

  .messages-wrap {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 14px 12px;
    min-height: 100%;
  }

  .date-chip {
    align-self: center;
    font-size: 10px;
    font-weight: 600;
    color: #94a3b8;
    background: #eef2f7;
    border-radius: 20px;
    padding: 3px 12px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  /* Message rows */
  .msg-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }
  .msg-row.user { flex-direction: row-reverse; }

  .bubble-group {
    display: flex;
    flex-direction: column;
    max-width: 72%;
  }
  .msg-row.user .bubble-group { align-items: flex-end; }
  .msg-row.assistant .bubble-group { align-items: flex-start; }

  .bubble {
    padding: 10px 14px;
    font-size: 13px;
    line-height: 1.55;
    border-radius: 18px;
    word-break: break-word;
  }
  .bubble.user {
    background: linear-gradient(135deg, #00273D 0%, #004d75 100%);
    color: #fff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,39,61,0.22);
  }
  .bubble.assistant {
    background: #ffffff;
    color: #1e3a4f;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,39,61,0.06);
  }
  .msg-time {
    font-size: 10px;
    color: #b0bec5;
    margin-top: 4px;
    padding: 0 2px;
  }

  /* Typing dots */
  .typing-bubble {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 12px 16px;
  }
  .dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #90a4b0;
    display: inline-block;
    animation: bounce-dot 1.1s ease-in-out infinite;
  }
  @keyframes bounce-dot {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
    40%            { transform: translateY(-5px); opacity: 1; }
  }

  /* Footer */
  .chat-footer {
    flex-shrink: 0;
    background: #ffffff;
    border-top: 1px solid #eef2f7;
    padding: 10px 12px 8px;
  }
  .input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f1f5f8;
    border-radius: 14px;
    padding: 4px 4px 4px 14px;
    border: 1.5px solid transparent;
    transition: border-color 0.2s, background 0.2s;
  }
  .input-row:focus-within {
    border-color: #00273D;
    background: #fff;
  }
  .chat-input {
    flex: 1;
    border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #1e3a4f;
    outline: none;
    padding: 6px 0;
  }
  .chat-input::placeholder { color: #9bb0bc; }
  .chat-input:disabled { opacity: 0.5; }

  .send-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #00273D 0%, #004d75 100%);
    color: #fff;
    flex-shrink: 0;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    box-shadow: 0 2px 8px rgba(0,39,61,0.3);
  }
  .send-btn:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0,39,61,0.4);
  }
  .send-btn:active:not(:disabled) { transform: scale(0.96); }
  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }

  .powered-by {
    text-align: center;
    font-size: 10px;
    color: #b0bec5;
    margin: 6px 0 0;
    letter-spacing: 0.02em;
  }
`