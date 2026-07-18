'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Bot, Send, Sparkles, Server, Store, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  command_result?: any
}

interface ContextData {
  workers: Array<{
    id: string
    status: string
    ip: string
    server_id: string
  }>
  stores: Array<{
    id: string
    name: string
    platform: string
  }>
  ai_configured: boolean
}

export default function AIAgentPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm your ShoppDropp AI assistant. I can help you:\n\n• Provision and manage VPS workers\n• Monitor store performance\n• Run automation tasks\n• Control your dropshipping operations\n\nWhat would you like to do today?" 
    },
  ])
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState<ContextData | null>(null)
  const [loadingContext, setLoadingContext] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shoppdropp-api.onrender.com'

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load context on mount
  useEffect(() => {
    loadContext()
  }, [])

  async function loadContext() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoadingContext(false)
        return
      }

      const response = await fetch(`${API_URL}/api/ai-chat/context`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setContext(data)
      }
    } catch (error) {
      console.error('Failed to load context:', error)
    } finally {
      setLoadingContext(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: 'Please sign in to use the AI assistant.' 
        }])
        setLoading(false)
        return
      }

      // Build conversation history (exclude system messages for the API)
      const conversationHistory = newMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))

      const response = await fetch(`${API_URL}/api/ai-chat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: conversationHistory.slice(-10), // Last 10 messages
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get response')
      }

      const data = await response.json()
      
      // Add AI response
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
      }

      // Add command result if present
      if (data.command_executed) {
        assistantMessage.command_result = data.command_executed
      }

      setMessages([...newMessages, assistantMessage])

      // Refresh context if command was executed
      if (data.command_executed) {
        loadContext()
      }

    } catch (error: any) {
      console.error('Chat error:', error)
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: `Error: ${error.message || 'Something went wrong. Please try again.'}` 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'provisioning': 
      case 'configuring': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-violet-400" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">AI Agent</h1>
            <p className="text-slate-400">Your autonomous dropshipping assistant</p>
          </div>
        </div>
        
        {/* Context badges */}
        {!loadingContext && context && (
          <div className="flex items-center gap-2">
            {context.ai_configured ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                AI Connected
              </Badge>
            ) : (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                <AlertCircle className="w-3 h-3 mr-1" />
                AI Not Configured
              </Badge>
            )}
            {context.workers.map(w => (
              <Badge key={w.id} className={getStatusColor(w.status)}>
                <Server className="w-3 h-3 mr-1" />
                Worker: {w.status}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Worker/Store info cards */}
      {!loadingContext && context && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {context.workers.length > 0 && (
            <Card className="bg-[#111118] border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  Active Worker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Status:</span>
                    <span className={context.workers[0].status === 'running' ? 'text-green-400' : 'text-yellow-400'}>
                      {context.workers[0].status}
                    </span>
                  </div>
                  {context.workers[0].ip && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">IP:</span>
                      <span className="text-white font-mono">{context.workers[0].ip}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {context.stores.length > 0 && (
            <Card className="bg-[#111118] border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Store
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Name:</span>
                    <span className="text-white">{context.stores[0].name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Platform:</span>
                    <span className="text-white capitalize">{context.stores[0].platform}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Chat interface */}
      <Card className="bg-[#111118] border-white/10 flex flex-col h-[calc(100%-12rem)]">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className="space-y-2">
              <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-violet-500/20' : 'bg-pink-500/20'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <span className="text-xs text-violet-300">You</span>
                  ) : (
                    <Bot className="w-4 h-4 text-pink-400" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-violet-500/20 text-white'
                      : 'bg-white/5 text-slate-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
              
              {/* Command result */}
              {msg.command_result && (
                <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8" /> {/* Spacer */}
                  <div className="max-w-[80%] p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      {msg.command_result.status === 'success' || msg.command_result.status === 'queued' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : msg.command_result.status === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      ) : (
                        <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                      )}
                      <span className={`text-sm font-medium ${
                        msg.command_result.status === 'error' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        Command: {msg.command_result.status}
                      </span>
                    </div>
                    {msg.command_result.message && (
                      <p className="text-sm text-slate-300">{msg.command_result.message}</p>
                    )}
                    {msg.command_result.data && (
                      <pre className="mt-2 text-xs text-slate-400 bg-black/30 p-2 rounded overflow-auto">
                        {JSON.stringify(msg.command_result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        
        <CardHeader className="border-t border-white/10 pt-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your store, worker, or dropshipping..."
              className="bg-white/5 border-white/10 text-white"
              disabled={loading}
            />
            <Button 
              onClick={sendMessage} 
              className="bg-violet-600 hover:bg-violet-500"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Try: "provision a vps", "check worker status", "run product research task"
          </p>
        </CardHeader>
      </Card>
    </div>
  )
}
