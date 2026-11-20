import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get('admin_session')?.value === 'true'
  
  // إذا كان داخل على أي صفحة من صفحات الأدمن (إلا صفحة دخول الأدمن)
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    if (!isAdmin) {
      // طرده على صفحة دخول الأدمن
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
