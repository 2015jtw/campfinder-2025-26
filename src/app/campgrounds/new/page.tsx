import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NewCampgroundForm from '@/components/campground/NewCampgroundForm'

export default async function NewCampgroundPage() {
  // Ensure user is authenticated
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Campground
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Share your favorite camping spot with the community
          </p>
        </div>

        <NewCampgroundForm />
      </div>
    </div>
  )
}
