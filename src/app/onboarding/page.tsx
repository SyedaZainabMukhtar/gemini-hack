"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { Heart, Baby, Palette, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    dueDate: "",
    currentWeek: "",
    pregnancyStage: "",
    babyGender: "",
    theme: "",
  })

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Save preferences and redirect to main app
      localStorage.setItem("userPreferences", JSON.stringify(formData))
      router.push("/")
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case "boy":
        return "from-blue-50 via-blue-100 to-cyan-50"
      case "girl":
        return "from-pink-50 via-rose-100 to-pink-50"
      case "neutral":
        return "from-purple-50 via-lavender-100 to-mint-50"
      default:
        return "from-pink-50 via-purple-50 to-blue-50"
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getThemeColors(formData.theme)}`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              MomEase
            </h1>
          </div>
          <p className="text-gray-600">Your personalized pregnancy companion</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= step ? "bg-pink-500" : "bg-gray-300"
                } transition-colors duration-300`}
              />
            ))}
          </div>
        </div>

        <Card className="border-pink-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
              {step === 1 && "Welcome! Let's get to know you"}
              {step === 2 && "Tell us about your pregnancy"}
              {step === 3 && "Choose your personalized theme"}
              {step === 4 && "Almost done!"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">What should we call you?</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">When is your due date?</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Pregnancy Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentWeek">How many weeks pregnant are you?</Label>
                  <Input
                    id="currentWeek"
                    type="number"
                    min="1"
                    max="42"
                    placeholder="e.g., 24"
                    value={formData.currentWeek}
                    onChange={(e) => setFormData({ ...formData, currentWeek: e.target.value })}
                  />
                </div>
                <div>
                  <Label>What stage are you in?</Label>
                  <RadioGroup
                    value={formData.pregnancyStage}
                    onValueChange={(value) => setFormData({ ...formData, pregnancyStage: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="first" id="first" />
                      <Label htmlFor="first">First Trimester (1-12 weeks)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="second" id="second" />
                      <Label htmlFor="second">Second Trimester (13-28 weeks)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="third" id="third" />
                      <Label htmlFor="third">Third Trimester (29-40 weeks)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="postpartum" id="postpartum" />
                      <Label htmlFor="postpartum">Postpartum</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 3: Theme Selection */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Palette className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-gray-600">Would you like a personalized color theme for your journey? 🌈</p>
                </div>
                <RadioGroup
                  value={formData.babyGender}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      babyGender: value,
                      theme: value === "boy" ? "boy" : value === "girl" ? "girl" : "neutral",
                    })
                  }}
                >
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-3 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                      <RadioGroupItem value="boy" id="boy" />
                      <Label htmlFor="boy" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                          <div>
                            <div className="font-medium">It's a boy! 💙</div>
                            <div className="text-sm text-gray-600">Soft blue theme</div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border-2 border-pink-200 rounded-lg hover:bg-pink-50 transition-colors">
                      <RadioGroupItem value="girl" id="girl" />
                      <Label htmlFor="girl" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-pink-400 rounded-full"></div>
                          <div>
                            <div className="font-medium">It's a girl! 💖</div>
                            <div className="text-sm text-gray-600">Soft pink theme</div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                      <RadioGroupItem value="surprise" id="surprise" />
                      <Label htmlFor="surprise" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-mint-400 rounded-full"></div>
                          <div>
                            <div className="font-medium">It's a surprise! ✨</div>
                            <div className="text-sm text-gray-600">Lavender & mint theme</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="text-center space-y-4">
                <Baby className="h-16 w-16 text-pink-500 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-800">You're all set, {formData.name}!</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
                  <p>
                    <strong>Due Date:</strong> {formData.dueDate}
                  </p>
                  <p>
                    <strong>Current Week:</strong> {formData.currentWeek}
                  </p>
                  <p>
                    <strong>Stage:</strong> {formData.pregnancyStage}
                  </p>
                  <p>
                    <strong>Theme:</strong>{" "}
                    {formData.babyGender === "boy"
                      ? "Boy (Blue)"
                      : formData.babyGender === "girl"
                        ? "Girl (Pink)"
                        : "Surprise (Lavender & Mint)"}
                  </p>
                </div>
                <p className="text-gray-600">Your personalized pregnancy journey starts now! 🌸</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-pink-500 hover:bg-pink-600"
                disabled={
                  (step === 1 && (!formData.name || !formData.dueDate)) ||
                  (step === 2 && (!formData.currentWeek || !formData.pregnancyStage)) ||
                  (step === 3 && !formData.babyGender)
                }
              >
                {step === 4 ? "Start Journey" : "Next"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
