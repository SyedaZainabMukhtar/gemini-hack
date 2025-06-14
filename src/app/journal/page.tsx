"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Heart, ArrowLeft, Plus, Calendar, Smile, Frown, Meh, Star } from "lucide-react"
import Link from "next/link"

interface JournalEntry {
  id: string
  title: string
  content: string
  mood: "happy" | "neutral" | "sad"
  date: Date
  week: number
  tags: string[]
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      title: "First Baby Kicks!",
      content:
        "Felt the baby kick so strongly today during lunch! It's amazing how real this is becoming. Can't wait to meet our little one. The kicks were right after I had some orange juice - maybe baby likes citrus!",
      mood: "happy",
      date: new Date("2024-01-15"),
      week: 23,
      tags: ["baby kicks", "excitement", "milestones"],
    },
    {
      id: "2",
      title: "Feeling Overwhelmed",
      content:
        "Had a tough day today. The nursery still isn't ready and I'm feeling anxious about everything that needs to be done. Partner was very supportive though. Need to remember to take things one day at a time.",
      mood: "sad",
      date: new Date("2024-01-12"),
      week: 23,
      tags: ["anxiety", "preparation", "support"],
    },
  ])

  const [showNewEntry, setShowNewEntry] = useState(false)
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "neutral" as "happy" | "neutral" | "sad",
    tags: "",
  })

  const handleSaveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
      date: new Date(),
      week: 24, // Current week
      tags: newEntry.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    }

    setEntries((prev) => [entry, ...prev])
    setNewEntry({ title: "", content: "", mood: "neutral", tags: "" })
    setShowNewEntry(false)
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "happy":
        return <Smile className="h-4 w-4 text-green-600" />
      case "sad":
        return <Frown className="h-4 w-4 text-red-600" />
      default:
        return <Meh className="h-4 w-4 text-yellow-600" />
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy":
        return "bg-green-100 text-green-700"
      case "sad":
        return "bg-red-100 text-red-700"
      default:
        return "bg-yellow-100 text-yellow-700"
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
                <h1 className="text-xl font-bold text-gray-800">Pregnancy Journal</h1>
              </div>
            </div>
            <Button onClick={() => setShowNewEntry(true)} className="bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* New Entry Form */}
        {showNewEntry && (
          <Card className="mb-6 border-purple-200">
            <CardHeader>
              <CardTitle>New Journal Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Entry title..."
                value={newEntry.title}
                onChange={(e) => setNewEntry((prev) => ({ ...prev, title: e.target.value }))}
              />

              <Textarea
                placeholder="How are you feeling today? What's on your mind?"
                value={newEntry.content}
                onChange={(e) => setNewEntry((prev) => ({ ...prev, content: e.target.value }))}
                rows={6}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling?</label>
                <div className="flex space-x-4">
                  {[
                    { value: "happy", icon: Smile, label: "Happy", color: "text-green-600" },
                    { value: "neutral", icon: Meh, label: "Neutral", color: "text-yellow-600" },
                    { value: "sad", icon: Frown, label: "Sad", color: "text-red-600" },
                  ].map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setNewEntry((prev) => ({ ...prev, mood: mood.value as any }))}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                        newEntry.mood === mood.value
                          ? "border-pink-300 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <mood.icon className={`h-5 w-5 ${mood.color}`} />
                      <span className="text-sm">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                placeholder="Tags (comma separated): baby kicks, cravings, anxiety..."
                value={newEntry.tags}
                onChange={(e) => setNewEntry((prev) => ({ ...prev, tags: e.target.value }))}
              />

              <div className="flex space-x-2">
                <Button onClick={handleSaveEntry} className="bg-pink-500 hover:bg-pink-600">
                  Save Entry
                </Button>
                <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Journal Entries */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Your Journey</h2>
            <Badge variant="secondary">{entries.length} entries</Badge>
          </div>

          {entries.map((entry) => (
            <Card key={entry.id} className="border-pink-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{entry.date.toLocaleDateString()}</span>
                      </div>
                      <Badge variant="outline">Week {entry.week}</Badge>
                      <Badge className={getMoodColor(entry.mood)}>
                        {getMoodIcon(entry.mood)}
                        <span className="ml-1 capitalize">{entry.mood}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 leading-relaxed">{entry.content}</p>

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {entries.length === 0 && !showNewEntry && (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="text-center py-12">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Start Your Pregnancy Journal</h3>
                <p className="text-gray-500 mb-4">
                  Document your thoughts, feelings, and milestones throughout your journey.
                </p>
                <Button onClick={() => setShowNewEntry(true)} className="bg-pink-500 hover:bg-pink-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Write Your First Entry
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
