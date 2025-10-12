import { NextRequest, NextResponse } from "next/server"

// Middleware minimal pour éviter les problèmes de taille
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Redirection simple pour les routes auth si déjà connecté
  if (pathname.startsWith('/auth/')) {
    const token = request.cookies.get('next-auth.session-token') || 
                  request.cookies.get('__Secure-next-auth.session-token')
    
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/:path*']
}
