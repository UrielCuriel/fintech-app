import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";

export async function middleware(req: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const token = session.accessToken
  const isLoginPage = req.nextUrl.pathname === '/login'

  // Si está en login y tiene token, redirige al dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Si no está en login y no tiene token, redirige a login
  if (!isLoginPage && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/dashboard/:path*']
}
