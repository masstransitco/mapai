"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"
import { getDistrictInfo } from "@/app/actions"
import DistrictInfoCard from "@/components/district-info-card"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Menu, X } from "lucide-react"

// Import Leaflet dynamically to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black animate-pulse-subtle rounded-2xl flex items-center justify-center">
      <div className="text-white/50">Loading map...</div>
    </div>
  ),
})

const hongKongDistricts = [
  { name: "Central and Western" },
  { name: "Eastern" },
  { name: "Southern" },
  { name: "Wan Chai" },
  { name: "Kowloon City" },
  { name: "Kwun Tong" },
  { name: "Sham Shui Po" },
  { name: "Wong Tai Sin" },
  { name: "Yau Tsim Mong" },
  { name: "Islands" },
  { name: "Kwai Tsing" },
  { name: "North" },
  { name: "Sai Kung" },
  { name: "Sha Tin" },
  { name: "Tai Po" },
  { name: "Tsuen Wan" },
  { name: "Tuen Mun" },
  { name: "Yuen Long" },
]

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [districtInfo, setDistrictInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [infoVisible, setInfoVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")

  const handleDistrictClick = async (district: string) => {
    if (selectedDistrict === district && infoVisible) {
      // If clicking the same district and info is visible, just hide the info
      setInfoVisible(false)
      return
    }

    setSelectedDistrict(district)
    setLoading(true)
    setInfoVisible(true)
    setDistrictInfo(null)
    setError(null)

    try {
      const info = await getDistrictInfo(district)
      setDistrictInfo(info)
    } catch (error) {
      console.error("Error fetching district info:", error)
      setError("Failed to load information. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col h-[100dvh] bg-black text-white overflow-hidden">
      {/* Mobile Header */}
      <header className="relative z-20 px-4 py-3 flex items-center justify-between bg-black/80 backdrop-blur-md border-b border-white/10">
        <h1 className="text-xl font-medium tracking-tight">Hong Kong Explorer</h1>

        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
      </header>

      {/* Mobile Menu */}
      {isMobile && menuOpen && (
        <div className="absolute inset-0 z-10 bg-black/95 pt-16 px-4 animate-fade-in">
          <div className="space-y-2 py-4">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Districts</h2>
            {hongKongDistricts.map((district) => (
              <button
                key={district.name}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedDistrict === district.name ? "bg-white/20 text-white" : "text-gray-300 hover:bg-white/10"
                }`}
                onClick={() => {
                  handleDistrictClick(district.name)
                  setMenuOpen(false)
                }}
              >
                {district.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative flex-1 flex flex-col md:flex-row">
        {/* Map Container */}
        <div className="absolute inset-0 z-0 md:relative md:flex-1">
          <MapComponent onDistrictClick={handleDistrictClick} selectedDistrict={selectedDistrict} />
        </div>

        {/* Info Panel - Mobile (Bottom Sheet) */}
        {isMobile && infoVisible && (
          <div className="absolute bottom-0 left-0 right-0 z-10 max-h-[70vh] overflow-auto animate-slide-up">
            <Card className="bg-black/90 backdrop-blur-xl border-t border-white/10 shadow-2xl rounded-t-2xl">
              <CardContent className="p-4">
                {error ? (
                  <div className="text-red-400 p-4">{error}</div>
                ) : (
                  <DistrictInfoCard
                    district={selectedDistrict || ""}
                    weatherData={districtInfo?.weather}
                    content={districtInfo?.content}
                    isLoading={loading}
                    onClose={() => setInfoVisible(false)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Panel - Desktop (Side Panel) */}
        {!isMobile && infoVisible && (
          <div
            className={`relative z-10 w-full md:w-96 lg:w-[400px] bg-black/90 backdrop-blur-xl border-l border-white/10 shadow-2xl overflow-auto animate-slide-in-right`}
          >
            <div className="p-6">
              {error ? (
                <div className="text-red-400 p-4">{error}</div>
              ) : (
                <DistrictInfoCard
                  district={selectedDistrict || ""}
                  weatherData={districtInfo?.weather}
                  content={districtInfo?.content}
                  isLoading={loading}
                  onClose={() => setInfoVisible(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

