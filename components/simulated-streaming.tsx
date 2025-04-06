"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface SimulatedStreamingProps {
  text: string | null
  isLoading: boolean
}

export default function SimulatedStreaming({ text, isLoading }: SimulatedStreamingProps) {
  const [displayedText, setDisplayedText] = useState<string>("")
  const [isComplete, setIsComplete] = useState<boolean>(false)

  // Simulate streaming effect when text changes
  useEffect(() => {
    if (!text) {
      setDisplayedText("")
      setIsComplete(false)
      return
    }

    let currentIndex = 0
    const chunkSize = 3 // Characters per chunk
    const delay = 10 // Milliseconds between chunks

    setDisplayedText("")
    setIsComplete(false)

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        const nextChunk = text.substring(0, currentIndex + chunkSize)
        setDisplayedText(nextChunk)
        currentIndex += chunkSize
      } else {
        clearInterval(interval)
        setIsComplete(true)
      }
    }, delay)

    return () => clearInterval(interval)
  }, [text])

  if (isLoading && !displayedText) {
    return (
      <div className="space-y-3 animate-fade-in">
        <Skeleton className="h-4 w-full bg-gray-800" />
        <Skeleton className="h-4 w-[90%] bg-gray-800" />
        <Skeleton className="h-4 w-[95%] bg-gray-800" />
        <Skeleton className="h-4 w-[85%] bg-gray-800" />
        <Skeleton className="h-4 w-full bg-gray-800" />
        <Skeleton className="h-4 w-[90%] bg-gray-800" />
        <Skeleton className="h-4 w-[80%] bg-gray-800" />
      </div>
    )
  }

  if (!displayedText && !isLoading) {
    return null
  }

  // Split text into sections
  const sections = displayedText.split(/(?=WEATHER:|TRAFFIC:|DINING:)/g).filter(Boolean)

  return (
    <div className="prose prose-invert prose-sm max-w-none animate-fade-in">
      {sections.map((section, index) => {
        const [title, ...content] = section.split(":")
        const sectionContent = content.join(":").trim()

        return (
          <div key={index} className="mb-4 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            {title.includes("WEATHER") || title.includes("TRAFFIC") || title.includes("DINING") ? (
              <>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">{title.trim()}</h3>
                <p className="text-gray-200">{sectionContent}</p>
              </>
            ) : (
              <p className="text-gray-200">{section}</p>
            )}
          </div>
        )
      })}

      {!isComplete && displayedText && (
        <div className="flex items-center space-x-1 text-gray-400 mt-2">
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

