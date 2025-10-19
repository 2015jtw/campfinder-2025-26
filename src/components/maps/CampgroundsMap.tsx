'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import Link from 'next/link'

const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 } // continental US centroid
const DEFAULT_ZOOM = 3 // good "country/region" view

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

// Helper function to safely create popup content
function createPopupContent(campground: Campground): HTMLElement {
  const container = document.createElement('div')
  container.style.cssText = `
    padding: 0;
    min-width: 240px;
    max-width: 280px;
    font-family: system-ui, -apple-system, sans-serif;
  `

  // Image section
  if (campground.image) {
    const imageContainer = document.createElement('div')
    imageContainer.style.cssText = `
      position: relative;
      width: 100%;
      height: 140px;
      overflow: hidden;
      border-radius: 8px 8px 0 0;
    `

    const img = document.createElement('img')
    img.src = campground.image
    img.alt = campground.title
    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;'
    imageContainer.appendChild(img)

    // Rating overlay
    if (campground.avgRating) {
      const ratingDiv = document.createElement('div')
      ratingDiv.style.cssText = `
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
      `

      const starSpan = document.createElement('span')
      starSpan.style.color = '#fbbf24'
      starSpan.textContent = '★'

      const ratingSpan = document.createElement('span')
      ratingSpan.textContent = campground.avgRating.toFixed(1)

      const reviewsSpan = document.createElement('span')
      reviewsSpan.style.opacity = '0.8'
      reviewsSpan.textContent = `(${campground.reviewsCount})`

      ratingDiv.appendChild(starSpan)
      ratingDiv.appendChild(ratingSpan)
      ratingDiv.appendChild(reviewsSpan)
      imageContainer.appendChild(ratingDiv)
    }

    container.appendChild(imageContainer)
  }

  // Content section
  const contentDiv = document.createElement('div')
  contentDiv.style.padding = '16px'

  // Title
  const title = document.createElement('h3')
  title.style.cssText = `
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 8px 0;
    line-height: 1.4;
  `
  title.textContent = campground.title
  contentDiv.appendChild(title)

  // Location
  const locationDiv = document.createElement('div')
  locationDiv.style.cssText = `
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6b7280;
    font-size: 13px;
    margin-bottom: 12px;
  `

  const locationIcon = document.createElement('span')
  locationIcon.style.fontSize = '14px'
  locationIcon.textContent = '📍'

  const locationText = document.createElement('span')
  locationText.textContent = campground.location

  locationDiv.appendChild(locationIcon)
  locationDiv.appendChild(locationText)
  contentDiv.appendChild(locationDiv)

  // Price section
  if (campground.price) {
    const priceContainer = document.createElement('div')
    priceContainer.style.cssText = `
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 12px;
    `

    const priceValue = document.createElement('div')
    priceValue.style.cssText = `
      font-size: 20px;
      font-weight: 700;
      color: #059669;
      line-height: 1;
    `
    priceValue.textContent = `$${campground.price}`

    const priceLabel = document.createElement('div')
    priceLabel.style.cssText = `
      font-size: 11px;
      color: #047857;
      margin-top: 2px;
    `
    priceLabel.textContent = 'per night'

    priceContainer.appendChild(priceValue)
    priceContainer.appendChild(priceLabel)
    contentDiv.appendChild(priceContainer)
  }

  // View details button
  const button = document.createElement('a')
  button.href = `/campgrounds/${campground.slug}`
  button.className = 'popup-view-button'
  button.style.cssText = `
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
  `
  button.textContent = 'View Details →'

  contentDiv.appendChild(button)
  container.appendChild(contentDiv)

  return container
}

export default function CampgroundsMap({
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

    // Always use North American defaults - ignore props for center/zoom
    const lat = DEFAULT_CENTER.lat
    const lng = DEFAULT_CENTER.lng
    const z = DEFAULT_ZOOM

    // Initialize map
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [lng, lat], // NOTE: [lng, lat] order for Mapbox
      zoom: z,
    })
    mapRef.current = map

    // Controls
    map.addControl(new mapboxgl.NavigationControl({ showZoom: true }), 'top-right')
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right')

    // Optional center marker
    if (showMarker) {
      markerRef.current = new mapboxgl.Marker({ color: '#e11d48' }).setLngLat([lng, lat]).addTo(map)
    }

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
      
      .popup-view-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
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

  // Handle marker changes only (no center/zoom changes)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Always use North American defaults for marker positioning too
    const lat = DEFAULT_CENTER.lat
    const lng = DEFAULT_CENTER.lng

    if (showMarker) {
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({ color: '#e11d48' }).addTo(map)
      }
      markerRef.current.setLngLat([lng, lat])
    } else {
      markerRef.current?.remove()
      markerRef.current = null
    }
  }, [showMarker])

  // Handle campground markers separately to respond to campgrounds prop changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clean up existing campground markers
    campgroundMarkersRef.current.forEach((marker) => marker.remove())
    campgroundMarkersRef.current = []

    // Add new campground markers with secure popup content
    console.log('Adding markers for', campgrounds.length, 'campgrounds')
    campgrounds.forEach((campground, index) => {
      console.log(
        `Adding marker ${index + 1}:`,
        campground.location,
        'at',
        campground.latitude,
        campground.longitude
      )

      // Validate coordinates
      if (
        typeof campground.latitude !== 'number' ||
        typeof campground.longitude !== 'number' ||
        isNaN(campground.latitude) ||
        isNaN(campground.longitude)
      ) {
        console.warn(
          `Skipping marker for ${campground.title} - invalid coordinates:`,
          campground.latitude,
          campground.longitude
        )
        return
      }

      // Create secure popup content using DOM methods
      const popupContent = createPopupContent(campground)

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: true,
        maxWidth: '280px',
      }).setDOMContent(popupContent)

      const marker = new mapboxgl.Marker({
        color: '#059669', // emerald-600 for campgrounds
        scale: 0.8,
      })
        .setLngLat([campground.longitude, campground.latitude])
        .setPopup(popup)
        .addTo(map)

      campgroundMarkersRef.current.push(marker)
    })

    console.log('Added', campgroundMarkersRef.current.length, 'markers to map')
  }, [campgrounds])

  return (
    <div
      ref={containerRef}
      style={{ height, width: '100%' }}
      className="rounded-2xl overflow-hidden border shadow-lg"
      aria-label="Map"
    />
  )
}
