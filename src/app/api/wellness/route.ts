import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini 1.5 Flash for wellness recommendations
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Using stable Gemini 1.5 Flash
  generationConfig: {
    temperature: 0.6,
    maxOutputTokens: 500,
    topP: 0.8,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mood, energy, sleep, stress, notes, userId, userPreferences = {} } = body

    // In a real app, you would save this to a database
    const wellnessEntry = {
      id: Date.now().toString(),
      userId: userId || "anonymous",
      date: new Date().toISOString(),
      mood,
      energy,
      sleep,
      stress,
      notes,
      timestamp: Date.now(),
    }

    // Generate AI-powered personalized recommendations using Gemini 1.5
    const recommendations = await generateAIWellnessRecommendations({
      mood,
      energy,
      sleep,
      stress,
      notes,
      userPreferences,
    })

    return NextResponse.json({
      success: true,
      entry: wellnessEntry,
      recommendations,
    })
  } catch (error) {
    console.error("Wellness API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to save wellness data" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "anonymous"
    const days = Number.parseInt(searchParams.get("days") || "30")

    // In a real app, fetch from database
    const mockData = generateMockWellnessData(days)

    // Generate AI-powered wellness insights
    const aiInsights = await generateWellnessInsights(mockData)

    return NextResponse.json({
      success: true,
      data: mockData,
      summary: generateWellnessSummary(mockData),
      aiInsights,
    })
  } catch (error) {
    console.error("Wellness GET API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch wellness data" }, { status: 500 })
  }
}

async function generateAIWellnessRecommendations({ mood, energy, sleep, stress, notes, userPreferences }: any) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return generateFallbackRecommendations({ mood, energy, sleep, stress })
    }

    const pregnancyStage = userPreferences?.pregnancyStage || "second trimester"
    const currentWeek = userPreferences?.currentWeek || "24"

    const prompt = `You are a perinatal wellness expert and mental health specialist. Based on this wellness check-in data, provide personalized recommendations for a pregnant woman in ${pregnancyStage} (week ${currentWeek}):

Wellness Scores (1-10 scale):
- Mood: ${mood}/10
- Energy: ${energy}/10  
- Sleep Quality: ${sleep}/10
- Stress Level: ${stress}/10
- Additional Notes: "${notes || "None provided"}"

Guidelines:
- Provide 3-4 specific, actionable recommendations
- Consider pregnancy-safe activities and practices
- Use warm, supportive language
- Include both immediate and longer-term suggestions
- Reference pregnancy-specific wellness needs
- If scores indicate concerning patterns, gently suggest professional support

Format as JSON array with objects containing: type, title, suggestion, priority (high/medium/low), and pregnancy_specific (boolean).`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    try {
      // Try to parse as JSON, fallback to structured format if needed
      return JSON.parse(response)
    } catch {
      // Fallback to manual recommendations if AI response isn't valid JSON
      return generateFallbackRecommendations({ mood, energy, sleep, stress })
    }
  } catch (error) {
    console.error("AI Wellness Recommendations Error:", error)
    return generateFallbackRecommendations({ mood, energy, sleep, stress })
  }
}

async function generateWellnessInsights(data: any[]) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return "Your wellness journey shows both challenges and strengths. Continue monitoring your well-being and don't hesitate to reach out for support when needed."
    }

    const avgMood = data.reduce((sum, entry) => sum + entry.mood, 0) / data.length
    const avgEnergy = data.reduce((sum, entry) => sum + entry.energy, 0) / data.length
    const avgSleep = data.reduce((sum, entry) => sum + entry.sleep, 0) / data.length
    const avgStress = data.reduce((sum, entry) => sum + entry.stress, 0) / data.length

    const prompt = `You are a perinatal wellness analyst. Analyze this 30-day wellness data for a pregnant woman and provide insights:

Average Scores:
- Mood: ${avgMood.toFixed(1)}/10
- Energy: ${avgEnergy.toFixed(1)}/10
- Sleep: ${avgSleep.toFixed(1)}/10
- Stress: ${avgStress.toFixed(1)}/10

Recent trend data: ${JSON.stringify(data.slice(-7))}

Provide:
1. Overall wellness assessment (2-3 sentences)
2. Key patterns or trends noticed
3. Areas of strength to celebrate
4. Gentle suggestions for improvement
5. When to consider professional support

Use encouraging, pregnancy-focused language. Keep response under 200 words.`

    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error("AI Wellness Insights Error:", error)
    return "Your wellness journey shows both challenges and strengths. Continue monitoring your well-being and don't hesitate to reach out for support when needed."
  }
}

function generateFallbackRecommendations({ mood, energy, sleep, stress }: any) {
  const recommendations = []

  if (mood < 5) {
    recommendations.push({
      type: "mood",
      title: "Mood Support",
      suggestion:
        "Try gentle prenatal yoga, connect with supportive friends, or spend time in nature. Consider journaling about your feelings.",
      priority: "high",
      pregnancy_specific: true,
    })
  }

  if (energy < 4) {
    recommendations.push({
      type: "energy",
      title: "Energy Boost",
      suggestion:
        "Eat small, frequent meals with protein and complex carbs. Take short walks and ensure you're getting enough iron-rich foods.",
      priority: "medium",
      pregnancy_specific: true,
    })
  }

  if (sleep < 4) {
    recommendations.push({
      type: "sleep",
      title: "Sleep Improvement",
      suggestion:
        "Use pregnancy pillows for comfort, create a calming bedtime routine, and avoid screens 1 hour before bed.",
      priority: "high",
      pregnancy_specific: true,
    })
  }

  if (stress > 7) {
    recommendations.push({
      type: "stress",
      title: "Stress Management",
      suggestion:
        "Practice deep breathing exercises, try prenatal meditation apps, or consider talking to a counselor about your concerns.",
      priority: "high",
      pregnancy_specific: true,
    })
  }

  return recommendations
}

function generateMockWellnessData(days: number) {
  const data = []
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      mood: Math.floor(Math.random() * 4) + 5, // 5-8 range
      energy: Math.floor(Math.random() * 4) + 4, // 4-7 range
      sleep: Math.floor(Math.random() * 4) + 4, // 4-7 range
      stress: Math.floor(Math.random() * 4) + 3, // 3-6 range
    })
  }
  return data
}

function generateWellnessSummary(data: any[]) {
  const avgMood = data.reduce((sum, entry) => sum + entry.mood, 0) / data.length
  const avgEnergy = data.reduce((sum, entry) => sum + entry.energy, 0) / data.length
  const avgSleep = data.reduce((sum, entry) => sum + entry.sleep, 0) / data.length
  const avgStress = data.reduce((sum, entry) => sum + entry.stress, 0) / data.length

  return {
    averages: {
      mood: Math.round(avgMood * 10) / 10,
      energy: Math.round(avgEnergy * 10) / 10,
      sleep: Math.round(avgSleep * 10) / 10,
      stress: Math.round(avgStress * 10) / 10,
    },
    trends: {
      mood:
        data.length > 7
          ? data.slice(-7).reduce((sum, entry) => sum + entry.mood, 0) / 7 -
            data.slice(0, 7).reduce((sum, entry) => sum + entry.mood, 0) / 7
          : 0,
      energy:
        data.length > 7
          ? data.slice(-7).reduce((sum, entry) => sum + entry.energy, 0) / 7 -
            data.slice(0, 7).reduce((sum, entry) => sum + entry.energy, 0) / 7
          : 0,
    },
  }
}
