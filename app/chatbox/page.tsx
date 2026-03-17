'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Send, Circle } from 'lucide-react';
import messagesData from '@/app/chatbox/messages.json';

type Message = {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  avatar: string;
};

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'assistant',
      text: 'Hello! I am your task management assistant. How can I help you organize your work today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: messagesData.assistant.avatar
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  console.log(messages, "messages....")

  useEffect(() => {     
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setInputValue('');

    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      timestamp: time,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const apiMessages = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));
      apiMessages.push({ role: 'user', content: userText });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          avatar: messagesData.assistant.avatar,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm h-105 bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={messagesData.assistant.avatar} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">
                {messagesData.assistant.name}
              </p>
              <div className="flex items-center gap-1">
                <Circle className="h-2 w-2 fill-[#00273D] text-[#EAF1F5]0" />
                <span className="text-xs text-[#00273D]">
                  {messagesData.assistant.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? '▢' : '−'}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-red-500"
              onClick={() => router.push('/')}
            >
              ×
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className={`${isMinimized ? 'h-12' : 'flex-1'} bg-slate-50`}>
          <div ref={scrollRef} className="p-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.sender === 'assistant' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={msg.avatar} />
                  <AvatarFallback>
                    {msg.sender === 'user' ? 'U' : 'A'}
                  </AvatarFallback>
                </Avatar>

                <div className="max-w-[70%]">
                  <div
                    className={`px-3 py-2 rounded-xl text-sm ${
                      msg.sender === 'assistant'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        {!isMinimized && (
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="h-9 text-sm"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="h-9 w-9"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
