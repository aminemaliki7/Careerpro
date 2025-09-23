// src/app/api/subscribe/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';


export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Basic validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    // Check if email already exists to prevent duplicates
   // Version simplifiée - supprimez complètement la vérification d'erreur
const { data: existingEmail } = await supabase
  .from('emails')
  .select('email')
  .eq('email', email)
  .single();

    if (existingEmail) {
      return NextResponse.json({ message: 'Email is already subscribed' }, { status: 409 });
    }
    
    // Insert the new email into the 'emails' table
    const { data, error } = await supabase
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