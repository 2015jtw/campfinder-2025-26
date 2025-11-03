import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

// Request validation schema
const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    // Send email using Nodemailer
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'CampgroundHub Contact Form'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO_EMAIL || '2015JTW@gmail.com',
      replyTo: validatedData.email,
      subject: `New Contact Form Submission from ${validatedData.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Form Submission</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <div style="margin-bottom: 25px;">
                <h2 style="color: #059669; margin: 0 0 10px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Contact Information</h2>
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #059669;">
                  <p style="margin: 0 0 8px 0;"><strong style="color: #374151;">Name:</strong> <span style="color: #6b7280;">${validatedData.name}</span></p>
                  <p style="margin: 0;"><strong style="color: #374151;">Email:</strong> <a href="mailto:${validatedData.email}" style="color: #059669; text-decoration: none;">${validatedData.email}</a></p>
                </div>
              </div>
              
              <div style="margin-bottom: 25px;">
                <h2 style="color: #059669; margin: 0 0 10px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Message</h2>
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #059669;">
                  <p style="margin: 0; color: #374151; white-space: pre-wrap;">${validatedData.message}</p>
                </div>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                  This message was sent from the CampgroundHub contact form.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${validatedData.name}
Email: ${validatedData.email}

Message:
${validatedData.message}

---
This message was sent from the CampgroundHub contact form.
      `,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully',
        messageId: info.messageId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid form data',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    // Handle nodemailer errors
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send email. Please try again later.',
      },
      { status: 500 }
    )
  }
}
