"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Progress } from "@/src/components/ui/progress"
import { Heart, Baby, MessageCircle, Camera, BookOpen, Bell, Users, Brain, Smile } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserPreferences {
  name: string
  dueDate: string
  currentWeek: string
  pregnancyStage: string
  babyGender: string
  theme: string
}

export default function HomePage() {
  const router = useRouter()
  const [userPrefs, setUserPrefs] = useState<UserPreferences | null>(null)
  const [currentWeek, setCurrentWeek] = useState(24)
  const [daysLeft, setDaysLeft] = useState(112)

  useEffect(() => {
    const prefs = localStorage.getItem("userPreferences")
    if (!prefs) {
      router.push("/onboarding")
      return
    }

    const parsedPrefs = JSON.parse(prefs)
    setUserPrefs(parsedPrefs)
    setCurrentWeek(Number.parseInt(parsedPrefs.currentWeek) || 24)

    // Calculate days left based on due date
    if (parsedPrefs.dueDate) {
      const due = new Date(parsedPrefs.dueDate)
      const today = new Date()
      const diffTime = due.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDaysLeft(Math.max(0, diffDays))
    }
  }, [router])

  if (!userPrefs) {
    return <div>Loading...</div>
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

  const theme = getThemeColors(userPrefs.theme)
  const progressPercentage = (currentWeek / 40) * 100

  const quickActions = [
    {
      title: "Chat with AI Doula",
      description: "Ask questions about your pregnancy",
      icon: MessageCircle,
      href: "/chat",
      color: `bg-${theme.primary}-100 text-${theme.primary}-700`,
    },
    {
      title: "Weekly Update",
      description: "See how your baby is developing",
      icon: Baby,
      href: "/weekly-updates",
      color: `bg-${theme.accent}-100 text-${theme.accent}-700`,
    },
    {
      title: "Journal Entry",
      description: "Record your thoughts and feelings",
      icon: BookOpen,
      href: "/journal",
      color: `bg-purple-100 text-purple-700`,
    },
    {
      title: "Ultrasound Gallery",
      description: "View and upload ultrasound photos",
      icon: Camera,
      href: "/ultrasounds",
      color: `bg-${theme.primary}-100 text-${theme.primary}-700`,
    },
    {
      title: "Partner Connection",
      description: "Share updates with your partner",
      icon: Users,
      href: "/partner",
      color: `bg-${theme.accent}-100 text-${theme.accent}-700`,
    },
    {
      title: "Wellness Check-in",
      description: "Mental health and mood tracking",
      icon: Smile,
      href: "/wellness",
      color: `bg-green-100 text-green-700`,
    },
  ]

  const upcomingReminders = [
    { title: "Prenatal Appointment", date: "Tomorrow, 2:00 PM", type: "medical" },
    { title: "Take Prenatal Vitamins", date: "Daily", type: "medication" },
    { title: "Hydration Reminder", date: "Every 2 hours", type: "wellness" },
    { title: "Partner Check-in", date: "This Evening", type: "relationship" },
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className={`h-8 w-8 text-${theme.primary}-500`} />
              <h1
                className={`text-2xl font-bold bg-gradient-to-r from-${theme.primary}-600 to-${theme.accent}-600 bg-clip-text text-transparent`}
              >
                MomEase
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-600" />
              <div className={`w-8 h-8 bg-${theme.primary}-200 rounded-full flex items-center justify-center`}>
                <span className={`text-sm font-medium text-${theme.primary}-700`}>
                  {userPrefs.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Good morning, {userPrefs.name}! 🌸</h2>
          <p className="text-gray-600 text-lg">You're doing amazing. Let's check on your journey today.</p>
        </div>

        {/* Pregnancy Progress */}
        <Card className={`mb-8 border-${theme.primary}-200 shadow-lg`}>
          <CardHeader className={`bg-gradient-to-r from-${theme.primary}-100 to-${theme.accent}-100`}>
            <CardTitle className="flex items-center space-x-2">
              <Baby className={`h-6 w-6 text-${theme.primary}-600`} />
              <span>Your Pregnancy Journey</span>
            </CardTitle>
            <CardDescription>Week {currentWeek} of 40</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={`text-center p-4 bg-${theme.primary}-50 rounded-lg`}>
                  <div className={`text-2xl font-bold text-${theme.primary}-600`}>{currentWeek}</div>
                  <div className="text-sm text-gray-600">Weeks</div>
                </div>
                <div className={`text-center p-4 bg-${theme.accent}-50 rounded-lg`}>
                  <div className={`text-2xl font-bold text-${theme.accent}-600`}>{daysLeft}</div>
                  <div className="text-sm text-gray-600">Days to go</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Today's Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Baby Development */}
          <Card className={`border-${theme.primary}-200`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Baby className={`h-5 w-5 text-${theme.primary}-600`} />
                <span>This Week: Baby Development</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-700">
                  Your baby is about the size of a <strong>cantaloupe</strong> this week!
                </p>
                <div className={`bg-${theme.primary}-50 p-4 rounded-lg`}>
                  <h4 className={`font-semibold text-${theme.primary}-800 mb-2`}>Key Developments:</h4>
                  <ul className={`text-sm text-${theme.primary}-700 space-y-1`}>
                    <li>• Hearing is fully developed</li>
                    <li>• Brain tissue is rapidly developing</li>
                    <li>• Baby can respond to sounds</li>
                  </ul>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/weekly-updates">View Full Update</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Smart Reminders */}
          <Card className="border-mint-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-mint-600" />
                <span>Smart Reminders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingReminders.map((reminder, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{reminder.title}</p>
                      <p className="text-sm text-gray-600">{reminder.date}</p>
                    </div>
                    <Badge variant={reminder.type === "medical" ? "default" : "secondary"}>{reminder.type}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/reminders">Manage Reminders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wellness Check-in */}
        <Card className="border-green-200 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smile className="h-5 w-5 text-green-600" />
              <span>Daily Wellness Check-in</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-800 font-medium mb-2">How are you feeling today?</p>
              <p className="text-green-700 text-sm">
                Take a moment to check in with yourself. Your mental health is just as important as your physical
                health.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/wellness">Quick Check-in</Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/wellness/meditation">Guided Meditation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
