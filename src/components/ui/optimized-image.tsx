import Image from 'next/image'
import { cn } from '@/lib/utils'
import { BLUR_DATA_URLS } from '@/lib/image-utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  quality?: number
  className?: string
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 85,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  placeholder = 'empty',
  blurDataURL,
}: OptimizedImageProps) {
  const commonProps = {
    src,
    alt,
    priority,
    quality,
    className: cn('object-cover', className),
    sizes,
    placeholder: placeholder || 'blur',
    blurDataURL: blurDataURL || BLUR_DATA_URLS.default,
  }

  if (fill) {
    return <Image {...commonProps} fill />
  }

  return <Image {...commonProps} width={width!} height={height!} />
}

// Specialized components for common use cases
export function HeroImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority
      quality={90}
      sizes="100vw"
      className={className}
      blurDataURL={BLUR_DATA_URLS.campground}
    />
  )
}

export function CardImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority={false}
      quality={85}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className={className}
      blurDataURL={BLUR_DATA_URLS.campground}
    />
  )
}

export function ThumbnailImage({
  src,
  alt,
  width = 128,
  height = 128,
  className,
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={false}
      quality={75}
      sizes="(max-width: 640px) 50vw, 25vw"
      className={className}
      blurDataURL={BLUR_DATA_URLS.default}
    />
  )
}
