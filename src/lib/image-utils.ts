/**
 * Generate a blur data URL for image placeholders
 * Creates a tiny SVG with a gradient background
 */
export function generateBlurDataURL(width: number = 8, height: number = 8): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Generate a blur data URL with specific colors for dark mode
 */
export function generateBlurDataURLDark(width: number = 8, height: number = 8): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#374151;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1f2937;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Generate a blur data URL for campground images with nature colors
 */
export function generateCampgroundBlurDataURL(width: number = 8, height: number = 8): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.3" />
          <stop offset="50%" style="stop-color:#059669;stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:#047857;stop-opacity:0.1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Common blur data URLs for reuse
 */
export const BLUR_DATA_URLS = {
  default: generateBlurDataURL(),
  dark: generateBlurDataURLDark(),
  campground: generateCampgroundBlurDataURL(),
} as const
