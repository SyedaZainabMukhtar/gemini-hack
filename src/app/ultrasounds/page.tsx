"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, ArrowLeft, Upload, Calendar, Camera, Download, Share } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface UltrasoundImage {
  id: string
  url: string
  week: number
  date: Date
  notes: string
  trimester: 1 | 2 | 3
}

export default function UltrasoundsPage() {
  const [ultrasounds, setUltrasounds] = useState<UltrasoundImage[]>([
    {
      id: "1",
      url: "/placeholder.svg?height=300&width=400",
      week: 12,
      date: new Date("2023-12-15"),
      notes: "First trimester scan - everything looks perfect! Baby is measuring right on track.",
      trimester: 1,
    },
    {
      id: "2",
      url: "/placeholder.svg?height=300&width=400",
      week: 20,
      date: new Date("2024-01-10"),
      notes: "Anatomy scan - It's a girl! All organs developing normally. She was very active during the scan.",
      trimester: 2,
    },
    {
      id: "3",
      url: "/placeholder.svg?height=300&width=400",
      week: 24,
      date: new Date("2024-01-15"),
      notes: "Growth scan - Baby is in the 60th percentile for size. Face is becoming more defined!",
      trimester: 2,
    },
  ])

  const [showUpload, setShowUpload] = useState(false)
  const [newUltrasound, setNewUltrasound] = useState({
    week: "",
    notes: "",
    file: null as File | null,
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewUltrasound((prev) => ({ ...prev, file }))
    }
  }

  const handleSaveUltrasound = () => {
    if (!newUltrasound.file || !newUltrasound.week) return

    const ultrasound: UltrasoundImage = {
      id: Date.now().toString(),
      url: URL.createObjectURL(newUltrasound.file),
      week: Number.parseInt(newUltrasound.week),
      date: new Date(),
      notes: newUltrasound.notes,
      trimester: Number.parseInt(newUltrasound.week) <= 12 ? 1 : Number.parseInt(newUltrasound.week) <= 28 ? 2 : 3,
    }

    setUltrasounds((prev) => [ultrasound, ...prev])
    setNewUltrasound({ week: "", notes: "", file: null })
    setShowUpload(false)
  }

  const getTrimesterColor = (trimester: number) => {
    switch (trimester) {
      case 1:
        return "bg-pink-100 text-pink-700"
      case 2:
        return "bg-purple-100 text-purple-700"
      case 3:
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const groupedUltrasounds = ultrasounds.reduce(
    (acc, ultrasound) => {
      const trimester = ultrasound.trimester
      if (!acc[trimester]) {
        acc[trimester] = []
      }
      acc[trimester].push(ultrasound)
      return acc
    },
    {} as Record<number, UltrasoundImage[]>,
  )

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
                <h1 className="text-xl font-bold text-gray-800">Ultrasound Gallery</h1>
              </div>
            </div>
            <Button onClick={() => setShowUpload(true)} className="bg-pink-500 hover:bg-pink-600">
              <Upload className="h-4 w-4 mr-2" />
              Upload Ultrasound
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Upload Form */}
        {showUpload && (
          <Card className="mb-6 border-purple-200">
            <CardHeader>
              <CardTitle>Upload New Ultrasound</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ultrasound-file">Ultrasound Image</Label>
                <Input id="ultrasound-file" type="file" accept="image/*" onChange={handleFileUpload} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="week">Pregnancy Week</Label>
                <Input
                  id="week"
                  type="number"
                  min="1"
                  max="42"
                  placeholder="e.g., 20"
                  value={newUltrasound.week}
                  onChange={(e) => setNewUltrasound((prev) => ({ ...prev, week: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="Add any notes about this scan..."
                  value={newUltrasound.notes}
                  onChange={(e) => setNewUltrasound((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSaveUltrasound} className="bg-pink-500 hover:bg-pink-600">
                  Save Ultrasound
                </Button>
                <Button variant="outline" onClick={() => setShowUpload(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gallery */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Your Baby's Journey</h2>
            <Badge variant="secondary">{ultrasounds.length} images</Badge>
          </div>

          {Object.entries(groupedUltrasounds)
            .sort(([a], [b]) => Number.parseInt(a) - Number.parseInt(b))
            .map(([trimester, images]) => (
              <div key={trimester}>
                <div className="flex items-center space-x-2 mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {trimester === "1" ? "First" : trimester === "2" ? "Second" : "Third"} Trimester
                  </h3>
                  <Badge className={getTrimesterColor(Number.parseInt(trimester))}>
                    {images.length} image{images.length !== 1 ? "s" : ""}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((ultrasound) => (
                    <Card key={ultrasound.id} className="border-pink-200 hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative aspect-[4/3] bg-gray-100 rounded-t-lg overflow-hidden">
                          <Image
                            src={ultrasound.url || "/placeholder.svg"}
                            alt={`Ultrasound at week ${ultrasound.week}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getTrimesterColor(ultrasound.trimester)}>Week {ultrasound.week}</Badge>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              <span>{ultrasound.date.toLocaleDateString()}</span>
                            </div>
                          </div>

                          {ultrasound.notes && (
                            <p className="text-sm text-gray-700 leading-relaxed">{ultrasound.notes}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

          {ultrasounds.length === 0 && !showUpload && (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="text-center py-12">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Create Your Ultrasound Gallery</h3>
                <p className="text-gray-500 mb-4">
                  Upload and organize your precious ultrasound images to track your baby's growth.
                </p>
                <Button onClick={() => setShowUpload(true)} className="bg-pink-500 hover:bg-pink-600">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Ultrasound
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
