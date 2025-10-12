import { redirect } from 'next/navigation'

export default function ProfilePage() {
  // Redirect to account settings as the default profile page
  redirect('/profile/account-settings')
}
