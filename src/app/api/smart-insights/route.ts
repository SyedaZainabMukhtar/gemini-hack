import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini 1.5 Flash for smart insights
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Using stable Gemini 1.5 Flash
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 600,
    topP: 0.9,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userPreferences = {},
      recentJournalEntries = [],
      wellnessData = [],
      pregnancySymptoms = [],
      insightType = "daily",
    } = body

    const insights = await generateSmartInsights({
      userPreferences,
      recentJournalEntries,
      wellnessData,
      pregnancySymptoms,
      insightType,
    })

    return NextResponse.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString(),
      model: "gemini-1.5-flash",
    })
  } catch (error) {
    console.error("Smart Insights API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate insights" }, { status: 500 })
  }
}

async function generateSmartInsights({
  userPreferences,
  recentJournalEntries,
  wellnessData,
  pregnancySymptoms,
  insightType,
}: any) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return generateFallbackInsights(userPreferences)
    }

    const currentWeek = userPreferences.currentWeek || "24"
    const pregnancyStage = userPreferences.pregnancyStage || "second"
    const babyGender = userPreferences.babyGender || "unknown"
    const userName = userPreferences.name || "there"

    const prompt = `You are MomEase, an AI pregnancy companion powered by Gemini. Generate personalized ${insightType} insights for ${userName} who is in week ${currentWeek} of pregnancy (${pregnancyStage} trimester).

User Context:
- Current Week: ${currentWeek}
- Pregnancy Stage: ${pregnancyStage} trimester
- Baby Gender: ${babyGender}
- Name: ${userName}

Recent Data:
- Journal Entries: ${JSON.stringify(recentJournalEntries.slice(-3))}
- Wellness Scores: ${JSON.stringify(wellnessData.slice(-7))}
- Recent Symptoms: ${JSON.stringify(pregnancySymptoms)}

Generate insights in this JSON format:
{
  "personalizedMessage": "Warm, personalized message addressing user by name",
  "weekHighlight": "Key development or milestone for current week",
  "wellnessInsight": "Analysis of recent wellness patterns with encouragement",
  "actionableAdvice": ["3-4 specific, actionable tips for this week"],
  "motivationalQuote": "Pregnancy-related inspirational quote",
  "nextWeekPreview": "What to expect next week",
  "culturalTip": "Culturally sensitive wellness or nutrition tip",
  "partnerTip": "Suggestion for partner involvement this week"
}

Guidelines:
- Use warm, encouraging tone
- Reference specific user data when available
- Provide medically accurate but non-diagnostic information
- Include cultural sensitivity
- Focus on empowerment and positivity
- Always include disclaimer about consulting healthcare provider`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error("No JSON found in response")
    } catch (parseError) {
      // Fallback to structured insights if JSON parsing fails
      return generateFallbackInsights(userPreferences)
    }
  } catch (error) {
    console.error("Generate Smart Insights Error:", error)
    return generateFallbackInsights(userPreferences)
  }
}

function generateFallbackInsights(userPreferences: any) {
  const currentWeek = userPreferences.currentWeek || "24"
  const userName = userPreferences.name || "there"

  return {
    personalizedMessage: `Hello ${userName}! You're doing wonderfully in week ${currentWeek} of your pregnancy journey.`,
    weekHighlight:
      "Your baby's hearing is developing rapidly this week, and they can now respond to sounds from outside the womb.",
    wellnessInsight: "Remember to take time for self-care and listen to your body's needs during this important time.",
    actionableAdvice: [
      "Talk or sing to your baby - they can hear you now!",
      "Stay hydrated with 8-10 glasses of water daily",
      "Practice gentle prenatal exercises",
      "Get plenty of rest when your body needs it",
    ],
    motivationalQuote:
      "You are stronger than you believe, more talented than you think, and capable of more than you imagine.",
    nextWeekPreview: "Next week, your baby will continue growing and developing new skills.",
    culturalTip:
      "Include iron-rich foods like leafy greens and lentils in your daily meals for healthy blood production.",
    partnerTip: "Encourage your partner to talk to the baby and attend prenatal appointments when possible.",
  }
}
