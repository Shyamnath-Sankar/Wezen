import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Protect home route
  if (req.nextUrl.pathname.startsWith('/home')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/home/:path*'],
};
