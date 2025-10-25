"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Crown, CheckCircle } from "lucide-react"
import Link from "next/link"

interface TrialInfo {
  daysLeft: number
  isExpired: boolean
}

export function TrialBanner() {
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
      <Card className="mb-6 border border-[#C1440E]/30 bg-gradient-to-r from-[#C1440E]/10 to-[#C1440E]/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-[#C1440E]" />
              <div>
                <h3 className="font-semibold text-[#C1440E]">Essai gratuit expiré</h3>
                <p className="text-sm text-[#C1440E]/80">
                  Votre période d'essai de 7 jours est terminée. Choisissez un plan pour continuer.
                </p>
              </div>
            </div>
            <Link href="/pricing">
              <Button className="bg-[#C1440E] hover:bg-[#C1440E]/80 text-white">
                <Crown className="h-4 w-4 mr-2" />
                Choisir un plan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (trialInfo.daysLeft <= 2) {
    return (
      <Card className="mb-6 border border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-[#D4AF37]" />
              <div>
                <h3 className="font-semibold text-[#D4AF37]">
                  Essai gratuit se termine bientôt
                </h3>
                <p className="text-sm text-[#D4AF37]/80">
                  Il vous reste {trialInfo.daysLeft} jour{trialInfo.daysLeft > 1 ? 's' : ''} d'essai gratuit.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
                {trialInfo.daysLeft} jour{trialInfo.daysLeft > 1 ? 's' : ''} restant{trialInfo.daysLeft > 1 ? 's' : ''}
              </Badge>
              <Link href="/pricing">
                <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white">
                  <Crown className="h-4 w-4 mr-2" />
                  Choisir un plan
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6 border border-[#006633]/30 bg-gradient-to-r from-[#006633]/10 to-[#006633]/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-[#006633]" />
            <div>
              <h3 className="font-semibold text-[#006633]">
                Essai gratuit actif
              </h3>
              <p className="text-sm text-[#006633]/80">
                Vous profitez de l'essai gratuit de 7 jours. {trialInfo.daysLeft} jour{trialInfo.daysLeft > 1 ? 's' : ''} restant{trialInfo.daysLeft > 1 ? 's' : ''}.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#006633] text-white">
              {trialInfo.daysLeft} jour{trialInfo.daysLeft > 1 ? 's' : ''} restant{trialInfo.daysLeft > 1 ? 's' : ''}
            </Badge>
            <Link href="/pricing">
              <Button variant="outline" className="border-[#006633] text-[#006633] hover:bg-[#006633] hover:text-white">
                <Crown className="h-4 w-4 mr-2" />
                Voir les plans
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
