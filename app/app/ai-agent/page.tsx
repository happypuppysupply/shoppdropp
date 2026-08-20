'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  Send, 
  Sparkles, 
  Server, 
  Store, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Rocket,
  Square,
  Terminal,
  Activity as ActivityIcon,
  Wrench,
  Globe,
  FileText,
  Database,
  Zap,
  Clock,
  Trash2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ActivityLog, type Activity } from '@/components/agent/ActivityLog'
import { ChatMessage } from '@/components/agent/ChatMessage'
import { InteractiveQuestion } from '@/components/agent/InteractiveQuestion'
import { CATEGORIES } from '@/lib/categories'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
  interactive?: {
    type: 'multiselect' | 'select' | 'text'
    question: string
    options?: { id: string; label: string; description?: string }[]
    allowMultiple?: boolean
    placeholder?: string
  }
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
  const [messages, setMessages] = useState<Array<Message & { formData?: any }>>([
    { 
      role: 'assistant', 
      content: `ShoppDropp AI Agent ready. I can execute dropshipping tasks like product research, catalog sync, price optimization, and ad management.\n\nTo build your Facebook Ads effectively, I need to understand your store. Select your main product category:`,
      timestamp: new Date().toLocaleTimeString(),
      formData: {
        type: 'cards',
        options: CATEGORIES.map(cat => ({
          id: cat.id,
          label: cat.label,
          icon: cat.icon,
          description: cat.description
        }))
      }
    },
  ])
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState<ContextData | null>(null)
  const [loadingContext, setLoadingContext] = useState(true)
  const [onboardingComplete, setOnboardingComplete] = useState(true)
  const [activities, setActivities] = useState<Activity[]>([])
  const [totalToolsUsed, setTotalToolsUsed] = useState(0)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shoppdropp-api.onrender.com'

  // Animated thinking dots component
  function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, activities])

  // Load context and messages on mount
  useEffect(() => {
    loadContext()
    loadMessages()
  }, [])

  // Check onboarding status after context loads
  useEffect(() => {
    if (context?.stores && context.stores.length > 0) {
      checkOnboardingStatus()
    }
  }, [context])

  async function checkOnboardingStatus() {
    try {
      const token = await getAuthToken()
      if (!token || !context?.stores?.[0]?.id) return

      const response = await fetch(`${API_URL}/api/onboarding/state/${context.stores[0].id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setOnboardingComplete(data.isComplete)
      } else {
        setOnboardingComplete(false)
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error)
      setOnboardingComplete(false)
    }
  }

  async function getAuthToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) return session.access_token
    return localStorage.getItem('token')
  }

  async function loadContext() {
    try {
      const token = await getAuthToken()
      if (!token) {
        setLoadingContext(false)
        return
      }

      const response = await fetch(`${API_URL}/api/ai-chat/context`, {
        headers: { 'Authorization': `Bearer ${token}` },
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

  async function loadMessages() {
    try {
      setLoadingMessages(true)
      const token = await getAuthToken()
      if (!token) {
        setLoadingMessages(false)
        return
      }

      const response = await fetch(`${API_URL}/api/ai-chat/messages?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.messages && data.messages.length > 0) {
          // Convert database messages to UI format
          const loadedMessages = data.messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.created_at).toLocaleTimeString(),
          }))
          setMessages(loadedMessages)
        }
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  async function saveMessage(role: string, content: string, metadata: any = {}) {
    try {
      const token = await getAuthToken()
      if (!token) return

      await fetch(`${API_URL}/api/ai-chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          role,
          content,
          metadata,
        }),
      })
    } catch (error) {
      console.error('Failed to save message:', error)
    }
  }

  async function clearMessages() {
    try {
      const token = await getAuthToken()
      if (!token) return

      const response = await fetch(`${API_URL}/api/ai-chat/messages`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (response.ok) {
        // Reset to welcome message
        setMessages([
          { 
            role: 'assistant', 
            content: `ShoppDropp AI Agent ready. I can execute dropshipping tasks like product research, catalog sync, price optimization, and ad management.\n\nTo build your Facebook Ads effectively, I need to understand your store. Select your main product category:`,
            timestamp: new Date().toLocaleTimeString(),
            formData: {
              type: 'cards',
              options: CATEGORIES.map(cat => ({
                id: cat.id,
                label: cat.label,
                icon: cat.icon,
                description: cat.description
              }))
            }
          },
        ])
      }
    } catch (error) {
      console.error('Failed to clear messages:', error)
    }
  }

  // Simulate streaming activity for demo
  const simulateActivity = useCallback((taskType: string) => {
    const newActivities: Activity[] = []
    const activityTypes = ['tool', 'api', 'command', 'file']
    const labels = [
      'Analyzing market trends...',
      'Fetching product data from CJ Dropshipping...',
      'Optimizing product descriptions with AI...',
      'Syncing inventory with Shopify...',
      'Calculating profit margins...',
      'Generating Meta Ads creative...',
      'Updating pricing strategy...',
      'Writing SEO metadata...',
    ]

    let toolCount = 0

    // Add initial thinking activity
    newActivities.push({
      id: `thinking-${Date.now()}`,
      type: 'thinking',
      status: 'running',
      label: `Planning: ${taskType}`,
      detail: 'Breaking down task into sub-tasks',
      timestamp: new Date().toLocaleTimeString(),
    })

    // Simulate multiple tool calls
    for (let i = 0; i < 3 + Math.floor(Math.random() * 4); i++) {
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
      toolCount++
      
      newActivities.push({
        id: `activity-${Date.now()}-${i}`,
        type: type as any,
        status: 'running',
        label: labels[Math.floor(Math.random() * labels.length)],
        detail: `Executing ${type} call #${toolCount}`,
        timestamp: new Date().toLocaleTimeString(),
      })
    }

    setActivities(prev => [...prev, ...newActivities])
    setTotalToolsUsed(prev => prev + toolCount)

    // Mark activities as completed after delay
    setTimeout(() => {
      setActivities(prev => prev.map(a => 
        a.status === 'running' ? { ...a, status: 'completed' as const } : a
      ))
    }, 3000)
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    const timestamp = new Date().toLocaleTimeString()
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage, timestamp }]
    setMessages(newMessages)

    // Save user message to database
    await saveMessage('user', userMessage)

    // Simulate activity for the task
    simulateActivity(userMessage)

    try {
      const token = await getAuthToken()
      if (!token) {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: 'Please sign in to use the AI agent.',
          timestamp: new Date().toLocaleTimeString()
        }])
        setLoading(false)
        return
      }

      const conversationHistory = newMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))

      const response = await fetch(`${API_URL}/api/ai-chat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: conversationHistory.slice(-10),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString()
      }

      setMessages([...newMessages, assistantMessage])

      // Save assistant message to database
      await saveMessage('assistant', data.response)

      if (data.command_executed) {
        simulateActivity('Executing command: ' + data.command_executed.status)
      }

      // Refresh context if command was executed
      if (data.command_executed) {
        loadContext()
      }

    } catch (error: any) {
      console.error('Chat error:', error)
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: `Error: ${error.message || 'Something went wrong. Please try again.'}`,
        timestamp: new Date().toLocaleTimeString()
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

  // Process interactive question selection
  const processSelection = async (selectionMessage: string) => {
    setLoading(true)
    
    try {
      const token = await getAuthToken()
      if (!token) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Please sign in to continue.',
          timestamp: new Date().toLocaleTimeString()
        }])
        setLoading(false)
        return
      }

      const conversationHistory = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }))

      const response = await fetch(`${API_URL}/api/ai-chat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: selectionMessage,
          conversation_history: conversationHistory,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Save assistant message to database
      await saveMessage('assistant', data.response)

      if (data.command_executed) {
        simulateActivity('Executing command: ' + data.command_executed.status)
        loadContext()
      }
    } catch (error: any) {
      console.error('Selection processing error:', error)
      const errorContent = `Error: ${error.message || 'Something went wrong. Please try again.'}`
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date().toLocaleTimeString()
      }])
      // Save error message too
      await saveMessage('assistant', errorContent)
    } finally {
      setLoading(false)
    }
  }

  const stopAgent = () => {
    setLoading(false)
    setActivities(prev => prev.map(a => 
      a.status === 'running' ? { ...a, status: 'error' as const, label: a.label + ' (stopped)' } : a
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'provisioning': 
      case 'configuring': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6">
      {/* LEFT: Chat + Input */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Onboarding Banner - Triggers chat onboarding */}
        {!onboardingComplete && context?.stores && context.stores.length > 0 && messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Card className="bg-gradient-to-r from-violet-500/20 to-pink-500/20 border-violet-500/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Complete Store Setup</h3>
                    <p className="text-sm text-slate-300">
                      Answer a few questions in chat to unlock AI automation
                    </p>
                  </div>
                </div>
                <Button 
                  className="bg-violet-600 hover:bg-violet-500 text-white"
                  onClick={() => {
                    // Scroll to bottom to show the form
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Start in Chat
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Agent</h1>
              <p className="text-xs text-slate-400">Autonomous dropshipping executor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {messages.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearMessages}
                className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear Chat
              </Button>
            )}
            {totalToolsUsed > 0 && (
              <Badge variant="outline" className="border-violet-500/30 text-violet-300">
                <Wrench className="w-3 h-3 mr-1" />
                {totalToolsUsed} tools
              </Badge>
            )}
            {!loadingContext && context && (
              <>
                {context.ai_configured ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    AI Ready
                  </Badge>
                ) : (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    AI Not Configured
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <Card className="flex-1 bg-[#111118] border-white/10 overflow-hidden flex flex-col">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <div key={i} className="space-y-2">
                  <ChatMessage
                    role={msg.role as 'user' | 'assistant'}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    formData={(msg as any).formData}
                    onFormSubmit={(value) => {
                      // Add user response
                      setMessages(prev => [...prev, {
                        role: 'user',
                        content: typeof value === 'string' ? value : value.join(', '),
                        timestamp: new Date().toLocaleTimeString()
                      }])
                      
                      // Find selected category and show subcategories
                      const selectedCategory = CATEGORIES.find(c => c.id === value)
                      if (selectedCategory) {
                        setTimeout(() => {
                          setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: `Great! You selected ${selectedCategory.label}. Now choose your specific niche:`,
                            timestamp: new Date().toLocaleTimeString(),
                            formData: {
                              type: 'cards',
                              options: selectedCategory.subcategories.map(sub => ({
                                id: sub.id,
                                label: sub.label,
                                description: sub.description
                              }))
                            }
                          }])
                        }, 500)
                      }
                    }}
                  />
                  
                  {/* Interactive question component */}
                  {msg.interactive && msg.role === 'assistant' && (
                    <div className="flex gap-3">
                      <div className="w-8" />
                      <div className="max-w-[80%] flex-1">
                        <InteractiveQuestion
                          question={msg.interactive.question}
                          options={msg.interactive.options || []}
                          allowMultiple={msg.interactive.allowMultiple || msg.interactive.type === 'multiselect'}
                          onSubmit={(selected) => {
                            const selectedText = Array.isArray(selected)
                              ? selected.join(', ')
                              : selected
                            // Send the selection as a user message
                            const selectionMessage = `Selected: ${selectedText}`
                            setMessages(prev => [...prev, {
                              role: 'user',
                              content: selectionMessage,
                              timestamp: new Date().toLocaleTimeString()
                            }])
                            // Process the selection through the API
                            processSelection(selectionMessage)
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </AnimatePresence>
            
            {/* Thinking indicator - shows when AI is processing */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-violet-500 to-pink-500">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-[80%] p-3 rounded-lg bg-white/5 text-slate-200 flex items-center">
                  <ThinkingDots />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>
          
          {/* Input Area */}
          <CardHeader className="border-t border-white/10 pt-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tell the agent what to do (e.g., 'Research trending pet products')..."
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
              Try: "Find trending pet products", "Sync my catalog", "Optimize prices"
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* RIGHT: Activity Log */}
      <div className="w-80 flex-shrink-0">
        <Card className="h-full bg-[#111118] border-white/10 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <ActivityIcon className="w-4 h-4" />
              Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {activities.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activity yet</p>
                <p className="text-xs mt-1">Send a message to start tasks</p>
              </div>
            ) : (
              <ActivityLog 
                activities={activities} 
                isRunning={loading}
                totalTools={totalToolsUsed}
                onStop={stopAgent}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
