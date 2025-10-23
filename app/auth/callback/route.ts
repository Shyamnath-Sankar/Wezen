import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!existingUser) {
        return NextResponse.redirect(new URL('/setup', requestUrl.origin));
      }

      if (existingUser.role === 'customer') {
        return NextResponse.redirect(new URL('/home', requestUrl.origin));
      } else {
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
      }
    }
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
