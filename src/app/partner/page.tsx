"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Heart, ArrowLeft, Users, Share, Mail, MessageCircle, Calendar, Baby, Camera } from "lucide-react"
import Link from "next/link"

export default function PartnerPage() {
  const [partnerEmail, setPartnerEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)

  const handleInvitePartner = () => {
    // In real app, would send invitation email
    setIsConnected(true)
  }

  const weeklyUpdates = [
    {
      week: 24,
      shared: true,
      content: "Baby is the size of a cantaloupe! Hearing is fully developed.",
      date: "Today"
    },
    {
      week: 23,
      shared: true,
      content: "First strong kicks felt during lunch!",
      date: "1 week ago"
    },
    {
      week: 22,
      shared: false,
      content: "Anatomy scan scheduled for next week.",
      date: "2 weeks ago"
    }
  ]

  const partnerTips = [
    {
      title: "Be Present at Appointments",
      description: "Attend prenatal visits when possible to stay involved and show support.",
      icon: Calendar
    },
    {
      title: "Learn About Baby Development",
      description: "Read about weekly changes to understand what your partner is experiencing.",
      icon: Baby
    },
    {
      title: "Help with Preparations",
      description: "Assist with nursery setup, baby shopping, and birth plan discussions.",
      icon: Heart
    },
    {
      title: "Document the Journey",
      description: "Take photos, help with journaling, and create memories together.",
      icon: Camera
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-purple-500" />
              <h1 className="text-xl font-bold text-gray-800">Partner Connection</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Share Your Journey Together</h2>
          <p className="text-gray-600">
            Keep your partner involved and strengthen your bond during this special time.
          </p>
        </div>

        {/* Partner Connection Status */}
        <Card className="mb-6 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span>Partner Connection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Invite your partner to follow your pregnancy journey and receive updates.
                </p>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Partner's email address"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleInvitePartner} className="bg-purple-500 hover:bg-purple-600">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invite
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Partner Connected</p>
                    <p className="text-sm text-gray-600">{partnerEmail}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shared Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Share className="h-5 w-5 text-pink-600" />
                <span>Shared Updates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyUpdates.map((update, index) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline">Week {update.week}</Badge>
                        <span className="text-xs text-gray-500">{update.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{update.content}</p>
                    </div>
                    <Badge variant={update.shared ? "default" : "secondary"}>
                      {update.shared ? "Shared" : "Private"}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Share className="h-4 w-4 mr-2" />
                  Share This Week's Update
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <span>Send Message</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts, feelings, or updates with your partner..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partner Tips */}
        <Card className="border-mint-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-mint-600" />
              <span>Tips for Partners</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partnerTips.map((tip, index) => (
                <div key={index} className="p-4 bg-mint-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-mint-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <tip.icon className="h-4 w-4 text-mint-600" />
                    </div>
                    <div>
                      <h4 className\
