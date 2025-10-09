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
import { MainNav } from "@/components/main-nav"

const plans = [
  {
    name: "Basique",
    id: "BASIC",
    description: "Pour les petites exploitations",
    monthlyPrice: 15000,
    yearlyPrice: 150000,
    icon: Zap,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    popular: false,
  },
  {
    name: "Business",
    id: "BUSINESS",
    description: "Pour les exploitations moyennes",
    monthlyPrice: 35000,
    yearlyPrice: 350000,
    icon: Crown,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    popular: true,
  },
  {
    name: "Entreprise",
    id: "ENTERPRISE",
    description: "Solution sur mesure",
    monthlyPrice: 75000,
    yearlyPrice: 750000,
    icon: Crown,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    popular: false,
    custom: true,
    whatsapp: "+22385239219",
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
    <div className="min-h-screen bg-[#0D1B2A]">
      <MainNav />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-balance mb-4 text-[#D4AF37]">Choisissez le plan qui vous convient</h1>
          <p className="text-xl text-[#F5F5DC]/70 mb-8 max-w-2xl mx-auto">
            Gérez votre exploitation agricole avec nos outils professionnels. Commencez gratuitement et évoluez selon
            vos besoins.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm ${!isYearly ? "font-semibold text-[#D4AF37]" : "text-[#F5F5DC]/70"}`}>Mensuel</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? "font-semibold text-[#D4AF37]" : "text-[#F5F5DC]/70"}`}>Annuel</span>
            <Badge className="ml-2 bg-[#006633] text-white">
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
              <Card key={plan.id} className={`relative bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105 ${plan.popular ? "border-[#006633] shadow-xl scale-105" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#006633] text-white">Le plus populaire</Badge>
                  </div>
                )}

                <CardHeader className="text-center bg-[#0B1623] rounded-t-lg">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-[#006633]">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-[#D4AF37]">{plan.name}</CardTitle>
                  <CardDescription className="text-[#F5F5DC]/70">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-[#F5F5DC]">
                      {price} fcfa
                      <span className="text-lg font-normal text-[#F5F5DC]/70">/{isYearly ? "an" : "mois"}</span>
                    </div>
                    {isYearly && savings > 0 && (
                      <p className="text-sm text-[#006633] mt-1">Économisez {savings}fcfa par an</p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-6 bg-[#0B1623]">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#F5F5DC]">Fermes</span>
                      <span className="font-semibold text-[#D4AF37]">{formatLimit(limits.farms)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#F5F5DC]">Parcelles</span>
                      <span className="font-semibold text-[#D4AF37]">{formatLimit(limits.parcels)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#F5F5DC]">Membres d'équipe</span>
                      <span className="font-semibold text-[#D4AF37]">{formatLimit(limits.teamMembers)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#F5F5DC]">Dépenses trackées</span>
                      <span className="font-semibold text-[#D4AF37]">{formatLimit(limits.expenses)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#F5F5DC]">Appels API météo</span>
                      <span className="font-semibold text-[#D4AF37]">{formatLimit(limits.weatherApiCalls)}/mois</span>
                    </div>
                  </div>

                  <div className="border-t border-[#D4AF37]/20 pt-4 mb-6">
                    <h4 className="font-semibold mb-3 text-[#D4AF37]">Fonctionnalités</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#F5F5DC]">Analytiques avancées</span>
                        {formatFeature(limits.features.advancedAnalytics)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#F5F5DC]">Export de données</span>
                        {formatFeature(limits.features.exportData)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#F5F5DC]">Support prioritaire</span>
                        {formatFeature(limits.features.prioritySupport)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#F5F5DC]">Rapports personnalisés</span>
                        {formatFeature(limits.features.customReports)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#F5F5DC]">Accès API</span>
                        {formatFeature(limits.features.apiAccess)}
                      </div>
                    </div>
                  </div>

                  {plan.id === "ENTERPRISE" ? (
                    <Link href={`/pricing/contact?plan=${plan.id}`}>
                      <Button
                        className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                        variant="outline"
                        disabled={(session?.user as any)?.subscription === plan.id}
                      >
                        {(session?.user as any)?.subscription === plan.id
                          ? "Plan actuel"
                          : "Contacter le support"}
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/pricing/payment?plan=${plan.id}&period=${isYearly ? 'yearly' : 'monthly'}`}>
                      <Button
                        className={`w-full ${plan.popular ? "bg-[#006633] hover:bg-[#C1440E] text-white" : "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"}`}
                        variant={plan.popular ? "default" : "outline"}
                        disabled={(session?.user as any)?.subscription === plan.id}
                      >
                        {(session?.user as any)?.subscription === plan.id
                          ? "Plan actuel"
                          : "Choisir ce plan"}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#D4AF37]">Questions Fréquentes</h2>
          <div className="space-y-6">
            <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-lg text-[#F5F5DC]">Puis-je changer de plan à tout moment ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#F5F5DC]/70">
                  Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet
                  immédiatement et votre facturation est ajustée au prorata.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-lg text-[#F5F5DC]">Que se passe-t-il si je dépasse mes limites ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#F5F5DC]/70">
                  Vous recevrez une notification lorsque vous approchez de vos limites. Si vous les dépassez, certaines
                  fonctionnalités seront temporairement limitées jusqu'à ce que vous upgradiez votre plan.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-lg text-[#F5F5DC]">Y a-t-il une période d'essai gratuite ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#F5F5DC]/70">
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
