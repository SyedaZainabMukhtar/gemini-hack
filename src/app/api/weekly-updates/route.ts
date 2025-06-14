import { type NextRequest, NextResponse } from "next/server"

const weeklyData: Record<number, any> = {
  4: {
    week: 4,
    size: "Poppy seed",
    weight: "0.04 oz",
    length: "0.04 inches",
    developments: [
      "Implantation occurs",
      "Pregnancy hormones begin production",
      "Basic cell layers form",
      "Neural tube begins to develop",
    ],
    motherTips: [
      "Start taking prenatal vitamins with folic acid",
      "Avoid alcohol and smoking completely",
      "Schedule your first prenatal appointment",
      "Begin tracking your symptoms",
    ],
    symptoms: ["Missed period", "Mild cramping", "Breast tenderness", "Fatigue"],
    trimester: 1,
  },
  8: {
    week: 8,
    size: "Raspberry",
    weight: "0.04 oz",
    length: "0.63 inches",
    developments: [
      "All major organs begin forming",
      "Heart starts beating regularly",
      "Arms and legs are developing",
      "Facial features are forming",
    ],
    motherTips: [
      "Eat small, frequent meals to combat nausea",
      "Stay hydrated with small sips throughout the day",
      "Get plenty of rest when possible",
      "Avoid strong smells that trigger nausea",
    ],
    symptoms: ["Morning sickness", "Food aversions", "Frequent urination", "Mood swings"],
    trimester: 1,
  },
  12: {
    week: 12,
    size: "Lime",
    weight: "0.49 oz",
    length: "2.13 inches",
    developments: [
      "All major organs are formed",
      "Fingernails and toenails appear",
      "Baby can make fists",
      "Reflexes are developing",
    ],
    motherTips: [
      "Consider sharing your pregnancy news",
      "Schedule your first trimester screening",
      "Start thinking about maternity clothes",
      "Begin gentle exercise routine",
    ],
    symptoms: ["Decreased nausea", "Increased energy", "Visible baby bump", "Skin changes"],
    trimester: 1,
  },
  16: {
    week: 16,
    size: "Avocado",
    weight: "3.53 oz",
    length: "4.57 inches",
    developments: [
      "Baby can hear sounds",
      "Facial expressions are possible",
      "Skeleton is hardening",
      "Circulatory system is functioning",
    ],
    motherTips: [
      "Start talking and singing to your baby",
      "Consider prenatal yoga classes",
      "Schedule your anatomy scan",
      "Begin researching childbirth classes",
    ],
    symptoms: ["Round ligament pain", "Nasal congestion", "Increased appetite", "Glowing skin"],
    trimester: 2,
  },
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
    trimester: 2,
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
    trimester: 2,
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
    trimester: 3,
  },
  32: {
    week: 32,
    size: "Jicama",
    weight: "3.75 lbs",
    length: "11.7 inches",
    developments: [
      "Baby's bones are hardening",
      "Rapid brain development",
      "Baby can regulate body temperature",
      "Fingernails reach fingertips",
    ],
    motherTips: [
      "Monitor baby's movements daily",
      "Prepare your hospital bag",
      "Finalize birth plan",
      "Start perineal massage",
    ],
    symptoms: ["Increased fatigue", "Braxton Hicks contractions", "Heartburn", "Swelling"],
    trimester: 3,
  },
  36: {
    week: 36,
    size: "Papaya",
    weight: "5.8 lbs",
    length: "13.4 inches",
    developments: [
      "Baby is considered full-term soon",
      "Lungs are nearly mature",
      "Baby's head may engage in pelvis",
      "Immune system is strengthening",
    ],
    motherTips: [
      "Pack your hospital bag completely",
      "Review signs of labor",
      "Prepare for breastfeeding",
      "Rest as much as possible",
    ],
    symptoms: ["Pelvic pressure", "Frequent urination", "Difficulty sleeping", "Nesting instinct"],
    trimester: 3,
  },
  40: {
    week: 40,
    size: "Watermelon",
    weight: "7.5 lbs",
    length: "20 inches",
    developments: [
      "Baby is full-term and ready for birth",
      "All organs are fully developed",
      "Baby has strong grip",
      "Vernix and lanugo are shedding",
    ],
    motherTips: [
      "Watch for signs of labor",
      "Stay calm and patient",
      "Continue gentle movement",
      "Trust your body's process",
    ],
    symptoms: ["Strong Braxton Hicks", "Pelvic pressure", "Mucus plug loss", "Nesting urge"],
    trimester: 3,
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const week = Number.parseInt(searchParams.get("week") || "24")

    // Find the closest week data
    const availableWeeks = Object.keys(weeklyData)
      .map(Number)
      .sort((a, b) => a - b)
    const closestWeek = availableWeeks.reduce((prev, curr) =>
      Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev,
    )

    const data = weeklyData[closestWeek]

    if (!data) {
      return NextResponse.json({ success: false, error: "Week data not found" }, { status: 404 })
    }

    // Add additional contextual information
    const enhancedData = {
      ...data,
      requestedWeek: week,
      actualWeek: closestWeek,
      progressPercentage: (week / 40) * 100,
      daysRemaining: Math.max(0, (40 - week) * 7),
      trimesterInfo: getTrimesterInfo(week),
    }

    return NextResponse.json({
      success: true,
      data: enhancedData,
    })
  } catch (error) {
    console.error("Weekly Updates API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch weekly data" }, { status: 500 })
  }
}

function getTrimesterInfo(week: number) {
  if (week <= 12) {
    return {
      number: 1,
      name: "First Trimester",
      description: "Foundation building - major organs develop",
      keyFocus: "Taking prenatal vitamins, avoiding harmful substances, managing early symptoms",
    }
  } else if (week <= 28) {
    return {
      number: 2,
      name: "Second Trimester",
      description: "The 'golden period' - energy returns, baby grows rapidly",
      keyFocus: "Anatomy scans, feeling baby movements, preparing for baby's arrival",
    }
  } else {
    return {
      number: 3,
      name: "Third Trimester",
      description: "Final preparations - baby's organs mature, preparing for birth",
      keyFocus: "Birth preparation, monitoring baby's movements, finalizing preparations",
    }
  }
}
