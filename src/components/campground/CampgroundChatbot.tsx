'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, isTextUIPart } from 'ai'
import { MessageCircle, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { darkMode, effects } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

interface CampgroundChatbotProps {
  campgroundId: number
  campgroundTitle: string
}

export default function CampgroundChatbot({ campgroundId, campgroundTitle }: CampgroundChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat', body: { campgroundId } }),
    [campgroundId]
  )

  const { messages, sendMessage, status } = useChat({ transport })

  const isLoading = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    await sendMessage({ text })
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
        className={cn(
          'fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-xl',
          'hover:bg-emerald-700 active:scale-95',
          effects.transition.default
        )}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Ask a question</span>
      </button>

      {/* Chat panel overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />

          {/* Panel */}
          <div
            className={cn(
              'relative flex h-full w-full flex-col sm:max-w-sm',
              darkMode.bg.primary,
              'border-l',
              darkMode.border.default,
              'shadow-2xl'
            )}
          >
            {/* Header */}
            <div
              className={cn(
                'flex items-center justify-between border-b p-4',
                darkMode.border.default
              )}
            >
              <div>
                <p className={cn('font-semibold', darkMode.text.primary)}>Ask about this campground</p>
                <p className={cn('text-xs truncate max-w-[200px]', darkMode.text.muted)}>
                  {campgroundTitle}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className={cn(
                  'rounded-md p-1',
                  darkMode.text.muted,
                  'hover:bg-slate-100 dark:hover:bg-slate-800',
                  effects.transition.colors
                )}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className={cn('text-center text-sm pt-8', darkMode.text.muted)}>
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>Ask anything about this campground or camping in general.</p>
                </div>
              )}

              {messages.map((msg) => {
                const text = msg.parts.filter(isTextUIPart).map((p) => p.text).join('')
                if (!text) return null
                return (
                  <div
                    key={msg.id}
                    className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-2 text-sm',
                        msg.role === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-sm'
                          : cn(darkMode.bg.secondary, darkMode.text.primary, 'rounded-bl-sm')
                      )}
                    >
                      {text}
                    </div>
                  </div>
                )
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className={cn('rounded-2xl rounded-bl-sm px-4 py-3', darkMode.bg.secondary)}>
                    <div className="flex gap-1">
                      <span
                        className={cn('w-2 h-2 rounded-full animate-bounce', darkMode.bg.muted)}
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className={cn('w-2 h-2 rounded-full animate-bounce', darkMode.bg.muted)}
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className={cn('w-2 h-2 rounded-full animate-bounce', darkMode.bg.muted)}
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={cn('border-t p-4', darkMode.border.default)}>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
