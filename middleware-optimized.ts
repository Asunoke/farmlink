import { NextRequest, NextResponse } from "next/server"

// Middleware ultra-optimisé pour Vercel Edge Functions
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Routes publiques - pas de vérification nécessaire
  const publicRoutes = [
    '/',
    '/marketplace',
    '/pricing', 
    '/contact',
    '/auth/signin',
    '/auth/signup',
    '/api/auth'
  ]
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )
  
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // Vérifier l'authentification seulement pour les routes protégées
  const token = request.cookies.get('next-auth.session-token') || 
                request.cookies.get('__Secure-next-auth.session-token')
  
  const isLoggedIn = !!token
  
  // Routes dashboard - nécessitent une authentification
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    return NextResponse.next()
  }
  
  // Routes admin - nécessitent une authentification + rôle admin
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    
    // Note: La vérification du rôle admin se fait côté serveur
    // pour éviter d'importer des dépendances lourdes
    return NextResponse.next()
  }
  
  // Rediriger les utilisateurs connectés depuis les pages auth
  if (pathname.startsWith('/auth/') && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*', 
    '/auth/:path*'
  ]
}
