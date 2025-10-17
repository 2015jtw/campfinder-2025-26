'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import Link from 'next/link'

type Campground = {
  id: number
  slug: string
  title: string
  location: string
  latitude: number
  longitude: number
  price: number | null
  image: string | null
  avgRating: number | null
  reviewsCount: number
}

type Props = {
  latitude: number
  longitude: number
  zoom?: number
  height?: number | string
  styleUrl?: string
  showMarker?: boolean
  campgrounds?: Campground[]
}

export default function MainMap({
  latitude,
  longitude,
  zoom = 11,
  height = 360,
  styleUrl = 'mapbox://styles/mapbox/streets-v12',
  showMarker = false,
  campgrounds = [],
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const campgroundMarkersRef = useRef<mapboxgl.Marker[]>([])

  useEffect(() => {
    // Guard: need token and DOM
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token || !containerRef.current || mapRef.current) return
    mapboxgl.accessToken = token

    // Initialize map
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [longitude, latitude],
      zoom,
    })
    mapRef.current = map

    // Controls
    map.addControl(new mapboxgl.NavigationControl({ showZoom: true }), 'top-right')
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right')

    // Optional center marker
    if (showMarker) {
      markerRef.current = new mapboxgl.Marker({ color: '#e11d48' })
        .setLngLat([longitude, latitude])
        .addTo(map)
    }

    // Add campground markers with improved popup styling
    campgrounds.forEach((campground, index) => {
      // Create improved popup content with better styling
      const popupContent = `
        <div style="
          padding: 0;
          min-width: 240px;
          max-width: 280px;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          ${
            campground.image
              ? `
            <div style="position: relative; width: 100%; height: 140px; overflow: hidden; border-radius: 8px 8px 0 0;">
              <img 
                src="${campground.image}" 
                alt="${campground.title}" 
                style="width: 100%; height: 100%; object-fit: cover;"
              />
              ${
                campground.avgRating
                  ? `
                <div style="
                  position: absolute;
                  top: 8px;
                  left: 8px;
                  background: rgba(0, 0, 0, 0.75);
                  backdrop-filter: blur(8px);
                  color: white;
                  padding: 4px 10px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 600;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                ">
                  <span style="color: #fbbf24;">★</span>
                  <span>${campground.avgRating.toFixed(1)}</span>
                  <span style="opacity: 0.8;">(${campground.reviewsCount})</span>
                </div>
              `
                  : ''
              }
            </div>
          `
              : ''
          }
          <div style="padding: 16px;">
            <h3 style="
              font-size: 15px;
              font-weight: 600;
              color: #111827;
              margin: 0 0 8px 0;
              line-height: 1.4;
            ">${campground.title}</h3>
            <div style="
              display: flex;
              align-items: center;
              gap: 6px;
              color: #6b7280;
              font-size: 13px;
              margin-bottom: 12px;
            ">
              <span style="font-size: 14px;">📍</span>
              <span>${campground.location}</span>
            </div>
            ${
              campground.price
                ? `
              <div style="
                background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
                padding: 8px 12px;
                border-radius: 8px;
                margin-bottom: 12px;
              ">
                <div style="
                  font-size: 20px;
                  font-weight: 700;
                  color: #059669;
                  line-height: 1;
                ">$${campground.price}</div>
                <div style="
                  font-size: 11px;
                  color: #047857;
                  margin-top: 2px;
                ">per night</div>
              </div>
            `
                : ''
            }
            <a 
              href="/campgrounds/${campground.slug}" 
              style="
                display: block;
                background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                color: white;
                text-align: center;
                padding: 10px 16px;
                border-radius: 8px;
                text-decoration: none;
                font-size: 13px;
                font-weight: 600;
                transition: all 0.2s;
                box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
              "
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(37, 99, 235, 0.4)'"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(37, 99, 235, 0.3)'"
            >
              View Details →
            </a>
          </div>
        </div>
      `

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: true,
        maxWidth: '280px',
      }).setHTML(popupContent)

      const marker = new mapboxgl.Marker({
        color: '#059669', // emerald-600 for campgrounds
        scale: 0.8,
      })
        .setLngLat([campground.longitude, campground.latitude])
        .setPopup(popup)
        .addTo(map)

      campgroundMarkersRef.current.push(marker)
    })

    // Add CSS for better popup styling
    const style = document.createElement('style')
    style.textContent = `
      .mapboxgl-popup-content {
        padding: 0 !important;
        border-radius: 12px !important;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
        overflow: hidden;
      }
      
      .mapboxgl-popup-close-button {
        font-size: 22px;
        padding: 6px 10px;
        color: #374151;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        transition: all 0.2s;
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .mapboxgl-popup-close-button:hover {
        color: #111827;
        background: rgba(255, 255, 255, 1);
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
      
      .mapboxgl-popup-tip {
        border-top-color: white !important;
        border-bottom-color: white !important;
      }
      
      .custom-campground-marker {
        pointer-events: auto !important;
      }
    `
    document.head.appendChild(style)

    // Resize on container changes
    const resize = () => map.resize()
    const ro = new ResizeObserver(resize)
    ro.observe(containerRef.current)

    // Cleanup
    return () => {
      ro.disconnect()
      markerRef.current?.remove()
      markerRef.current = null

      // Clean up campground markers
      campgroundMarkersRef.current.forEach((marker) => marker.remove())
      campgroundMarkersRef.current = []

      map.remove()
      mapRef.current = null
      style.remove()
    }
  }, []) // init once

  // Respond to prop changes (center / zoom / marker)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.easeTo({ center: [longitude, latitude], zoom, duration: 500 })

    if (showMarker) {
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({ color: '#e11d48' }).addTo(map)
      }
      markerRef.current.setLngLat([longitude, latitude])
    } else {
      markerRef.current?.remove()
      markerRef.current = null
    }
  }, [latitude, longitude, zoom, showMarker])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height, borderRadius: 16, overflow: 'hidden' }}
      className="border shadow-lg"
      aria-label="Map"
    />
  )
}
