"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { hongKongDistricts } from "@/lib/districts"

// Fix Leaflet icon issues
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

interface MapComponentProps {
  onDistrictClick: (district: string) => void
}

export default function MapComponent({ onDistrictClick }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const layersRef = useRef<L.GeoJSON<any>[]>([])

  useEffect(() => {
    // Initialize map only on client-side
    if (typeof window !== "undefined") {
      fixLeafletIcon()

      if (!mapRef.current) {
        // Hong Kong coordinates
        const hkCenter = [22.3193, 114.1694]

        // Create map
        mapRef.current = L.map("map").setView(hkCenter, 11)

        // Add tile layer (OpenStreetMap)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapRef.current)

        // Add markers for each district
        hongKongDistricts.forEach((district) => {
          const marker = L.marker(district.coordinates)
            .addTo(mapRef.current!)
            .bindTooltip(district.name, { permanent: false, direction: "top" })
            .on("click", () => {
              onDistrictClick(district.name)
            })

          markersRef.current.push(marker)

          // If we had GeoJSON data for district boundaries, we could add it like this:
          // if (district.boundary) {
          //   const layer = L.geoJSON(district.boundary, {
          //     style: {
          //       color: '#3388ff',
          //       weight: 2,
          //       opacity: 0.5,
          //       fillOpacity: 0.1
          //     }
          //   }).addTo(mapRef.current!)
          //     .on('click', () => {
          //       onDistrictClick(district.name);
          //     });
          //
          //   layersRef.current.push(layer);
          // }
        })
      }
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = []
        layersRef.current = []
      }
    }
  }, [onDistrictClick])

  return <div id="map" className="h-full w-full" />
}

