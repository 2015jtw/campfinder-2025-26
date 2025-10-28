import { redirect } from 'next/navigation'

export default function CreatePage() {
  // Redirect to the actual create campground page
  redirect('/campgrounds/new')
}
