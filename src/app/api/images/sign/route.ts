import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

const BUCKET = 'campground-images';

export async function POST(req: NextRequest) {
  try {
    const { campgroundId, originalName } = await req.json();

    if (!campgroundId || !originalName) {
      return NextResponse.json(
        { error: 'campgroundId and originalName required' }, 
        { status: 400 }
      );
    }

    // Use the existing server client
    const supabase = await createClient();

    // Generate a safe filename
    const safeBase = originalName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9._-]/g, '')
      .slice(0, 80);

    const filename = `${randomUUID()}-${safeBase}`;
    const path = `campgrounds/${campgroundId}/${filename}`;

    // Create signed upload URL that expires in 5 minutes
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path, {
        upsert: false
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      signedUrl: data.signedUrl, 
      path,
      fullUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
    });
  } catch (error: any) {
    console.error('Sign URL error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}