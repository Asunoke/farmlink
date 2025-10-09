"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"

export default function VerifyPaymentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('paymentId')
  
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirmed' | 'rejected' | 'expired'>('pending')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (!paymentId) {
      router.push('/pricing')
      return
    }

    // Vérifier le statut du paiement
    checkPaymentStatus()
  }, [session, paymentId])

  const checkPaymentStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/payments/${paymentId}`)
      
      if (response.ok) {
        const payment = await response.json()
        setPaymentStatus(payment.status.toLowerCase())
        
        // Si le paiement est confirmé, rediriger vers le dashboard
        if (payment.status === 'CONFIRMED') {
          setTimeout(() => {
            router.push('/dashboard')
          }, 3000)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du paiement:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session || !paymentId) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      <MainNav />

      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-[#D4AF37]">Vérification du paiement</h1>
          <p className="text-[#F5F5DC]/70">
            Votre paiement est en cours de vérification
          </p>
        </div>

        <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#006633]" />
                <p className="text-lg text-[#F5F5DC]">Vérification en cours...</p>
                <p className="text-sm text-[#F5F5DC]/70">
                  Veuillez patienter pendant que nous vérifions votre paiement
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {paymentStatus === 'pending' && (
                  <div className="text-center space-y-4">
                    <Clock className="h-12 w-12 mx-auto text-[#D4AF37]" />
                    <div>
                      <h3 className="text-xl font-semibold text-[#F5F5DC]">Paiement en attente</h3>
                      <p className="text-[#F5F5DC]/70 mt-2">
                        Votre paiement est en cours de vérification par notre équipe.
                        Vous recevrez une notification une fois le paiement confirmé.
                      </p>
                    </div>
                    <Alert className="border-[#D4AF37] bg-[#D4AF37]/10">
                      <AlertCircle className="h-4 w-4 text-[#D4AF37]" />
                      <AlertDescription className="text-[#F5F5DC]">
                        Le délai de vérification peut prendre jusqu'à 24 heures. 
                        Vous serez automatiquement redirigé vers votre tableau de bord une fois le paiement confirmé.
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={checkPaymentStatus} variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
                        Actualiser le statut
                      </Button>
                      <Link href="/dashboard">
                        <Button className="bg-[#006633] hover:bg-[#C1440E] text-white">Aller au tableau de bord</Button>
                      </Link>
                    </div>
                  </div>
                )}

                {paymentStatus === 'confirmed' && (
                  <div className="text-center space-y-4">
                    <CheckCircle className="h-12 w-12 mx-auto text-[#006633]" />
                    <div>
                      <h3 className="text-xl font-semibold text-[#006633]">Paiement confirmé !</h3>
                      <p className="text-[#F5F5DC]/70 mt-2">
                        Votre abonnement a été activé avec succès. 
                        Vous allez être redirigé vers votre tableau de bord.
                      </p>
                    </div>
                    <Alert className="border-[#006633] bg-[#006633]/10">
                      <CheckCircle className="h-4 w-4 text-[#006633]" />
                      <AlertDescription className="text-[#F5F5DC]">
                        Félicitations ! Votre abonnement est maintenant actif. 
                        Vous pouvez profiter de toutes les fonctionnalités de votre plan.
                      </AlertDescription>
                    </Alert>
                    <div className="flex justify-center">
                      <Link href="/dashboard">
                        <Button size="lg" className="bg-[#006633] hover:bg-[#C1440E] text-white">
                          Accéder au tableau de bord
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {paymentStatus === 'rejected' && (
                  <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 mx-auto text-[#C1440E]" />
                    <div>
                      <h3 className="text-xl font-semibold text-[#C1440E]">Paiement rejeté</h3>
                      <p className="text-[#F5F5DC]/70 mt-2">
                        Votre paiement n'a pas pu être confirmé. 
                        Veuillez vérifier les informations et réessayer.
                      </p>
                    </div>
                    <Alert className="border-[#C1440E] bg-[#C1440E]/10">
                      <AlertCircle className="h-4 w-4 text-[#C1440E]" />
                      <AlertDescription className="text-[#F5F5DC]">
                        Si vous pensez qu'il s'agit d'une erreur, 
                        contactez notre support client.
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-4 justify-center">
                      <Link href="/pricing">
                        <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
                          Choisir un autre plan
                        </Button>
                      </Link>
                      <Button onClick={checkPaymentStatus} className="bg-[#006633] hover:bg-[#C1440E] text-white">
                        Réessayer
                      </Button>
                    </div>
                  </div>
                )}

                {paymentStatus === 'expired' && (
                  <div className="text-center space-y-4">
                    <Clock className="h-12 w-12 mx-auto text-[#F5F5DC]/70" />
                    <div>
                      <h3 className="text-xl font-semibold text-[#F5F5DC]">Paiement expiré</h3>
                      <p className="text-[#F5F5DC]/70 mt-2">
                        Le délai de paiement a expiré. 
                        Veuillez recommencer le processus de paiement.
                      </p>
                    </div>
                    <Alert className="border-[#D4AF37] bg-[#D4AF37]/10">
                      <AlertCircle className="h-4 w-4 text-[#D4AF37]" />
                      <AlertDescription className="text-[#F5F5DC]">
                        Les paiements expirent après 20 minutes pour des raisons de sécurité.
                      </AlertDescription>
                    </Alert>
                    <div className="flex justify-center">
                      <Link href="/pricing">
                        <Button size="lg" className="bg-[#006633] hover:bg-[#C1440E] text-white">
                          Choisir un plan
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
