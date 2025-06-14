"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, ArrowLeft, ChevronLeft, ChevronRight, Baby, Ruler, Weight, Brain, Eye, Ear } from "lucide-react"
import Link from "next/link"

interface WeeklyData {
  week: number
  size: string
  weight: string
  length: string
  developments: string[]
  motherTips: string[]
  symptoms: string[]
  image: string
}

export default function WeeklyUpdatesPage() {
  const [currentWeek, setCurrentWeek] = useState(24)

  const weeklyData: Record<number, WeeklyData> = {
    20: {
      week: 20,
      size: "Banana",
      weight: "10.2 oz",
      length: "6.5 inches",
      developments: [
        "Baby can hear sounds from outside the womb",
        "Fingerprints are forming",
        "Hair is growing on the head",
        "Digestive system is developing",
      ],
      motherTips: [
        "Start talking and singing to your baby",
        "Consider prenatal yoga classes",
        "Schedule your anatomy scan",
        "Begin thinking about baby names",
      ],
      symptoms: ["Increased appetite", "Leg cramps", "Nasal congestion", "Skin changes"],
      image: "/placeholder.svg?height=200&width=200",
    },
    24: {
      week: 24,
      size: "Cantaloupe",
      weight: "1.3 lbs",
      length: "8.5 inches",
      developments: [
        "Hearing is fully developed",
        "Brain tissue is rapidly developing",
        "Baby can respond to sounds",
        "Taste buds are forming",
        "Lungs are developing air sacs",
      ],
      motherTips: [
        "Play music for your baby",
        "Start glucose screening preparation",
        "Consider childbirth classes",
        "Practice good posture as belly grows",
      ],
      symptoms: ["Backaches", "Heartburn", "Swollen feet", "Braxton Hicks contractions"],
      image: "/placeholder.svg?height=200&width=200",
    },
    28: {
      week: 28,
      size: "Eggplant",
      weight: "2.2 lbs",
      length: "10 inches",
      developments: [
        "Eyes can open and close",
        "Baby can dream (REM sleep)",
        "Bones are hardening",
        "Baby can hiccup",
        "Immune system is developing",
      ],
      motherTips: [
        "Start counting baby kicks",
        "Consider cord blood banking",
        "Plan your maternity leave",
        "Begin preparing the nursery",
      ],
      symptoms: ["Shortness of breath", "Trouble sleeping", "Frequent urination", "Round ligament pain"],
      image: "/placeholder.svg?height=200&width=200",
    },
  }

  const currentData = weeklyData[currentWeek] || weeklyData[24]
  const progressPercentage = (currentWeek / 40) * 100

  const navigateWeek = (direction: "prev" | "next") => {
    if (direction === "prev" && currentWeek > 1) {
      setCurrentWeek((prev) => prev - 1)
    } else if (direction === "next" && currentWeek < 40) {
      setCurrentWeek((prev) => prev + 1)
    }
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
                <h1 className="text-xl font-bold text-gray-800">Weekly Updates</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Week Navigation */}
        <Card className="mb-6 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" onClick={() => navigateWeek("prev")} disabled={currentWeek <= 1}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Week
              </Button>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Week {currentWeek}</h2>
                <p className="text-gray-600">of 40 weeks</p>
              </div>

              <Button variant="outline" onClick={() => navigateWeek("next")} disabled={currentWeek >= 40}>
                Next Week
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Pregnancy Progress</span>
                <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Baby Development */}
        <Card className="mb-6 border-pink-200">
          <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100">
            <CardTitle className="flex items-center space-x-2">
              <Baby className="h-6 w-6 text-pink-600" />
              <span>Your Baby This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-32 h-32 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Baby className="h-16 w-16 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Size of a {currentData.size}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Weight className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-semibold text-blue-800">{currentData.weight}</div>
                    <div className="text-xs text-blue-600">Weight</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Ruler className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <div className="text-lg font-semibold text-purple-800">{currentData.length}</div>
                    <div className="text-xs text-purple-600">Length</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Brain className="h-5 w-5 text-purple-600 mr-2" />
                  Key Developments
                </h4>
                <ul className="space-y-2">
                  {currentData.developments.map((development, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{development}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mother's Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-mint-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-mint-600" />
                <span>Tips for You</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {currentData.motherTips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-mint-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-yellow-600" />
                <span>Common Symptoms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentData.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {symptom}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                💡 Remember: Every pregnancy is different. Contact your healthcare provider if you have concerns.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Ear className="h-5 w-5 text-blue-600" />
              <span>Did You Know?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-medium mb-2">Week {currentWeek} Highlight:</p>
              <p className="text-blue-700 text-sm leading-relaxed">
                {currentWeek === 24
                  ? "Your baby's hearing is now fully developed! They can hear your voice, heartbeat, and even music. This is a great time to start talking, singing, or reading to your baby. Many parents find this is when they feel most connected to their unborn child."
                  : "Your baby is growing rapidly and developing new abilities every day. Each week brings exciting changes and milestones in your pregnancy journey."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
