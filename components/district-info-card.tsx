"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Cloud,
  CloudRain,
  Sun,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
  Droplets,
  Thermometer,
  Car,
  UtensilsCrossed,
} from "lucide-react"

interface DistrictInfoCardProps {
  district: string
  weatherData: any
  content: string | null
  isLoading: boolean
  onClose: () => void
}

export default function DistrictInfoCard({
  district,
  weatherData,
  content,
  isLoading,
  onClose,
}: DistrictInfoCardProps) {
  const [displayedContent, setDisplayedContent] = useState<string>("")
  const [isComplete, setIsComplete] = useState<boolean>(false)

  // Get weather icon based on OpenWeatherMap icon code
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, JSX.Element> = {
      "01d": <Sun className="text-yellow-400" size={36} />,
      "01n": <Sun className="text-yellow-400 opacity-70" size={36} />,
      "02d": <Cloud className="text-gray-300" size={36} />,
      "02n": <Cloud className="text-gray-300 opacity-70" size={36} />,
      "03d": <Cloud className="text-gray-300" size={36} />,
      "03n": <Cloud className="text-gray-300 opacity-70" size={36} />,
      "04d": <Cloud className="text-gray-400" size={36} />,
      "04n": <Cloud className="text-gray-400 opacity-70" size={36} />,
      "09d": <CloudRain className="text-blue-300" size={36} />,
      "09n": <CloudRain className="text-blue-300 opacity-70" size={36} />,
      "10d": <CloudRain className="text-blue-300" size={36} />,
      "10n": <CloudRain className="text-blue-300 opacity-70" size={36} />,
      "11d": <CloudLightning className="text-yellow-300" size={36} />,
      "11n": <CloudLightning className="text-yellow-300 opacity-70" size={36} />,
      "13d": <CloudSnow className="text-white" size={36} />,
      "13n": <CloudSnow className="text-white opacity-70" size={36} />,
      "50d": <CloudFog className="text-gray-300" size={36} />,
      "50n": <CloudFog className="text-gray-300 opacity-70" size={36} />,
    }

    return iconMap[iconCode] || <Cloud className="text-gray-300" size={36} />
  }

  // Simulate streaming effect when content changes
  useEffect(() => {
    if (!content) {
      setDisplayedContent("")
      setIsComplete(false)
      return
    }

    let currentIndex = 0
    const chunkSize = 3 // Characters per chunk
    const delay = 10 // Milliseconds between chunks

    setDisplayedContent("")
    setIsComplete(false)

    const interval = setInterval(() => {
      if (currentIndex < content.length) {
        const nextChunk = content.substring(0, currentIndex + chunkSize)
        setDisplayedContent(nextChunk)
        currentIndex += chunkSize
      } else {
        clearInterval(interval)
        setIsComplete(true)
      }
    }, delay)

    return () => clearInterval(interval)
  }, [content])

  if (isLoading && !displayedContent) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-medium">{district}</h2>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
          <Skeleton className="h-10 w-full bg-gray-800 mb-2" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-8 rounded-full bg-gray-800" />
            <Skeleton className="h-8 w-24 bg-gray-800" />
          </div>
        </div>

        <Skeleton className="h-4 w-full bg-gray-800" />
        <Skeleton className="h-4 w-[90%] bg-gray-800" />
        <Skeleton className="h-4 w-[95%] bg-gray-800" />
      </div>
    )
  }

  if (!displayedContent && !isLoading && !weatherData) {
    return null
  }

  // Extract sections from content
  const trafficSection = displayedContent.match(/TRAFFIC:(.*?)(?=DINING:|$)/s)?.[1]?.trim() || ""
  const diningSection = displayedContent.match(/DINING:(.*?)$/s)?.[1]?.trim() || ""

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">{district}</h2>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {weatherData && (
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-xl p-4 mb-6 backdrop-blur-sm animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Current Weather</h3>
            <span className="text-xs text-gray-500">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <div className="flex items-center">
            <div className="mr-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {getWeatherIcon(weatherData.icon)}
            </div>

            <div className="flex-1">
              <div className="flex items-center mb-1 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <Thermometer size={16} className="mr-1 text-red-400" />
                <span className="text-2xl font-semibold">{Math.round(weatherData.temp)}°C</span>
                <span className="ml-2 text-gray-400 capitalize">{weatherData.description}</span>
              </div>

              <div
                className="flex items-center gap-4 text-sm text-gray-400 animate-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="flex items-center">
                  <Droplets size={14} className="mr-1 text-blue-400" />
                  <span>{weatherData.humidity}%</span>
                </div>
                <div className="flex items-center">
                  <Wind size={14} className="mr-1 text-gray-400" />
                  <span>{weatherData.windSpeed} m/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {trafficSection && (
        <div className="mb-4 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center mb-2">
            <Car size={16} className="mr-2 text-orange-400" />
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Traffic</h3>
          </div>
          <p className="text-gray-200 pl-6">{trafficSection}</p>
        </div>
      )}

      {diningSection && (
        <div className="mb-4 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center mb-2">
            <UtensilsCrossed size={16} className="mr-2 text-green-400" />
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Dining</h3>
          </div>
          <p className="text-gray-200 pl-6">{diningSection}</p>
        </div>
      )}

      {!isComplete && displayedContent && (
        <div className="flex items-center space-x-1 text-gray-400 mt-4 animate-pulse-subtle">
          <span>Generating</span>
          <span className="animate-pulse-subtle">.</span>
          <span className="animate-pulse-subtle" style={{ animationDelay: "0.2s" }}>
            .
          </span>
          <span className="animate-pulse-subtle" style={{ animationDelay: "0.4s" }}>
            .
          </span>
        </div>
      )}
    </div>
  )
}

