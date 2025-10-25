"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Clock, Smartphone, Copy, ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"

const plans = {
  BASIC: {
    name: "Basique",
    monthlyPrice: 15000,
    yearlyPrice: 150000,
  },
  BUSINESS: {
    name: "Business",
    monthlyPrice: 35000,
    yearlyPrice: 350000,
  },
  ENTERPRISE: {
    name: "Entreprise", 
    monthlyPrice: 75000,
    yearlyPrice: 750000,
  }
}

export default function PaymentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')
  const period = searchParams.get('period')
  
  const [timeLeft, setTimeLeft] = useState(20 * 60) // 20 minutes en secondes
  const [paymentId, setPaymentId] = useState<string>("")
  const [userOrangeMoneyNumber, setUserOrangeMoneyNumber] = useState<string>("")
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)
  const [isValidPhone, setIsValidPhone] = useState(false)
  
  const plan = plans[planId as keyof typeof plans]
  const isYearly = period === 'yearly'
  const amount = isYearly ? plan?.yearlyPrice : plan?.monthlyPrice
  const orangeMoneyNumber = "+223 85 23 92 19" // Numéro Orange Money de l'entreprise

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (!planId || !plan) {
      router.push('/pricing')
      return
    }

    // Charger le numéro Orange Money depuis le localStorage
    const savedNumber = localStorage.getItem('userOrangeMoneyNumber')
    if (savedNumber) {
      setUserOrangeMoneyNumber(savedNumber)
    }
  }, [session, planId, plan])

  // Créer le paiement seulement après que l'utilisateur ait saisi un numéro valide
  useEffect(() => {
    if (session && planId && plan && !isCreatingPayment && !paymentId && isValidPhone) {
      createPayment()
    }
  }, [session, planId, plan, isValidPhone])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const createPayment = async () => {
    if (isCreatingPayment || paymentId) {
      return // Éviter les appels multiples
    }
    
    try {
      setIsCreatingPayment(true)
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          amount,
          period: isYearly ? 'yearly' : 'monthly',
          userOrangeMoneyNumber,
        }),
      })

      if (response.ok) {
        const payment = await response.json()
        setPaymentId(payment.id)
      }
    } catch (error) {
      console.error('Erreur lors de la création du paiement:', error)
    } finally {
      setIsCreatingPayment(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Tu peux ajouter une notification de succès ici
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Supprimer tous les caractères non numériques sauf le +
    let cleaned = value.replace(/[^\d+]/g, '')
    
    // Si commence par 223, ajouter le +
    if (cleaned.startsWith('223')) {
      cleaned = '+' + cleaned
    }
    
    // Si commence par un numéro sans +, ajouter le +223
    if (cleaned.match(/^\d/) && !cleaned.startsWith('+223')) {
      cleaned = '+223' + cleaned
    }
    
    return cleaned
  }

  const handlePhoneNumberChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    setUserOrangeMoneyNumber(formatted)
    
    // Validation du numéro
    const isValid = formatted.match(/^\+223\d{8}$/) !== null
    setIsValidPhone(isValid)
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('userOrangeMoneyNumber', formatted)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!session || !plan) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      <MainNav />

      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-[#D4AF37]">Paiement - {plan.name}</h1>
          <p className="text-[#F5F5DC]/70">
            {isYearly ? 'Abonnement annuel' : 'Abonnement mensuel'} - {amount} fcfa
          </p>
        </div>

        {/* Champ pour le numéro Orange Money de l'utilisateur */}
        <Card className="mb-8 bg-[#0B1623] border border-[#D4AF37]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
              <Smartphone className="h-5 w-5 text-[#006633]" />
              Votre numéro Orange Money
            </CardTitle>
            <CardDescription className="text-[#F5F5DC]/70">
              Entrez votre numéro Orange Money pour faciliter la vérification du paiement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="userOrangeMoneyNumber" className="text-[#F5F5DC]">Numéro Orange Money</Label>
              <div className="relative">
                <Input
                  id="userOrangeMoneyNumber"
                  type="tel"
                  placeholder="+223 XX XX XX XX XX"
                  value={userOrangeMoneyNumber}
                  onChange={(e) => handlePhoneNumberChange(e.target.value)}
                  className={`font-mono bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37] touch-manipulation pr-10 ${
                    userOrangeMoneyNumber && !isValidPhone ? 'border-red-500' : ''
                  }`}
                  style={{ fontSize: '16px' }} // Prevent zoom on iOS
                  required
                  minLength={10}
                  maxLength={15}
                />
                {userOrangeMoneyNumber && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isValidPhone ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {userOrangeMoneyNumber && !isValidPhone && (
                <p className="text-sm text-red-400">
                  Veuillez entrer un numéro valide (ex: +223 70 12 34 56)
                </p>
              )}
              <p className="text-sm text-[#F5F5DC]/70">
                Ce numéro sera sauvegardé et transmis avec votre paiement pour faciliter la vérification.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Informations du paiement */}
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
                <Smartphone className="h-5 w-5 text-[#006633]" />
                Paiement Orange Money
              </CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">
                Effectuez votre paiement via Orange Money
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#F5F5DC]">Numéro Orange Money</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-[#0D1B2A] border border-[#D4AF37]/20 rounded text-sm font-mono text-[#F5F5DC]">
                    {orangeMoneyNumber}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(orangeMoneyNumber)}
                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#F5F5DC]">Montant à envoyer</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-[#0D1B2A] border border-[#D4AF37]/20 rounded text-sm font-mono text-[#F5F5DC]">
                    {amount} fcfa
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(amount.toString())}
                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#F5F5DC]">Référence de paiement</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-[#0D1B2A] border border-[#D4AF37]/20 rounded text-sm font-mono text-[#F5F5DC]">
                    {paymentId}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(paymentId)}
                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Alert className="border-[#D4AF37] bg-[#D4AF37]/10">
                <AlertDescription className="text-[#F5F5DC]">
                  <strong className="text-[#D4AF37]">Important:</strong> Utilisez uniquement Orange Money pour effectuer ce paiement. 
                  Le paiement sera vérifié dans les 20 minutes.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-[#D4AF37]">QR Code de paiement</CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">
                Scannez ce QR code avec votre application Orange Money
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src="/qr-code-orange-money.png" 
                    alt="QR Code de paiement Orange Money" 
                    className="w-48 h-48 border border-[#D4AF37]/20 rounded"
                  />
                </div>
                <p className="text-sm text-[#F5F5DC]/70">
                  Scannez ce QR code avec votre application Orange Money
                </p>
                <p className="text-sm text-[#F5F5DC]/70">
                  Ou utilisez les informations ci-contre
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timer */}
        <Card className="mt-8 bg-[#0B1623] border border-[#D4AF37]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-4">
              <Clock className="h-5 w-5 text-[#D4AF37]" />
              <span className="text-lg font-semibold text-[#F5F5DC]">
                Temps restant: {formatTime(timeLeft)}
              </span>
              {timeLeft <= 300 && (
                <Badge className="bg-[#C1440E] text-white">
                  Expiration proche
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8 bg-[#0B1623] border border-[#D4AF37]/20">
          <CardHeader>
            <CardTitle className="text-[#D4AF37]">Instructions de paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-[#F5F5DC]">
              <li>Ouvrez votre application Orange Money</li>
              <li>Allez dans "Envoyer de l'argent"</li>
              <li>Entrez le numéro: <code className="bg-[#0D1B2A] border border-[#D4AF37]/20 px-1 rounded text-[#F5F5DC]">{orangeMoneyNumber}</code></li>
              <li>Entrez le montant: <code className="bg-[#0D1B2A] border border-[#D4AF37]/20 px-1 rounded text-[#F5F5DC]">{amount} fcfa</code></li>
              <li>Dans la référence, indiquez: <code className="bg-[#0D1B2A] border border-[#D4AF37]/20 px-1 rounded text-[#F5F5DC]">{paymentId}</code></li>
              <li>Confirmez le paiement</li>
              <li>Cliquez sur "Confirmer le paiement" ci-dessous</li>
            </ol>
          </CardContent>
        </Card>

        {/* Bouton de confirmation */}
        <div className="mt-8 text-center">
          <Link href={`/pricing/verify?paymentId=${paymentId}`}>
            <Button size="lg" className="w-full md:w-auto bg-[#006633] hover:bg-[#C1440E] text-white">
              <Check className="h-4 w-4 mr-2" />
              Confirmer le paiement
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
