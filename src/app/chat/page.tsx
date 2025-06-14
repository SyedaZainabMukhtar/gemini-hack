"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Heart, Send, ArrowLeft, Bot, User, Sparkles, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  hasDisclaimer?: boolean
  category?: string
  isSensitive?: boolean
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI pregnancy companion powered by advanced AI technology. I'm here to support you through your journey with evidence-based information and emotional support. How are you feeling today? 🌸",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [userPreferences, setUserPreferences] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load user preferences
    const prefs = localStorage.getItem("userPreferences")
    if (prefs) {
      setUserPreferences(JSON.parse(prefs))
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickQuestions = [
    "What should I eat during pregnancy?",
    "How can I manage morning sickness?",
    "When should I feel baby movements?",
    "What are signs of labor?",
    "How to prepare for breastfeeding?",
    "How can I support my mental health?",
    "What exercises are safe during pregnancy?",
    "How much weight should I gain?",
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage("")
    setIsTyping(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          userPreferences: userPreferences,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
        hasDisclaimer: data.hasDisclaimer,
        category: data.category,
        isSensitive: data.isSensitive,
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Chat error:", error)
      setError("I'm having trouble connecting right now. Please check your internet connection and try again.")

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I'm having trouble responding right now. Please try again in a moment. If you have urgent medical concerns, please contact your healthcare provider immediately.",
        sender: "ai",
        timestamp: new Date(),
        hasDisclaimer: true,
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      pregnancy: "bg-pink-100 text-pink-700",
      postpartum: "bg-purple-100 text-purple-700",
      nutrition: "bg-green-100 text-green-700",
      mental_health: "bg-blue-100 text-blue-700",
      baby_development: "bg-yellow-100 text-yellow-700",
      labor_delivery: "bg-red-100 text-red-700",
      breastfeeding: "bg-indigo-100 text-indigo-700",
      general: "bg-gray-100 text-gray-700",
    }
    return colors[category] || colors.general
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-pink-500" />
                <h1 className="text-xl font-bold text-gray-800">AI Pregnancy Companion</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Safe & Supportive
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Guardrails Notice */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> I provide general pregnancy information and emotional support only. For medical
            advice, diagnosis, or treatment, always consult your healthcare provider.
          </AlertDescription>
        </Alert>

        {/* Quick Questions */}
        <Card className="mb-6 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span>Quick Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="mb-6 border-pink-200">
          <CardContent className="p-0">
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-pink-500 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === "ai" && <Bot className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />}
                        {message.sender === "user" && <User className="h-4 w-4 text-pink-100 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className={`text-xs ${message.sender === "user" ? "text-pink-100" : "text-gray-500"}`}>
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            {message.category && message.sender === "ai" && (
                              <Badge size="sm" className={getCategoryColor(message.category)}>
                                {message.category.replace("_", " ")}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {message.hasDisclaimer && (
                    <div className="flex justify-start mt-2">
                      <div className="max-w-xs lg:max-w-md">
                        <Alert className="border-yellow-200 bg-yellow-50">
                          <AlertTriangle className="h-3 w-3" />
                          <AlertDescription className="text-xs">
                            This is not medical advice. Please consult your healthcare provider.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  )}
                  {message.isSensitive && (
                    <div className="flex justify-start mt-1">
                      <div className="max-w-xs lg:max-w-md">
                        <Alert className="border-blue-200 bg-blue-50">
                          <Heart className="h-3 w-3" />
                          <AlertDescription className="text-xs">
                            Remember, you're not alone. Consider reaching out to your healthcare provider or a mental
                            health professional if you need additional support.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-purple-600" />
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card className="border-pink-200">
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about your pregnancy journey..."
                onKeyPress={(e) => e.key === "Enter" && !isTyping && handleSendMessage()}
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-pink-500 hover:bg-pink-600"
                disabled={isTyping || !inputMessage.trim()}
              >
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 I'm here to support your pregnancy journey with evidence-based information and emotional support.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
