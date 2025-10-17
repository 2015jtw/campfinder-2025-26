'use client'

import { MapPin } from 'lucide-react'
import MainMap from '@/components/maps/MainMap'

interface MapSectionProps {
  latitude: number | null
  longitude: number | null
  location: string
}

export default function MapSection({ latitude, longitude, location }: MapSectionProps) {
  // Convert to numbers (in case they come as Decimals from Prisma)
  const lat = latitude ? Number(latitude) : null
  const lng = longitude ? Number(longitude) : null

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <MapPin className="w-5 h-5 text-gray-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Location</h2>
      </div>

      {lat && lng ? (
        <div className="h-64 rounded-lg overflow-hidden">
          <MainMap
            latitude={lat}
            longitude={lng}
            zoom={13}
            height={256}
            showMarker={true}
          />
        </div>
      ) : (
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <p>Location: {location}</p>
            <p className="text-sm mt-2">Coordinates not available</p>
          </div>
        </div>
      )}

      {/* Location Details */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-gray-900">{location}</p>
            {lat && lng && (
              <p className="text-sm text-gray-500 mt-1">
                {lat.toFixed(6)}, {lng.toFixed(6)}
              </p>
            )}
          </div>
          {lat && lng && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
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
