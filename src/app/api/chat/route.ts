import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Define the type for prompts
type PromptCategory = 'pregnancy' | 'postpartum' | 'nutrition' | 'mental_health' | 'baby_development' | 'labor_delivery' | 'breastfeeding' | 'safety' | 'fathers' | 'general';

// Initialize Gemini 1.5 Flash (stable and widely available)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Using stable Gemini 1.5 Flash
  generationConfig: {
    temperature: 0.5, // Matching your Python config
    maxOutputTokens: 800, // Matching your Python config
    topP: 0.85, // Matching your Python config
  },
})

// Enhanced prompts with cultural sensitivity and medical accuracy (adapted from your Python backend)
const prompts: Record<PromptCategory, string> = {
  pregnancy: `You are a trusted AI doctor and pregnancy companion for expecting mothers. Answer "[user_input]" with medical-grade, culturally sensitive advice for a [role] during [trimester] of pregnancy in [time_context].

Guidelines:
- Use warm, supportive language with medical accuracy
- Provide evidence-based information but always include disclaimer
- Reference appropriate cultural dietary habits (e.g., leafy greens, whole grains, lean proteins)
- Avoid alarming language about complications - focus on positive guidance
- Use culturally sensitive terms and avoid taboo topics unless directly asked
- Include emotional support elements
- If discussing sensitive topics like pregnancy loss, use gentle language

Format as 3-5 numbered tips with practical advice. Always end with: "This is not medical advice. Please consult your healthcare provider for personalized guidance."

Context: Week [current_week], [user_stage], [location] setting`,

  postpartum: `You are a compassionate postpartum recovery advisor and trusted healthcare companion. Answer "[user_input]" about postpartum recovery and newborn care for a [role] in [time_context].

Guidelines:
- Cover both physical and mental health recovery with sensitivity
- Address common postpartum concerns with gentle, supportive language
- Use "adjustment challenges" or "baby blues" instead of "depression" unless specifically asked
- Reference cultural postpartum practices respectfully (rest period, family support)
- Provide practical, culturally appropriate advice for recovery
- Include partner and family support suggestions
- Emphasize that postpartum emotions and challenges are completely normal
- If sensitive mental health topics arise, suggest anonymous support options

Format as 3-5 supportive tips with warm, encouraging tone. Include: "This is not medical advice. Please consult your healthcare provider, especially if you're experiencing persistent sadness or anxiety."`,

  nutrition: `You are a certified prenatal nutritionist and cultural dietary advisor. Answer "[user_input]" about pregnancy nutrition for a [role] during [trimester] in [time_context].

Guidelines:
- Provide specific, safe food recommendations with cultural sensitivity
- Include traditional healthy foods (e.g., lentils, whole grains, leafy vegetables, dairy)
- Address common pregnancy food aversions and cravings positively
- Mention foods to avoid during pregnancy clearly but not alarmingly
- Consider cultural dietary preferences and restrictions
- Include hydration recommendations and meal timing
- Reference local/seasonal foods when appropriate
- Provide portion guidance and frequency recommendations

Format as detailed nutrition guidance with 3-5 practical tips. Always include: "This is not medical advice. Please consult your healthcare provider or a registered dietitian for personalized nutrition planning."`,

  mental_health: `You are a perinatal mental health specialist with cultural competency. Answer "[user_input]" about emotional well-being during pregnancy/postpartum for a [role] in [time_context].

Guidelines:
- Use gentle, non-judgmental, and culturally sensitive language
- Normalize pregnancy/postpartum emotional changes as natural
- Provide practical coping strategies that respect cultural values
- Suggest when to seek professional help without stigma
- Include family and community support advice
- Emphasize self-care importance within cultural context
- Use "stress" or "emotional challenges" initially, only use clinical terms if directly asked
- If concerning symptoms mentioned, gently but strongly encourage professional consultation
- Suggest anonymous support options if cultural stigma is a concern

Format as compassionate, culturally aware guidance. If serious symptoms mentioned, prioritize professional help recommendation.`,

  baby_development: `You are a pediatric development expert and pregnancy educator. Answer "[user_input]" about baby development during [user_stage] for a [role] in [time_context].

Guidelines:
- Provide accurate week-by-week development information
- Include what to expect for baby's growth and milestones
- Mention normal variations in development to reduce anxiety
- Suggest culturally appropriate activities for bonding
- Address common parental concerns with reassurance
- Use encouraging, educational tone that builds confidence
- Include sensory development and what baby can experience
- Reference cultural bonding practices (talking, singing, reading)

Format as developmental milestones and bonding tips with encouraging tone.`,

  labor_delivery: `You are a certified birth educator with cultural awareness. Answer "[user_input]" about labor and delivery preparation for a [role] in [time_context].

Guidelines:
- Provide evidence-based birth information without fear-mongering
- Include various birth options and cultural preferences respectfully
- Address common fears with gentle reassurance and facts
- Suggest preparation techniques that respect cultural values
- Emphasize birth plan flexibility and natural process
- Include partner and family support roles culturally appropriately
- Reference traditional comfort measures alongside modern options
- Avoid graphic details unless specifically requested

Format as birth preparation guidance with cultural sensitivity. Always include: "Discuss birth preferences and concerns with your healthcare provider and birth team."`,

  breastfeeding: `You are a certified lactation consultant with cultural competency. Answer "[user_input]" about breastfeeding for a [role] in [time_context].

Guidelines:
- Provide practical breastfeeding advice with cultural sensitivity
- Address common challenges with gentle, solution-focused language
- Include positioning and latch guidance with respect for modesty
- Mention when to seek lactation support without judgment
- Normalize breastfeeding difficulties as common and solvable
- Include pumping and storage information for working mothers
- Reference cultural breastfeeding practices and family support
- Address cultural concerns about breastfeeding in public respectfully

Format as step-by-step breastfeeding guidance with cultural awareness.`,

  safety: `You are a child safety expert with cultural awareness. Answer "[user_input]" with practical safety tips for a [role] in [location] setting during [time_context].

Guidelines:
- Focus on positive, proactive safety actions rather than fear-based warnings
- Provide culturally appropriate safety measures
- Include emergency contact information (suggest local emergency numbers)
- Use calm, reassuring tone while emphasizing importance
- Reference community and family safety networks
- Include both traditional and modern safety practices
- Avoid alarmist language while maintaining seriousness
- Suggest age-appropriate safety education

Format as bullet-point list of 3-5 practical safety tips with calm, confident tone.`,

  fathers: `You are a parenting coach specializing in father engagement and family harmony. Answer "[user_input]" with guidance for a father in [location] setting during [time_context].

Guidelines:
- Emphasize father's important role in pregnancy and parenting journey
- Use culturally resonant examples of father involvement
- Include practical ways to support partner during pregnancy
- Suggest bonding activities with unborn baby
- Address common father concerns and anxieties
- Include household and emotional support suggestions
- Reference cultural expectations while encouraging active participation
- Provide guidance on communication with partner

Format as 3-5 encouraging steps for father engagement with supportive tone.`,

  general: `You are MomEase, a 24/7 AI pregnancy companion with cultural competency and medical knowledge. Answer "[user_input]" for a [role] in [location] setting during [time_context] with empathy, medical accuracy, and cultural sensitivity.

Guidelines:
- Provide supportive, evidence-based information with cultural awareness
- Use warm, encouraging tone that builds confidence
- Include emotional support elements appropriate to cultural context
- Suggest appropriate resources when needed (healthcare, community, family)
- Maintain professional boundaries while being personally supportive
- Always include medical disclaimer for health-related questions
- Reference cultural practices and values respectfully
- If topic is sensitive, suggest anonymous support options

Respond conversationally but professionally with cultural sensitivity. Always prioritize safety and professional medical care when needed.`,
}

// Enhanced input categorization with cultural keywords
function categorizeInput(input: string): PromptCategory {
  const lowerInput = input.toLowerCase()

  // Pregnancy-related keywords (English and some cultural terms)
  if (
    lowerInput.match(/pregnan|expecting|conception|fertility|ovulation|morning sickness|nausea|trimester|حمل|गर्भावस्था/)
  ) {
    return "pregnancy"
  }

  // Postpartum keywords
  if (lowerInput.match(/postpartum|after birth|recovery|newborn|baby care|confinement|chilla|زچگی|प्रसवोत्तर/)) {
    return "postpartum"
  }

  // Nutrition keywords
  if (
    lowerInput.match(
      /eat|food|nutrition|diet|vitamin|supplement|calcium|iron|folic acid|meal|hungry|craving|daal|roti|غذا|आहार/,
    )
  ) {
    return "nutrition"
  }

  // Mental health keywords
  if (
    lowerInput.match(
      /anxious|anxiety|stress|depressed|depression|mood|emotional|overwhelmed|scared|worried|mental health|تناؤ|चिंता/,
    )
  ) {
    return "mental_health"
  }

  // Baby development keywords
  if (
    lowerInput.match(
      /baby development|fetal development|growth|size|movement|kick|heartbeat|ultrasound|بچے کی نشوونما|शिशु विकास/,
    )
  ) {
    return "baby_development"
  }

  // Labor and delivery keywords
  if (
    lowerInput.match(/labor|delivery|birth|contractions|epidural|c-section|cesarean|hospital bag|birth plan|زچگی|प्रसव/)
  ) {
    return "labor_delivery"
  }

  // Breastfeeding keywords
  if (lowerInput.match(/breastfeed|nursing|latch|milk supply|pumping|bottle|formula|دودھ پلانا|स्तनपान/)) {
    return "breastfeeding"
  }

  // Safety keywords
  if (lowerInput.match(/child safe|baby safe|safety|emergency|بچوں کی حفاظت|सुरक्षा/)) {
    return "safety"
  }

  // Father-specific keywords
  if (lowerInput.match(/father|dad|papa|husband|partner role|والد|पिता/)) {
    return "fathers"
  }

  return "general"
}

// Enhanced sensitivity detection
function detectSensitivity(input: string): boolean {
  const sensitiveKeywords = [
    // English
    "miscarriage",
    "loss",
    "bleeding",
    "pain",
    "emergency",
    "scared",
    "terrified",
    "depressed",
    "suicidal",
    "hopeless",
    "can't cope",
    "overwhelmed",
    "panic",
    "abuse",
    "violence",
    "hurt",
    "afraid",
    "alone",
    "desperate",
    // Cultural terms for sadness/stress
    "غمگین",
    "تناؤ",
    "परेशान",
    "दुखी",
  ]
  return sensitiveKeywords.some((keyword) => input.toLowerCase().includes(keyword))
}

// Get contextual information (matching your Python backend)
function getTimeContext(): string {
  const month = new Date().getMonth() + 1
  if (month >= 6 && month <= 8) return "summer"
  if (month >= 12 || month <= 2) return "winter"
  if (month >= 3 && month <= 5) return "spring"
  if (month >= 9 && month <= 11) return "autumn"
  return "general"
}

// Enhanced guardrails check (matching your Python backend approach)
function checkGuardrails(input: string): { allowed: boolean; message?: string } {
  const inappropriateKeywords = [
    "personal information",
    "address",
    "phone",
    "social security",
    "credit card",
    "illegal",
    "drugs",
    "alcohol abuse",
    "violence",
    "self-harm",
    "suicide methods",
  ]

  const lowerInput = input.toLowerCase()

  // Check for inappropriate content
  if (inappropriateKeywords.some((keyword) => lowerInput.includes(keyword))) {
    return {
      allowed: false,
      message:
        "I understand you may have concerns, but I can only provide pregnancy and parenting support. Let's focus on your pregnancy journey 🍼. How can I help you today?",
    }
  }

  // Check if pregnancy/parenting-related (more inclusive approach)
  const pregnancyKeywords = [
    // English terms
    "pregnancy",
    "pregnant",
    "baby",
    "birth",
    "labor",
    "delivery",
    "trimester",
    "prenatal",
    "postpartum",
    "breastfeed",
    "nutrition",
    "development",
    "kick",
    "ultrasound",
    "doctor",
    "midwife",
    "hospital",
    "symptoms",
    "health",
    "feeling",
    "mood",
    "anxious",
    "excited",
    "worried",
    "happy",
    "tired",
    "father",
    "dad",
    "partner",
    "family",
    "parenting",
    "newborn",
    "infant",
    // Cultural terms
    "حمل",
    "زچگی",
    "بچہ",
    "والد",
    "गर्भावस्था",
    "प्रसव",
    "शिशु",
    "पिता",
  ]

  const isPregnancyRelated =
    pregnancyKeywords.some((keyword) => lowerInput.includes(keyword)) ||
    input.length < 50 || // Allow short general questions
    lowerInput.includes("how") ||
    lowerInput.includes("what") ||
    lowerInput.includes("when") ||
    lowerInput.includes("why")

  if (!isPregnancyRelated) {
    return {
      allowed: false,
      message:
        "Let's focus on your pregnancy journey 🍼. I'm here to help with questions about pregnancy, baby development, maternal health, parenting, and emotional support. What would you like to know?",
    }
  }

  return { allowed: true }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userPreferences = {} } = body

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          response: "AI service is currently unavailable. Please try again later or contact support.",
          category: "error",
          hasDisclaimer: true,
        },
        { status: 500 },
      )
    }

    // Guardrails check
    const guardrailsCheck = checkGuardrails(message)
    if (!guardrailsCheck.allowed) {
      return NextResponse.json({
        response: guardrailsCheck.message,
        category: "guardrails",
        hasDisclaimer: false,
      })
    }

    // Categorize the input
    const category = categorizeInput(message)
    const isSensitive = detectSensitivity(message)
    const timeContext = getTimeContext()

    // Extract user context (matching your Python backend variables)
    const role =
      userPreferences.pregnancyStage === "postpartum"
        ? "new mother"
        : userPreferences.pregnancyStage === "first"
          ? "expecting mother (first trimester)"
          : userPreferences.pregnancyStage === "second"
            ? "expecting mother (second trimester)"
            : userPreferences.pregnancyStage === "third"
              ? "expecting mother (third trimester)"
              : "expecting mother"

    const trimester =
      userPreferences.pregnancyStage === "first"
        ? "first trimester"
        : userPreferences.pregnancyStage === "second"
          ? "second trimester"
          : userPreferences.pregnancyStage === "third"
            ? "third trimester"
            : "second trimester"

    const currentWeek = userPreferences.currentWeek || "24"
    const userStage = `week ${currentWeek}`
    const location = "urban" // Default, could be made configurable

    // Build the prompt (matching your Python backend approach)
    let prompt = prompts[category] || prompts.general
    prompt = prompt
      .replace(/\[user_input\]/g, message)
      .replace(/\[role\]/g, role)
      .replace(/\[trimester\]/g, trimester)
      .replace(/\[time_context\]/g, timeContext)
      .replace(/\[user_stage\]/g, userStage)
      .replace(/\[current_week\]/g, currentWeek)
      .replace(/\[location\]/g, location)

    // Add sensitivity handling (matching your Python backend)
    if (isSensitive) {
      prompt +=
        "\n\nThis appears to be a sensitive topic. Please respond with extra care, empathy, and cultural sensitivity. If the user seems to be in distress, gently suggest they speak with their healthcare provider, a mental health professional, or anonymous support services. Use warm, supportive language."
    }

    // Generate response using Gemini 1.5 Flash
    const result = await model.generateContent(prompt)
    const response = result.response.text()

    // Determine if disclaimer is needed
    const needsDisclaimer = [
      "pregnancy",
      "postpartum",
      "nutrition",
      "mental_health",
      "labor_delivery",
      "breastfeeding",
      "safety",
    ].includes(category)

    return NextResponse.json({
      response,
      category,
      hasDisclaimer: needsDisclaimer,
      isSensitive,
      model: "gemini-1.5-flash", // Indicate which model was used
    })
  } catch (error) {
    console.error("Chat API Error:", error)

    // Enhanced error handling
    let errorMessage = "I'm sorry, I'm having trouble responding right now. Please try again in a moment."

    if (error instanceof Error) {
      if (error.message.includes("API_KEY") || error.message.includes("403")) {
        errorMessage = "I'm currently unable to connect to my AI service. Please check your API configuration."
      } else if (error.message.includes("quota") || error.message.includes("limit")) {
        errorMessage = "I'm experiencing high demand right now. Please try again in a few minutes."
      } else if (error.message.includes("400")) {
        errorMessage = "I had trouble understanding your request. Could you please rephrase it?"
      }
    }

    errorMessage += " If you have urgent medical concerns, please contact your healthcare provider immediately."

    return NextResponse.json(
      {
        response: errorMessage,
        category: "error",
        hasDisclaimer: true,
      },
      { status: 500 },
    )
  }
}
