import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BUCKET_NAME = 'application-cvs';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to upload a CV' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    const fileExtension = file.name.split('.').pop() || 'pdf';
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = `applications/${uniqueFilename}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type || 'application/pdf',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase CV upload error:', error);
      return NextResponse.json({ error: `Failed to upload CV: ${error.message}` }, { status: 500 });
    }

    // CVs are stored in a PRIVATE bucket. The `url` field is the storage path,
    // not a public URL - CVs must be fetched through the authorized
    // /api/applications/[id]/cv endpoint (which issues a short-lived signed URL).
    return NextResponse.json({
      success: true,
      url: filePath,
      filename: uniqueFilename,
      path: filePath,
    });
  } catch (error) {
    console.error('CV upload failed:', error);
    return NextResponse.json({ error: 'Failed to upload CV' }, { status: 500 });
  }
}