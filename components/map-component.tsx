"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { hongKongDistricts } from "@/lib/districts"
import { useMediaQuery } from "@/hooks/use-media-query"

// Custom marker icon
const createCustomIcon = (selected = false) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="position: relative;">
        <div class="marker-pulse"></div>
        <div style="position: absolute; left: -6px; top: -6px; width: 12px; height: 12px; background-color: ${selected ? "#ffffff" : "rgba(255, 255, 255, 0.8)"}; border-radius: 50%; border: 2px solid ${selected ? "#ffffff" : "rgba(255, 255, 255, 0.4)"}; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);"></div>
      </div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
}

interface MapComponentProps {
  onDistrictClick: (district: string) => void
  selectedDistrict: string | null
}

export default function MapComponent({ onDistrictClick, selectedDistrict }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    // Initialize map only on client-side
    if (typeof window !== "undefined") {
      if (!mapRef.current) {
        // Hong Kong coordinates
        const hkCenter = [22.3193, 114.1694]

        // Create map
        mapRef.current = L.map("map", {
          center: hkCenter,
          zoom: isMobile ? 10 : 11, // Zoom out slightly on mobile
          zoomControl: false,
          attributionControl: true,
          scrollWheelZoom: true,
          dragging: true,
          tap: true,
        })

        // Add dark theme tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(mapRef.current)

        // Add zoom control to the top-right corner
        L.control
          .zoom({
            position: "topright",
          })
          .addTo(mapRef.current)

        // Add markers for each district
        hongKongDistricts.forEach((district) => {
          const marker = L.marker(district.coordinates, {
            icon: createCustomIcon(false),
            title: district.name,
          })
            .addTo(mapRef.current!)
            .bindTooltip(district.name, {
              permanent: false,
              direction: "top",
              offset: [0, -10],
              opacity: 0.9,
              className: "custom-tooltip",
            })
            .on("click", () => {
              onDistrictClick(district.name)
            })

          markersRef.current[district.name] = marker
        })
      }
    }

    // Update marker icons when selected district changes
    if (mapRef.current) {
      Object.entries(markersRef.current).forEach(([name, marker]) => {
        marker.setIcon(createCustomIcon(name === selectedDistrict))

        if (name === selectedDistrict) {
          mapRef.current!.flyTo(marker.getLatLng(), isMobile ? 11 : 12, {
            duration: 1.5,
            easeLinearity: 0.25,
          })
        }
      })
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = {}
      }
    }
  }, [onDistrictClick, selectedDistrict, isMobile])

  return <div id="map" className="h-full w-full" />
}

