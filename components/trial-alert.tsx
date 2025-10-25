"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, Crown } from "lucide-react"
import Link from "next/link"

interface TrialInfo {
  daysLeft: number
  isExpired: boolean
}

export function TrialAlert() {
  const { data: session } = useSession()
  const [trialInfo, setTrialInfo] = useState<TrialInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.subscription === 'FREE') {
      checkTrialStatus()
    } else {
      setIsLoading(false)
    }
  }, [session])

  const checkTrialStatus = async () => {
    try {
      const response = await fetch('/api/user/trial-status')
      if (response.ok) {
        const data = await response.json()
        setTrialInfo(data)
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'essai:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !trialInfo || session?.user?.subscription !== 'FREE') {
    return null
  }

  if (trialInfo.isExpired) {
    return (
      <Alert className="mb-6 border border-[#C1440E]/30 bg-[#C1440E]/10">
        <AlertTriangle className="h-4 w-4 text-[#C1440E]" />
        <AlertDescription className="text-[#F5F5DC]">
          <div className="flex items-center justify-between">
            <div>
              <strong>Essai gratuit expiré</strong>
              <p className="text-sm mt-1">
                Votre période d'essai de 7 jours est terminée. 
                Choisissez un plan pour continuer à utiliser FarmLink.
              </p>
            </div>
            <Link href="/pricing">
              <Button size="sm" className="bg-[#C1440E] hover:bg-[#C1440E]/80 text-white">
                <Crown className="h-4 w-4 mr-2" />
                Choisir un plan
              </Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (trialInfo.daysLeft <= 2) {
    return (
      <Alert className="mb-6 border border-[#D4AF37]/30 bg-[#D4AF37]/10">
        <Clock className="h-4 w-4 text-[#D4AF37]" />
        <AlertDescription className="text-[#F5F5DC]">
          <div className="flex items-center justify-between">
            <div>
              <strong>Essai gratuit se termine bientôt</strong>
              <p className="text-sm mt-1">
                Il vous reste {trialInfo.daysLeft} jour{trialInfo.daysLeft > 1 ? 's' : ''} d'essai gratuit.
                Choisissez un plan pour ne pas perdre vos données.
              </p>
            </div>
            <Link href="/pricing">
              <Button size="sm" variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
                <Crown className="h-4 w-4 mr-2" />
                Choisir un plan
              </Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
