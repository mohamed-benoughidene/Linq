'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
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

export async function signOut() {
  console.log("signOut action called");
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error in supabase.auth.signOut:", error);
  } else {
    console.log("supabase.auth.signOut successful");
  }

  // Manual cleanup as a fallback
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  allCookies.forEach(cookie => {
    if (cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')) {
      console.log("Manually deleting cookie:", cookie.name);
      cookieStore.delete(cookie.name);
    }
  });

  revalidatePath('/', 'layout');
  redirect('/login');
}