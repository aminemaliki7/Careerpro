import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const FREE_EMAIL_PROVIDERS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.fr',
  'hotmail.com',
  'hotmail.fr',
  'outlook.com',
  'live.com',
  'icloud.com',
  'me.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'gmx.com',
  'mail.com',
  'yandex.com',
]);

type Role = 'candidate' | 'company' | 'founder' | 'recruiter';

function isProfessionalEmail(email: string | undefined): boolean {
  const domain = email?.trim().toLowerCase().split('@')[1];

  return Boolean(
    domain &&
      domain.includes('.') &&
      !FREE_EMAIL_PROVIDERS.has(domain)
  );
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const requestedRole = body?.role as Role | undefined;

    if (
      requestedRole &&
      !['candidate', 'company', 'founder', 'recruiter'].includes(requestedRole)
    ) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Get the authenticated Clerk user
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const email = user.primaryEmailAddress?.emailAddress;
    const professional = isProfessionalEmail(email);

    /*
     * Server-side role rules:
     *
     * The role is selected explicitly during onboarding. A company account
     * requires a professional email; legacy recruiter and founder accounts
     * retain access to the company workspace.
     */

    if (requestedRole === 'company' || requestedRole === 'recruiter') {
      if (!professional) {
        return NextResponse.json(
          {
            error:
              'A professional email is required for a company account.',
          },
          { status: 403 }
        );
      }
    }

    // "company" is the onboarding/UI label. The existing database constraint
    // stores company accounts as "founder".
    const role: Role = requestedRole === 'company' || requestedRole === 'recruiter'
      ? 'founder'
      : requestedRole ?? 'candidate';

    // Save role in Supabase using the admin client
    const { data: existingProfile, error: existingError } =
      await supabaseAdmin
        .from('user_profiles')
        .select('id')
        .eq('clerk_id', userId)
        .maybeSingle();

    if (existingError) {
      console.error('Supabase profile lookup error:', existingError);

      return NextResponse.json(
        { error: 'Failed to check user profile' },
        { status: 500 }
      );
    }

    let result;

    if (existingProfile) {
      result = await supabaseAdmin
        .from('user_profiles')
        .update({
          role,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_id', userId)
        .select()
        .single();
    } else {
      result = await supabaseAdmin
        .from('user_profiles')
        .insert({
          clerk_id: userId,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Supabase role save error:', result.error);

      return NextResponse.json(
        { error: 'Failed to save role' },
        { status: 500 }
      );
    }

    // Keep Clerk metadata synchronized with Supabase
    try {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          role,
        },
      });
    } catch (clerkError) {
      console.error('Clerk metadata update error:', clerkError);

      return NextResponse.json(
        {
          error: 'Role saved in database, but failed to update Clerk metadata',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Role saved successfully',
        profile: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('set-role POST error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('role, created_at')
      .eq('clerk_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Supabase role fetch error:', error);

      return NextResponse.json(
        { error: 'Failed to fetch role' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { role: null, message: 'User role not set' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { role: data.role },
      { status: 200 }
    );
  } catch (error) {
    console.error('set-role GET error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
