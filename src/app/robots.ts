export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://campfinder.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/profile/', '/create/', '/campgrounds/new/', '/campgrounds/*/edit/', '/auth/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
