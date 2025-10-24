'use client'

import { useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'
import mapboxgl from 'mapbox-gl'
import { darkMode } from '@/lib/design-tokens'

interface CampgroundDetailMapProps {
  latitude: number | null
  longitude: number | null
  location: string
  zoom?: number
  height?: number
  styleUrl?: string
}

export default function CampgroundDetailMap({
  latitude,
  longitude,
  location,
  zoom = 11,
  height = 280,
  styleUrl = 'mapbox://styles/mapbox/streets-v12',
}: CampgroundDetailMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  // Convert to numbers (in case they come as Decimals from Prisma)
  const lat = latitude !== null ? Number(latitude) : null
  const lng = longitude !== null ? Number(longitude) : null

  useEffect(() => {
    if (!containerRef.current || !Number.isFinite(lat) || !Number.isFinite(lng)) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) return
    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [lng!, lat!], // IMPORTANT: [lng, lat] order for Mapbox
      zoom,
    })
    mapRef.current = map

    // Add zoom controls
    map.addControl(new mapboxgl.NavigationControl({ showZoom: true }), 'top-right')

    // Add single marker with popup
    new mapboxgl.Marker({
      color: '#059669',
      anchor: 'bottom',
    })
      .setLngLat([lng!, lat!])
      .setPopup(
        new mapboxgl.Popup({ offset: 12 }).setHTML(`
            <div style="padding: 8px; font-family: system-ui;">
              <strong style="font-size: 14px;">${location}</strong>
            </div>
          `)
      )
      .addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [lat, lng, zoom, styleUrl, location])

  // If lat/lng change on client navigation, update smoothly
  useEffect(() => {
    if (!mapRef.current || !Number.isFinite(lat) || !Number.isFinite(lng)) return
    mapRef.current.easeTo({ center: [lng!, lat!], zoom, duration: 400 })
  }, [lat, lng, zoom])

  return (
    <div
      className={`${darkMode.bg.primary} rounded-lg shadow-lg p-6 ${darkMode.border.default} border-2`}
    >
      <div className="flex items-center mb-4">
        <MapPin className={`w-5 h-5 ${darkMode.text.muted} mr-2`} />
        <h2 className={`text-xl font-semibold ${darkMode.text.primary}`}>Location</h2>
      </div>

      {lat !== null && lng !== null ? (
        <div
          ref={containerRef}
          style={{ height, width: '100%' }}
          className="rounded-2xl overflow-hidden"
        />
      ) : (
        <div
          className={`h-64 ${darkMode.bg.secondary} rounded-lg flex items-center justify-center`}
        >
          <div className={`text-center ${darkMode.text.muted}`}>
            <MapPin className={`w-8 h-8 mx-auto mb-2 ${darkMode.text.muted}`} />
            <p>Location: {location}</p>
            <p className="text-sm mt-2">Coordinates not available</p>
          </div>
        </div>
      )}

      {/* Location Details */}
      <div className={`mt-4 p-3 ${darkMode.bg.secondary} rounded-lg`}>
        <div className="flex items-start justify-between">
          <div>
            <p className={`font-medium ${darkMode.text.primary}`}>{location}</p>
            {lat !== null && lng !== null && (
              <p className={`text-sm ${darkMode.text.muted} mt-1`}>
                {lat.toFixed(6)}, {lng.toFixed(6)}
              </p>
            )}
          </div>
          {lat !== null && lng !== null && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center cursor-pointer transition-colors"
            >
              Open in Maps
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
