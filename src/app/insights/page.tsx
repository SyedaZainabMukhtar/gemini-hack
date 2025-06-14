"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Heart, ArrowLeft, Sparkles, TrendingUp, MessageSquare, Calendar, Users, Lightbulb } from "lucide-react"
import Link from "next/link"

interface SmartInsights {
  personalizedMessage: string
  weekHighlight: string
  wellnessInsight: string
  actionableAdvice: string[]
  motivationalQuote: string
  nextWeekPreview: string
  culturalTip: string
  partnerTip: string
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<SmartInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [userPreferences, setUserPreferences] = useState<any>(null)

  useEffect(() => {
    const prefs = localStorage.getItem("userPreferences")
    if (prefs) {
      setUserPreferences(JSON.parse(prefs))
    }
    generateInsights()
  }, [])

  const generateInsights = async () => {
    setLoading(true)
    try {
      // Get user data from localStorage (in real app, would fetch from database)
      const prefs = JSON.parse(localStorage.getItem("userPreferences") || "{}")
      const journalEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]")
      const wellnessData = JSON.parse(localStorage.getItem("wellnessData") || "[]")

      const response = await fetch("/api/smart-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPreferences: prefs,
          recentJournalEntries: journalEntries,
          wellnessData: wellnessData,
          pregnancySymptoms: [],
          insightType: "daily",
        }),
      })

      const data = await response.json()
      if (data.success) {
        setInsights(data.insights)
      }
    } catch (error) {
      console.error("Failed to generate insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case "boy":
        return {
          gradient: "from-blue-50 via-cyan-50 to-blue-100",
          primary: "blue",
          accent: "cyan",
        }
      case "girl":
        return {
          gradient: "from-pink-50 via-rose-50 to-pink-100",
          primary: "pink",
          accent: "rose",
        }
      case "neutral":
        return {
          gradient: "from-purple-50 via-lavender-50 to-mint-50",
          primary: "purple",
          accent: "mint",
        }
      default:
        return {
          gradient: "from-pink-50 via-purple-50 to-blue-50",
          primary: "pink",
          accent: "purple",
        }
    }
  }

  const theme = getThemeColors(userPreferences?.theme || "default")

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Generating your personalized insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
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
                <Heart className="h-6 w-6 text-purple-500" />
                <h1 className="text-xl font-bold text-gray-800">AI-Powered Insights</h1>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-700">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Gemini 2.5
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {insights && (
          <>
            {/* Personalized Welcome */}
            <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Personal Message</h2>
                    <p className="text-gray-700 leading-relaxed">{insights.personalizedMessage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* This Week Highlight */}
            <Card className="mb-6 border-pink-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-pink-600" />
                  <span>This Week's Highlight</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{insights.weekHighlight}</p>
              </CardContent>
            </Card>

            {/* Wellness Insight */}
            <Card className="mb-6 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Wellness Insight</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{insights.wellnessInsight}</p>
              </CardContent>
            </Card>

            {/* Actionable Advice */}
            <Card className="mb-6 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  <span>This Week's Action Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insights.actionableAdvice.map((advice, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{advice}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Cultural Tip */}
              <Card className="border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-lg">Cultural Wellness Tip</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed">{insights.culturalTip}</p>
                </CardContent>
              </Card>

              {/* Partner Tip */}
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>Partner Connection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed">{insights.partnerTip}</p>
                </CardContent>
              </Card>
            </div>

            {/* Next Week Preview */}
            <Card className="mb-6 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  <span>Looking Ahead</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{insights.nextWeekPreview}</p>
              </CardContent>
            </Card>

            {/* Motivational Quote */}
            <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-rose-600" />
                </div>
                <blockquote className="text-lg font-medium text-gray-800 italic mb-2">
                  "{insights.motivationalQuote}"
                </blockquote>
                <p className="text-sm text-gray-600">Your daily inspiration</p>
              </CardContent>
            </Card>

            {/* Refresh Button */}
            <div className="text-center mt-8">
              <Button onClick={generateInsights} className="bg-purple-500 hover:bg-purple-600">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate New Insights
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
