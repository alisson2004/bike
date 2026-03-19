import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow the admin login page and static assets
  if (pathname === '/admin/login') return NextResponse.next()
  if (pathname.startsWith('/_next')) return NextResponse.next()

  if (pathname.startsWith('/admin')) {
    const isAuthed = request.cookies.get('vinxs_admin')?.value === '1'
    if (!isAuthed) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

