'use client'

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MessageSquare, User, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  // Form submission handler
  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, it's likely an error page
        const text = await response.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        throw new Error(
          'Server configuration error. Please check that SMTP environment variables are set correctly.'
        )
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      toast.success('Message sent successfully!', {
        description: "We'll get back to you as soon as possible.",
      })

      // Reset form after successful submission
      form.reset()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have a question or feedback? We&apos;d love to hear from you. Send us a message and
            we&apos;ll respond as soon as possible.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="pl-11 h-12 text-base border-slate-300 dark:border-slate-700 focus-visible:ring-emerald-500"
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-sm text-slate-500 dark:text-slate-400">
                      What should we call you?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          className="pl-11 h-12 text-base border-slate-300 dark:border-slate-700 focus-visible:ring-emerald-500"
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-sm text-slate-500 dark:text-slate-400">
                      We&apos;ll use this to get back to you.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message Field */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      Message
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Textarea
                          placeholder="Tell us how we can help you..."
                          {...field}
                          className="pl-11 min-h-[180px] text-base border-slate-300 dark:border-slate-700 focus-visible:ring-emerald-500 resize-none"
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-sm text-slate-500 dark:text-slate-400">
                      Please provide as much detail as possible.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full cursor-pointer h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
