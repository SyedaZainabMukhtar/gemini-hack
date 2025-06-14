"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Slider } from "@/src/components/ui/slider"
import { Textarea } from "@/src/components/ui/textarea"
import { Heart, ArrowLeft, Smile, Frown, Meh, Brain, Moon, Droplets, Activity } from "lucide-react"
import Link from "next/link"

export default function WellnessPage() {
  const [moodScore, setMoodScore] = useState([7])
  const [energyLevel, setEnergyLevel] = useState([6])
  const [sleepQuality, setSleepQuality] = useState([5])
  const [stressLevel, setStressLevel] = useState([4])
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitCheckin = () => {
    // Save wellness data
    const wellnessData = {
      date: new Date().toISOString(),
      mood: moodScore[0],
      energy: energyLevel[0],
      sleep: sleepQuality[0],
      stress: stressLevel[0],
      notes: notes,
    }

    // Store in localStorage (in real app, would save to database)
    const existingData = JSON.parse(localStorage.getItem("wellnessData") || "[]")
    existingData.push(wellnessData)
    localStorage.setItem("wellnessData", JSON.stringify(existingData))

    setSubmitted(true)
  }

  const getMoodIcon = (score: number) => {
    if (score >= 7) return <Smile className="h-6 w-6 text-green-500" />
    if (score >= 4) return <Meh className="h-6 w-6 text-yellow-500" />
    return <Frown className="h-6 w-6 text-red-500" />
  }

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600"
    if (score >= 4) return "text-yellow-600"
    return "text-red-600"
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-mint-50 to-blue-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-green-500" />
                <h1 className="text-xl font-bold text-gray-800">Wellness Check-in Complete</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="border-green-200 text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smile className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank you for checking in!</h2>
              <p className="text-gray-600 mb-6">
                Your wellness data has been recorded. Remember, taking care of your mental health is just as important
                as your physical health during pregnancy.
              </p>
              <div className="space-y-3">
                <Button className="w-full bg-green-500 hover:bg-green-600" asChild>
                  <Link href="/wellness/meditation">Try Guided Meditation</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/wellness/history">View Wellness History</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">Return to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-mint-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-green-500" />
              <h1 className="text-xl font-bold text-gray-800">Daily Wellness Check-in</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">How are you feeling today?</h2>
          <p className="text-gray-600">
            Take a moment to reflect on your mental and emotional well-being. Your feelings matter.
          </p>
        </div>

        <Card className="border-green-200 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-green-600" />
              <span>Mental Health Check-in</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Mood */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">Overall Mood</label>
                <div className="flex items-center space-x-2">
                  {getMoodIcon(moodScore[0])}
                  <span className={`font-semibold ${getScoreColor(moodScore[0])}`}>{moodScore[0]}/10</span>
                </div>
              </div>
              <Slider value={moodScore} onValueChange={setMoodScore} max={10} min={1} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Very Low</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">Energy Level</label>
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  <span className={`font-semibold ${getScoreColor(energyLevel[0])}`}>{energyLevel[0]}/10</span>
                </div>
              </div>
              <Slider value={energyLevel} onValueChange={setEnergyLevel} max={10} min={1} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Exhausted</span>
                <span>Very Energetic</span>
              </div>
            </div>

            {/* Sleep Quality */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">Sleep Quality</label>
                <div className="flex items-center space-x-2">
                  <Moon className="h-5 w-5 text-purple-500" />
                  <span className={`font-semibold ${getScoreColor(sleepQuality[0])}`}>{sleepQuality[0]}/10</span>
                </div>
              </div>
              <Slider
                value={sleepQuality}
                onValueChange={setSleepQuality}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Very Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Stress Level */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">Stress Level</label>
                <div className="flex items-center space-x-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <span className={`font-semibold ${getScoreColor(10 - stressLevel[0] + 1)}`}>{stressLevel[0]}/10</span>
                </div>
              </div>
              <Slider value={stressLevel} onValueChange={setStressLevel} max={10} min={1} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Very Low</span>
                <span>Very High</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Additional Notes (Optional)</label>
              <Textarea
                placeholder="How are you feeling? Any specific concerns or positive moments you'd like to record?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Wellness Tips */}
        <Card className="border-blue-200 mb-6">
          <CardHeader>
            <CardTitle>💡 Wellness Tips for Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Mindful Breathing:</strong> Take 5 deep breaths, inhaling for 4 counts and exhaling for 6
                  counts.
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Gentle Movement:</strong> Try a 10-minute walk or some prenatal stretches.
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Connection:</strong> Reach out to a friend or family member who makes you smile.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button onClick={handleSubmitCheckin} className="w-full bg-green-500 hover:bg-green-600 text-white py-3">
          Complete Check-in
        </Button>

        <p className="text-xs text-gray-500 text-center mt-4">
          💚 Remember: If you're experiencing persistent sadness, anxiety, or other concerning symptoms, please reach
          out to your healthcare provider or a mental health professional.
        </p>
      </div>
    </div>
  )
}
