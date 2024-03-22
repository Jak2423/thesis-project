import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
   const pathname = request.nextUrl.pathname
   if (pathname == '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
   }
   return NextResponse.next()
}

export const config = {
   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};