import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { username, password } = (await request.json().catch(() => ({}))) as {
    username?: string
    password?: string
  }

  const expectedUser = process.env.ADMIN_USER ?? ''
  const expectedPass = process.env.ADMIN_PASS ?? ''

  if (!expectedUser || !expectedPass) {
    return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 })
  }

  const ok = username === expectedUser && password === expectedPass
  if (!ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: 'vinxs_admin',
    value: '1',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}

