// src/app/api/subscribe/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export async function POST(request: Request) {
  try {
    const rl = rateLimit(`subscribe:${getClientIp(request)}`, {
      limit: 10,
      windowMs: 60_000,
    });

    if (!rl.allowed) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      );
    }

    const parsed = subscribeSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    const { email } = parsed.data;

    // Check if email already exists to prevent duplicates
    const { data: existingEmail } = await supabaseAdmin
      .from('emails')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json({ message: 'Email is already subscribed' }, { status: 409 });
    }

    // Insert the new email into the 'emails' table
    const { data, error } = await supabaseAdmin
      .from('emails')
      .insert([{ email }]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Successfully subscribed!', data }, { status: 201 });

  } catch (error) {
    console.error('Subscription API Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}