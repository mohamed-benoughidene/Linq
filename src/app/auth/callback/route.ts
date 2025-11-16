import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('OAuth callback error:', error);
      // Redirect to login with error
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Successful authentication - redirect to dashboard or next page
    return NextResponse.redirect(`${origin}${next}`);
  }

  // No code present - redirect to login
  return NextResponse.redirect(`${origin}/login`);
}
