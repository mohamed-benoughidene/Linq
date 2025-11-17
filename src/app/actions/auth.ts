'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function signInWithGoogle() {
  const supabase = await createClient();
  
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    return { error: error.message };
  }

  if (data.url) {
    // Redirect to Google's OAuth page
    redirect(data.url);
  }
}