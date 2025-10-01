"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, X, Crown, Zap, Star } from "lucide-react"
import Link from "next/link"
import { SUBSCRIPTION_LIMITS } from "@/lib/subscription-limits"

const plans = [
  {
    name: "Starter",
    id: "FREE",
    description: "Parfait pour débuter",
    monthlyPrice: 15000,
    yearlyPrice: 150000,
    icon: Star,
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    popular: false,
  },
  {
    name: "pro",
    id: "BASIC",
    description: "Pour les petites exploitations",
    monthlyPrice: 35000,
    yearlyPrice: 350000,
    icon: Zap,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    popular: true,
  },
  {
    name: "entreprise",
    id: "PREMIUM",
    description: "Pour les grandes exploitations",
    monthlyPrice: 75000,
    yearlyPrice: 750000,
    icon: Crown,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    popular: false,
  },
]

export default function PricingPage() {
  const { data: session } = useSession()
  const [isYearly, setIsYearly] = useState(false)

  const formatLimit = (limit: number) => {
    return limit === Number.POSITIVE_INFINITY ? "Illimité" : limit.toString()
  }

  const formatFeature = (hasFeature: boolean) => {
    return hasFeature ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">FL</span>
              </div>
              <span className="text-xl font-bold">FarmLink</span>
            </Link>
            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/dashboard">
                  <Button>Tableau de Bord</Button>
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link href="/auth/signin">
                    <Button variant="outline">Se connecter</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button>S'inscrire</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-balance mb-4">Choisissez le plan qui vous convient</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Gérez votre exploitation agricole avec nos outils professionnels. Commencez gratuitement et évoluez selon
            vos besoins.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm ${!isYearly ? "font-semibold" : "text-muted-foreground"}`}>Mensuel</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>Annuel</span>
            <Badge variant="secondary" className="ml-2">
              2 mois gratuits
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const limits = SUBSCRIPTION_LIMITS[plan.id]
            const Icon = plan.icon
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
            const savings = isYearly ? plan.monthlyPrice * 12 - plan.yearlyPrice : 0

            return (
              <Card key={plan.id} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Le plus populaire</Badge>
                  </div>
                )}

                <CardHeader className={`text-center ${plan.bgColor} rounded-t-lg`}>
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full bg-white`}>
                      <Icon className={`h-6 w-6 ${plan.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="text-4xl font-bold">
                      {price} fcfa
                      <span className="text-lg font-normal text-muted-foreground">/{isYearly ? "an" : "mois"}</span>
                    </div>
                    {isYearly && savings > 0 && (
                      <p className="text-sm text-green-600 mt-1">Économisez {savings}fcfa par an</p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fermes</span>
                      <span className="font-semibold">{formatLimit(limits.farms)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Parcelles</span>
                      <span className="font-semibold">{formatLimit(limits.parcels)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Membres d'équipe</span>
                      <span className="font-semibold">{formatLimit(limits.teamMembers)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Dépenses trackées</span>
                      <span className="font-semibold">{formatLimit(limits.expenses)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Appels API météo</span>
                      <span className="font-semibold">{formatLimit(limits.weatherApiCalls)}/mois</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <h4 className="font-semibold mb-3">Fonctionnalités</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Analytiques avancées</span>
                        {formatFeature(limits.features.advancedAnalytics)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Export de données</span>
                        {formatFeature(limits.features.exportData)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Support prioritaire</span>
                        {formatFeature(limits.features.prioritySupport)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Rapports personnalisés</span>
                        {formatFeature(limits.features.customReports)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Accès API</span>
                        {formatFeature(limits.features.apiAccess)}
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    disabled={(session?.user as any)?.subscription === plan.id}
                  >
                    {(session?.user as any)?.subscription === plan.id
                      ? "Plan actuel"
                      : plan.id === "FREE"
                        ? "Commencer gratuitement"
                        : "Choisir ce plan"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Questions Fréquentes</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je changer de plan à tout moment ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet
                  immédiatement et votre facturation est ajustée au prorata.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Que se passe-t-il si je dépasse mes limites ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vous recevrez une notification lorsque vous approchez de vos limites. Si vous les dépassez, certaines
                  fonctionnalités seront temporairement limitées jusqu'à ce que vous upgradiez votre plan.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Y a-t-il une période d'essai gratuite ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Le plan gratuit vous permet de tester toutes les fonctionnalités de base sans limitation de temps.
                  Pour les plans payants, vous bénéficiez d'une garantie satisfait ou remboursé de 30 jours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
