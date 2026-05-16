'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { calculateReadingTime } from '@/lib/blog-utils'
import { createBlogPost, updateBlogPost } from '@/app/blog/actions'
import type { BlogCategory, BlogPostFull } from '@/types'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  excerpt: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  featuredImage: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  status: z.enum(['draft', 'published']),
  categories: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  categories: BlogCategory[]
  post?: BlogPostFull
}

export default function BlogPostForm({ categories, post }: Props) {
  const [isPending, startTransition] = useTransition()
  const [readingTimePreview, setReadingTimePreview] = useState(
    post?.readingTime ?? 0
  )

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title ?? '',
      excerpt: post?.excerpt ?? '',
      content: post?.content ?? '',
      featuredImage: post?.featuredImage ?? '',
      status: post?.status === 'published' ? 'published' : 'draft',
      categories: post?.categories.map((c) => String(c.category.id)) ?? [],
    },
  })

  const content = watch('content')
  useEffect(() => {
    setReadingTimePreview(calculateReadingTime(content ?? ''))
  }, [content])

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('title', values.title)
      fd.set('excerpt', values.excerpt ?? '')
      fd.set('content', values.content)
      fd.set('featuredImage', values.featuredImage ?? '')
      fd.set('status', values.status)
      values.categories?.forEach((id) => fd.append('categories', id))

      if (post) {
        await updateBlogPost(post.id, fd)
      } else {
        await createBlogPost(fd)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Your post title..."
          {...register('title')}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Excerpt */}
      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Excerpt (optional)</Label>
        <Textarea
          id="excerpt"
          placeholder="A short summary shown in post cards..."
          rows={2}
          {...register('excerpt')}
        />
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">Content (Markdown)</Label>
          {readingTimePreview > 0 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ~{readingTimePreview} min read
            </span>
          )}
        </div>
        <Textarea
          id="content"
          placeholder="Write your post in Markdown...&#10;&#10;## Heading&#10;**Bold**, *italic*, [links](url), `code`, etc."
          rows={20}
          className={`font-mono text-sm ${errors.content ? 'border-red-500' : ''}`}
          {...register('content')}
        />
        {errors.content && (
          <p className="text-xs text-red-500">{errors.content.message}</p>
        )}
      </div>

      {/* Featured image */}
      <div className="space-y-1.5">
        <Label htmlFor="featuredImage">Featured Image URL (optional)</Label>
        <Input
          id="featuredImage"
          placeholder="https://..."
          {...register('featuredImage')}
          className={errors.featuredImage ? 'border-red-500' : ''}
        />
        {errors.featuredImage && (
          <p className="text-xs text-red-500">{errors.featuredImage.message}</p>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={String(cat.id)}
                    {...register('categories')}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {cat.name}
                  </span>
                </label>
              ))}
          </div>
        </div>
      )}

      {/* Status + Submit */}
      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="draft"
              {...register('status')}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Save as draft</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="published"
              {...register('status')}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Publish</span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isPending ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  )
}
