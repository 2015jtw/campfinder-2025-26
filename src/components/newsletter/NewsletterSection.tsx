import NewsletterForm from './NewsletterForm'

export default function NewsletterSection() {
  return (
    <section className="bg-emerald-600 dark:bg-emerald-700 py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Stay in the Loop</h2>
        <p className="text-emerald-100 mb-8 max-w-md mx-auto">
          Get new campground listings and seasonal outdoor tips delivered to your inbox.
        </p>
        <div className="flex justify-center">
          <NewsletterForm source="homepage" variant="homepage" />
        </div>
      </div>
    </section>
  )
}
