"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useOnboarding } from "@/hooks/use-onboarding"

export function OnboardingDetector() {
  const { data: session, status } = useSession()
  const { setShowOnboarding } = useOnboarding()

  useEffect(() => {
    // Attendre que la session soit chargée
    if (status === "loading") return
    if (status === "unauthenticated") return

    // Si l'utilisateur est connecté, vérifier s'il doit voir l'onboarding
    if (session?.user) {
      // Vérifier si c'est un nouvel utilisateur (pas de données d'onboarding sauvegardées)
      const savedState = localStorage.getItem("farmlink-onboarding")
      
      if (!savedState) {
        // Nouvel utilisateur - lancer l'onboarding automatiquement
        setShowOnboarding(true)
      } else {
        // Vérifier si l'utilisateur a déjà vu l'onboarding
        const parsed = JSON.parse(savedState)
        if (!parsed.isCompleted && !parsed.hasSeenOnboarding) {
          setShowOnboarding(true)
        }
      }
    }
  }, [session, status, setShowOnboarding])

  return null // Ce composant ne rend rien
}
