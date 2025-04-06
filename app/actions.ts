"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Function to fetch real-time weather data
async function getWeatherData(district: string) {
  try {
    // Map Hong Kong districts to approximate coordinates
    const districtCoordinates: Record<string, { lat: number; lon: number }> = {
      "Central and Western": { lat: 22.2857, lon: 114.1548 },
      "Wan Chai": { lat: 22.2808, lon: 114.1826 },
      Eastern: { lat: 22.2833, lon: 114.225 },
      Southern: { lat: 22.2472, lon: 114.1558 },
      "Yau Tsim Mong": { lat: 22.3186, lon: 114.1707 },
      "Sham Shui Po": { lat: 22.33, lon: 114.1628 },
      "Kowloon City": { lat: 22.3286, lon: 114.1928 },
      "Wong Tai Sin": { lat: 22.3419, lon: 114.1953 },
      "Kwun Tong": { lat: 22.3133, lon: 114.2256 },
      "Kwai Tsing": { lat: 22.3561, lon: 114.131 },
      "Tsuen Wan": { lat: 22.3714, lon: 114.1136 },
      "Tuen Mun": { lat: 22.3911, lon: 113.9719 },
      "Yuen Long": { lat: 22.4431, lon: 114.0228 },
      North: { lat: 22.4961, lon: 114.1383 },
      "Tai Po": { lat: 22.4514, lon: 114.1686 },
      "Sha Tin": { lat: 22.3828, lon: 114.1894 },
      "Sai Kung": { lat: 22.3811, lon: 114.2694 },
      Islands: { lat: 22.2611, lon: 113.9456 },
    }

    const coords = districtCoordinates[district] || { lat: 22.3193, lon: 114.1694 } // Default to HK center

    // Use OpenWeatherMap API (free tier)
    const apiKey = "bd5e378503939ddaee76f12ad7a97608" // This is a public demo key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      temp: data.main.temp,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return null
  }
}

export async function getDistrictInfo(district: string): Promise<{
  weather: any
  content: string
}> {
  try {
    // Fetch real-time weather data
    const weatherData = await getWeatherData(district)

    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })

    // Create a more concise prompt
    const prompt = `
      You are a local Hong Kong expert providing VERY CONCISE information about ${district} District in Hong Kong.
      Today is ${currentDate}, current time is ${currentTime}.
      
      ${weatherData ? `Current weather data: ${weatherData.temp}°C, ${weatherData.description}, humidity: ${weatherData.humidity}%, wind: ${weatherData.windSpeed}m/s.` : ""}
      
      Please provide a BRIEF summary (maximum 100 words total) with these sections:
      
      1. TRAFFIC: One sentence about current traffic conditions in this district.
      2. DINING: Recommend just 2 popular restaurants in this district with a one-line description for each.
      
      Keep each section extremely short and focused. Use simple language and be direct.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 250, // Reduced token limit for shorter responses
    })

    return {
      weather: weatherData,
      content: text,
    }
  } catch (error) {
    console.error("Error generating district info:", error)
    throw new Error("Failed to generate district information")
  }
}

