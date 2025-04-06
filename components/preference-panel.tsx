"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PreferencePanelProps {
  onChange: (preferences: {
    weather: boolean
    traffic: boolean
    dining: boolean
    historical: boolean
  }) => void
}

export default function PreferencePanel({ onChange }: PreferencePanelProps) {
  const [preferences, setPreferences] = useState({
    weather: true,
    traffic: true,
    dining: true,
    historical: false,
  })

  const handleChange = (key: keyof typeof preferences) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    }
    setPreferences(newPreferences)
    onChange(newPreferences)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Information Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="weather" checked={preferences.weather} onCheckedChange={() => handleChange("weather")} />
            <Label htmlFor="weather">Weather</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="traffic" checked={preferences.traffic} onCheckedChange={() => handleChange("traffic")} />
            <Label htmlFor="traffic">Traffic</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="dining" checked={preferences.dining} onCheckedChange={() => handleChange("dining")} />
            <Label htmlFor="dining">Dining</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="historical"
              checked={preferences.historical}
              onCheckedChange={() => handleChange("historical")}
            />
            <Label htmlFor="historical">Historical Context</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

