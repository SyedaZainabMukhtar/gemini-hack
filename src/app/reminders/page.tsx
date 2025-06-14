"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Switch } from "@/src/components/ui/switch"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Heart, ArrowLeft, Plus, Clock, Calendar, Pill, Activity, Users, TestTube } from "lucide-react"
import Link from "next/link"

interface Reminder {
  id: string
  title: string
  description: string
  type: "medication" | "medical" | "wellness" | "relationship" | "test"
  frequency: string
  time: string | null
  nextDue: string
  priority: "high" | "medium" | "low"
  enabled: boolean
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: "",
    type: "wellness" as const,
    frequency: "daily",
    time: "09:00",
  })

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      const response = await fetch("/api/reminders")
      const data = await response.json()
      if (data.success) {
        setReminders(data.reminders)
      }
    } catch (error) {
      console.error("Failed to fetch reminders:", error)
    }
  }

  const handleToggleReminder = async (id: string, enabled: boolean) => {
    setReminders((prev) => prev.map((reminder) => (reminder.id === id ? { ...reminder, enabled } : reminder)))
    // In real app, would update database
  }

  const handleAddReminder = async () => {
    if (!newReminder.title.trim()) return

    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newReminder,
          enabled: true,
          userId: "current-user",
        }),
      })

      const data = await response.json()
      if (data.success) {
        await fetchReminders() // Refresh the list
        setNewReminder({ title: "", type: "wellness", frequency: "daily", time: "09:00" })
        setShowAddForm(false)
      }
    } catch (error) {
      console.error("Failed to add reminder:", error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <Pill className="h-4 w-4" />
      case "medical":
        return <Calendar className="h-4 w-4" />
      case "wellness":
        return <Activity className="h-4 w-4" />
      case "relationship":
        return <Users className="h-4 w-4" />
      case "test":
        return <TestTube className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "medication":
        return "bg-blue-100 text-blue-700"
      case "medical":
        return "bg-red-100 text-red-700"
      case "wellness":
        return "bg-green-100 text-green-700"
      case "relationship":
        return "bg-purple-100 text-purple-700"
      case "test":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatNextDue = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays === 0) {
      if (diffHours === 0) return "Due now"
      if (diffHours > 0) return `In ${diffHours} hours`
      return "Overdue"
    } else if (diffDays === 1) {
      return "Tomorrow"
    } else if (diffDays > 1) {
      return `In ${diffDays} days`
    } else {
      return `${Math.abs(diffDays)} days overdue`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-mint-100 sticky top-0 z-50">
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
                <Heart className="h-6 w-6 text-mint-500" />
                <h1 className="text-xl font-bold text-gray-800">Smart Reminders</h1>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="bg-mint-500 hover:bg-mint-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Personalized Reminders</h2>
          <p className="text-gray-600">Stay on track with your pregnancy journey with smart, personalized reminders.</p>
        </div>

        {/* Add Reminder Form */}
        {showAddForm && (
          <Card className="mb-6 border-mint-200">
            <CardHeader>
              <CardTitle>Add New Reminder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Reminder Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Take prenatal vitamins"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newReminder.type}
                    onValueChange={(value: any) => setNewReminder((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                      <SelectItem value="relationship">Relationship</SelectItem>
                      <SelectItem value="test">Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={newReminder.frequency}
                    onValueChange={(value) => setNewReminder((prev) => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleAddReminder} className="bg-mint-500 hover:bg-mint-600">
                  Add Reminder
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <Card
              key={reminder.id}
              className={`border-l-4 ${reminder.enabled ? "border-l-mint-500" : "border-l-gray-300"}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className={`w-8 h-8 rounded-lg ${getTypeColor(reminder.type)} flex items-center justify-center`}
                      >
                        {getTypeIcon(reminder.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{reminder.title}</h3>
                        <p className="text-sm text-gray-600">{reminder.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-3">
                      <Badge variant="outline" className="capitalize">
                        {reminder.frequency}
                      </Badge>
                      {reminder.time && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{reminder.time}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(reminder.priority)}`}></div>
                        <span className="text-sm text-gray-500 capitalize">{reminder.priority} priority</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700">
                        Next due: {formatNextDue(reminder.nextDue)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={reminder.enabled}
                      onCheckedChange={(checked) => handleToggleReminder(reminder.id, checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {reminders.length === 0 && (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reminders Yet</h3>
                <p className="text-gray-500 mb-4">
                  Add your first reminder to stay on track with your pregnancy journey.
                </p>
                <Button onClick={() => setShowAddForm(true)} className="bg-mint-500 hover:bg-mint-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Reminder
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
