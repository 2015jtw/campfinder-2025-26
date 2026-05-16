import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import crypto from 'node:crypto'

const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
})

// In-memory rate limiter: 3 POSTs per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  if (entry.count >= RATE_LIMIT_MAX) return true

  entry.count++
  return false
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export async function POST(request: NextRequest) {
  console.log('[newsletter] POST hit')
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    console.log('[newsletter] rate limited:', ip)
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parsed = subscribeSchema.safeParse(body)
  if (!parsed.success) {
    console.log('[newsletter] invalid email:', parsed.error)
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const { email, source } = parsed.data
  console.log('[newsletter] subscribing:', email, 'source:', source)
  const token = crypto.randomBytes(20).toString('hex')

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { source: source ?? null, token, confirmed: false },
      create: { email, source: source ?? null, token },
    })
    console.log('[newsletter] upsert ok')
  } catch (err) {
    console.error('Newsletter upsert failed:', err)
    return NextResponse.json({ error: 'Database error. Please try again later.' }, { status: 500 })
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error('[newsletter] SMTP env vars missing')
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
  }
  console.log('[newsletter] SMTP config ok, sending to:', email)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const confirmUrl = `${siteUrl}/api/newsletter?token=${token}`
  const fromName = process.env.SMTP_FROM_NAME ?? 'CampFinder'
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER

  try {
    const transporter = createTransporter()
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: 'Confirm your CampFinder subscription',
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;">
            <div style="background:linear-gradient(135deg,#059669 0%,#047857 100%);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">Almost there!</h1>
            </div>
            <div style="background:#ffffff;padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
              <p style="margin:0 0 16px 0;color:#374151;">Thanks for signing up to the CampFinder newsletter. Click the button below to confirm your email address.</p>
              <div style="text-align:center;margin:24px 0;">
                <a href="${confirmUrl}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:16px;">Confirm subscription</a>
              </div>
              <p style="margin:0;font-size:12px;color:#9ca3af;">Or copy and paste this link: <a href="${confirmUrl}" style="color:#059669;">${confirmUrl}</a></p>
              <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">If you didn't sign up, you can safely ignore this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Confirm your CampFinder subscription\n\nClick the link below to confirm:\n${confirmUrl}\n\nIf you didn't sign up, ignore this email.`,
    })
  } catch (err) {
    console.error('Newsletter SMTP error:', err)
    return NextResponse.json({ error: 'Failed to send confirmation email. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const updated = await prisma.newsletterSubscriber.updateMany({
    where: { token },
    data: { confirmed: true, token: null },
  })

  if (!updated.count) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return NextResponse.redirect(new URL('/newsletter/confirmed', siteUrl))
}
