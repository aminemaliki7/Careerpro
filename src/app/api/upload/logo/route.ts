// app/api/upload/logo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { requireCompanyUser } from '@/lib/auth/authorization';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const BUCKET_NAME = 'startup-logos';
const LOGO_PATH_REGEX =
  /^logos\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]+$/i;

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireCompanyUser();
    if (authResult.response) return authResult.response;

    const formData = await request.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (PNG, JPG, WebP, GIF) are allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'png';
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = `logos/${uniqueFilename}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json(
        { error: `Failed to upload to storage: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
      filename: uniqueFilename,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { error: 'Failed to upload logo. Please try again.' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove old logos
// Auth-required and scoped to the logos/ prefix so callers cannot delete
// arbitrary objects (e.g. CVs) from storage by guessing a path.
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireCompanyUser();
    if (authResult.response) return authResult.response;

    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    if (!LOGO_PATH_REGEX.test(filePath)) {
      return NextResponse.json(
        { error: 'Invalid logo path' },
        { status: 400 }
      );
    }

    const { data: ownedStartup, error: ownerError } = await supabaseAdmin
      .from('startups')
      .select('id')
      .eq('owner_id', authResult.userId)
      .eq(
        'logo_url',
        supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(filePath).data.publicUrl
      )
      .limit(1)
      .maybeSingle();

    if (ownerError) {
      console.error('Error verifying startup logo ownership:', ownerError);
      return NextResponse.json({ error: 'Failed to verify logo ownership' }, { status: 500 });
    }
    if (!ownedStartup) {
      return NextResponse.json({ error: 'You cannot delete a logo that is not used by your startup' }, { status: 404 });
    }

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting logo:', error);
    return NextResponse.json(
      { error: 'Failed to delete logo' },
      { status: 500 }
    );
  }
}

// GET endpoint for health check and config info
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
    allowedTypes: ALLOWED_TYPES,
    bucketName: BUCKET_NAME,
    message: 'Logo upload endpoint with Supabase Storage is ready'
  });
}