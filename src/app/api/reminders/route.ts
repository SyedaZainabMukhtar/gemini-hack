import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "anonymous"

    // In a real app, fetch from database based on user preferences and pregnancy stage
    const reminders = generateSmartReminders()

    return NextResponse.json({
      success: true,
      reminders,
    })
  } catch (error) {
    console.error("Reminders API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch reminders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, type, frequency, time, enabled, userId } = body

    const reminder = {
      id: Date.now().toString(),
      userId: userId || "anonymous",
      title,
      type,
      frequency,
      time,
      enabled,
      createdAt: new Date().toISOString(),
    }

    // In a real app, save to database

    return NextResponse.json({
      success: true,
      reminder,
    })
  } catch (error) {
    console.error("Reminders POST API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to create reminder" }, { status: 500 })
  }
}

function generateSmartReminders() {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return [
    {
      id: "1",
      title: "Take Prenatal Vitamins",
      description: "Daily prenatal vitamin with folic acid",
      type: "medication",
      frequency: "daily",
      time: "08:00",
      nextDue: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0).toISOString(),
      priority: "high",
      enabled: true,
    },
    {
      id: "2",
      title: "Prenatal Appointment",
      description: "Regular checkup with Dr. Smith",
      type: "medical",
      frequency: "custom",
      time: "14:00",
      nextDue: tomorrow.toISOString(),
      priority: "high",
      enabled: true,
    },
    {
      id: "3",
      title: "Hydration Check",
      description: "Drink a glass of water",
      type: "wellness",
      frequency: "every_2_hours",
      time: null,
      nextDue: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      priority: "medium",
      enabled: true,
    },
    {
      id: "4",
      title: "Gentle Exercise",
      description: "20-minute prenatal yoga or walk",
      type: "wellness",
      frequency: "daily",
      time: "17:00",
      nextDue: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0).toISOString(),
      priority: "medium",
      enabled: true,
    },
    {
      id: "5",
      title: "Partner Check-in",
      description: "Share today's pregnancy updates",
      type: "relationship",
      frequency: "daily",
      time: "20:00",
      nextDue: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0).toISOString(),
      priority: "low",
      enabled: true,
    },
    {
      id: "6",
      title: "Glucose Screening Test",
      description: "Important test between 24-28 weeks",
      type: "test",
      frequency: "custom",
      time: "10:00",
      nextDue: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "high",
      enabled: true,
    },
  ]
}
