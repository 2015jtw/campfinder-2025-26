import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import NewCampgroundForm from "@/components/campground/NewCampgroundForm"

export default async function NewCampgroundPage() {
  // Ensure user is authenticated
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Campground</h1>
          <p className="text-gray-600 mt-2">
            Share your favorite camping spot with the community
          </p>
        </div>
        
        <NewCampgroundForm />
      </div>
    </div>
  )
}
