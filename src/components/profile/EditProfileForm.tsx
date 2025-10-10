'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { saveProfile } from '@/app/profile/actions'

export default function EditProfileForm({
  userId,
  initialDisplayName,
  initialAvatarUrl,
}: {
  userId: string
  initialDisplayName: string | null
  initialAvatarUrl: string | null
}) {
  const supabase = createClient()
  const [displayName, setDisplayName] = useState(initialDisplayName ?? '')
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
  }

  const uploadAvatar = async () => {
    if (!file) return avatarUrl
    const ext = file.name.split('.').pop() ?? 'png'
    const path = `${userId}.${ext}`

    const { error } = await supabase.storage.from('avatars').upload(path, file, {
      upsert: true,
      cacheControl: '3600',
      contentType: file.type,
    })
    if (error) throw error

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    return data.publicUrl
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    try {
      const publicUrl = await uploadAvatar()
      startTransition(async () => {
        await saveProfile({
          displayName: displayName.trim() || undefined,
          avatarUrl: publicUrl || undefined,
        })
        setAvatarUrl(publicUrl || avatarUrl)
        setMsg('Saved')
      })
    } catch (err: any) {
      setMsg(err.message ?? 'Something went wrong.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="relative h-32 w-32 overflow-hidden rounded-full bg-gray-100 ring-4 ring-white shadow-lg">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Label htmlFor="avatar-upload" className="cursor-pointer">
            <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Change Avatar
            </span>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </Label>
          <p className="mt-2 text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
        </div>
      </div>

      {/* Username Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">
            Display Name
          </Label>
          <p className="mt-1 text-sm text-gray-500">
            This is how your name will appear to other users.
          </p>
        </div>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your display name"
          className="w-full"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={pending} className="bg-blue-600 hover:bg-blue-700">
            {pending ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Changes
              </>
            )}
          </Button>
          {msg && (
            <div
              className={`flex items-center gap-2 text-sm ${
                msg === 'Saved' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {msg === 'Saved' ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              {msg}
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
