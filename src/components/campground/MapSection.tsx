'use client'

import { MapPin } from 'lucide-react'

interface MapSectionProps {
  latitude: number | null
  longitude: number | null
  location: string
}

export default function MapSection({ latitude, longitude, location }: MapSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <MapPin className="w-5 h-5 text-gray-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Location</h2>
      </div>

      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        {latitude && longitude ? (
          <div className="text-center">
            <div className="text-gray-600 mb-2">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">{location}</p>
            </div>
            <div className="text-sm text-gray-500">
              Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </div>
            <div className="mt-4 text-xs text-gray-400">Interactive map coming soon</div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <p>Location: {location}</p>
            <p className="text-sm mt-2">Coordinates not available</p>
            <div className="mt-4 text-xs text-gray-400">Interactive map coming soon</div>
          </div>
        )}
      </div>

      {/* Future Map Integration Placeholder */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center text-blue-700 text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Map integration planned for future release</span>
        </div>
      </div>
    </div>
  )
}
