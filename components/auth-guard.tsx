"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

// Type helper pour accéder aux propriétés étendues
type ExtendedUser = {
  role?: string
  subscription?: string
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // En cours de chargement

    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Vérification du rôle admin
    if (requireAdmin) {
      const user = session.user as ExtendedUser
      if (user?.role !== "ADMIN") {
        router.push("/dashboard")
        return
      }
    }
  }, [session, status, router, requireAdmin])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
      </div>
    )
  }

  if (!session) {
    return null // Redirection en cours
  }

  // Vérification finale du rôle admin
  if (requireAdmin) {
    const user = session.user as ExtendedUser
    if (user?.role !== "ADMIN") {
      return null // Redirection en cours
    }
  }

  return <>{children}</>
}
