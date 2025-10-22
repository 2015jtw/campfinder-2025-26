'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { MapPin, Locate, X } from 'lucide-react'

interface MapPinSelectorProps {
  latitude?: number | null
  longitude?: number | null
  onCoordinatesChange: (lat: number, lng: number) => void
  onClear?: () => void
  className?: string
  height?: number
}

export default function MapPinSelector({
  latitude,
  longitude,
  onCoordinatesChange,
  onClear,
  className = '',
  height = 400,
}: MapPinSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      setMapError('Mapbox token not configured')
      return
    }

    mapboxgl.accessToken = token

    // Determine initial center and zoom
    const initialLat = latitude ?? 39.8283 // Default to US center
    const initialLng = longitude ?? -98.5795
    const initialZoom = latitude != null && longitude != null ? 12 : 3

    try {
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [initialLng, initialLat],
        zoom: initialZoom,
      })

      mapRef.current = map

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      map.on('load', () => {
        setIsLoaded(true)

        // Place initial marker if coordinates exist
        if (latitude != null && longitude != null) {
          placeMarker(latitude, longitude)
        }
      })

      // Add click listener to place marker
      map.on('click', (e) => {
        const { lat, lng } = e.lngLat
        placeMarker(lat, lng)
        onCoordinatesChange(lat, lng)
      })

      // Cleanup
      return () => {
        map.remove()
        mapRef.current = null
        markerRef.current = null
      }
    } catch (error) {
      console.error('Map initialization error:', error)
      setMapError('Failed to initialize map')
    }
  }, []) // Only run once on mount

  // Update marker when coordinates change externally
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return

    if (latitude != null && longitude != null) {
      placeMarker(latitude, longitude)
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 12,
        duration: 1000,
      })
    }
  }, [latitude, longitude, isLoaded])

  const placeMarker = (lat: number, lng: number) => {
    if (!mapRef.current) return

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove()
    }

    // Create new draggable marker
    const marker = new mapboxgl.Marker({
      color: '#059669',
      draggable: true,
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current)

    // Handle drag events
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat()
      onCoordinatesChange(lngLat.lat, lngLat.lng)
    })

    markerRef.current = marker
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsLocating(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        placeMarker(lat, lng)
        onCoordinatesChange(lat, lng)

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 14,
            duration: 1500,
          })
        }

        setIsLocating(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Unable to get your location. Please try again or click on the map.')
        setIsLocating(false)
      }
    )
  }

  const handleClearMarker = () => {
    if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }
    if (onClear) {
      onClear()
    }
  }

  if (mapError) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-sm text-red-600">{mapError}</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Instructions and controls */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                Click anywhere on the map to drop a pin, or drag the marker to adjust the location
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isLocating}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Use my location"
            >
              <Locate className={`w-4 h-4 ${isLocating ? 'animate-pulse' : ''}`} />
              {isLocating ? 'Locating...' : 'My Location'}
            </button>

            {latitude != null && longitude != null && onClear && (
              <button
                type="button"
                onClick={handleClearMarker}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                title="Clear marker"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Coordinates display */}
        {latitude != null && longitude != null && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-900">
                Selected coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            </div>
          </div>
        )}

        {/* Map container */}
        <div
          ref={containerRef}
          style={{ height }}
          className="w-full rounded-lg overflow-hidden border border-gray-300 shadow-sm"
        />

        {/* Help text */}
        <p className="text-xs text-gray-500">
          💡 Tip: If you don't set a location, we'll try to geocode the address you provide
        </p>
      </div>
    </div>
  )
}
