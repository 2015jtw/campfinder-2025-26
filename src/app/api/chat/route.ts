import { NextRequest } from 'next/server'
import { streamText, convertToModelMessages, UIMessage } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { messages, campgroundId } = await req.json()

  const campground = campgroundId
    ? await withRetry(() =>
        prisma.campground.findUnique({
          where: { id: Number(campgroundId) },
          select: { title: true, location: true, price: true, description: true },
        })
      )
    : null

  const system = campground
    ? `You are a helpful assistant for CampFinder, a campground discovery platform. You are answering questions about "${campground.title}", located in ${campground.location}, priced at $${campground.price} per night.${campground.description ? ` Here is the campground description: ${campground.description}` : ''} Be concise and friendly. Only answer questions about this campground or general camping and outdoors topics. If asked about something unrelated, politely redirect the conversation back to camping.`
    : `You are a helpful assistant for CampFinder, a campground discovery platform. Be concise and friendly. Only answer questions about camping and outdoors topics.`

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system,
    messages: await convertToModelMessages(messages as UIMessage[]),
    maxOutputTokens: 500,
  })

  return result.toUIMessageStreamResponse()
}
