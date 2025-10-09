"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSubscriptionLimits, getUsagePercentage } from "@/lib/subscription-limits"
import { AlertTriangle, TrendingUp } from "lucide-react"
import Link from "next/link"

interface UsageData {
  farms: number
  teamMembers: number
  expenses: number
}

export function SubscriptionUsage() {
  const { data: session } = useSession()
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const [farmsRes, teamRes, expensesRes] = await Promise.all([
          fetch("/api/farms"),
          fetch("/api/team"),
          fetch("/api/expenses"),
        ])

        const [farms, team, expenses] = await Promise.all([farmsRes.json(), teamRes.json(), expensesRes.json()])

        setUsage({
          farms: farms.length || 0,
          teamMembers: team.length || 0,
          expenses: expenses.filter((exp: any) => exp.type === 'EXPENSE' || exp.type === 'REVENUE').length || 0,
        })
      } catch (error) {
        console.error("Error fetching usage:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchUsage()
    }
  }, [session])

  if (!session?.user || loading || !usage) {
    return null
  }

  const subscription = (session.user as any).subscription || 'FREE'
  const limits = getSubscriptionLimits(subscription)

  const usageItems = [
    {
      name: "Fermes",
      current: usage.farms,
      limit: limits.farms,
      key: "farms" as const,
    },
    {
      name: "Membres d'équipe",
      current: usage.teamMembers,
      limit: limits.teamMembers,
      key: "teamMembers" as const,
    },
    {
      name: "Appels API",
      current: usage.expenses,
      limit: limits.expenses,
      key: "expenses" as const,
    },
  ]

  const hasWarnings = usageItems.some((item) => {
    const percentage = getUsagePercentage(subscription, item.key, item.current)
    return percentage >= 80
  })

  return (
    <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
              <TrendingUp className="h-5 w-5" />
              Utilisation de votre abonnement
            </CardTitle>
            <CardDescription className="text-[#F5F5DC]">
              Plan actuel: <Badge className="ml-1 bg-[#006633] text-white hover:bg-[#C1440E] transition-colors">{subscription}</Badge>
            </CardDescription>
          </div>
          <Link href="/pricing">
            <Button variant="outline" size="sm" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A] transition-all duration-300">
              Changer de plan
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasWarnings && (
          <Alert className="border-[#C1440E] bg-[#C1440E]/10">
            <AlertTriangle className="h-4 w-4 text-[#C1440E]" />
            <AlertDescription className="text-[#F5F5DC]">
              Vous approchez des limites de votre plan. Considérez un upgrade pour éviter les restrictions.
            </AlertDescription>
          </Alert>
        )}

        {usageItems.map((item) => {
          const percentage = getUsagePercentage(subscription, item.key, item.current)
          const isNearLimit = percentage >= 80
          const isAtLimit = percentage >= 100

          return (
            <div key={item.key} className="space-y-2 animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#F5F5DC]">{item.name}</span>
                <span
                  className={`text-sm ${isAtLimit ? "text-[#C1440E]" : isNearLimit ? "text-[#D4AF37]" : "text-[#F5F5DC]/70"}`}
                >
                  {item.current} / {item.limit === Number.POSITIVE_INFINITY ? "∞" : item.limit}
                </span>
              </div>
              <Progress
                value={percentage}
                className={`h-2 ${isAtLimit ? "[&>div]:bg-[#C1440E]" : isNearLimit ? "[&>div]:bg-[#D4AF37]" : "[&>div]:bg-[#006633]"}`}
              />
              {isAtLimit && (
                <p className="text-xs text-[#C1440E]">Limite atteinte - Upgradez votre plan pour continuer</p>
              )}
              {isNearLimit && !isAtLimit && (
                <p className="text-xs text-[#D4AF37]">Attention: {Math.round(percentage)}% de votre limite utilisée</p>
              )}
            </div>
          )
        })}

        <div className="pt-4 border-t border-[#D4AF37]/20">
          <h4 className="text-sm font-medium mb-2 text-[#D4AF37]">Fonctionnalités disponibles</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              className={`flex items-center gap-1 ${limits.features.advancedAnalytics ? "text-[#006633]" : "text-[#F5F5DC]/50"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${limits.features.advancedAnalytics ? "bg-[#006633]" : "bg-[#F5F5DC]/30"}`}
              />
              Analytiques avancées
            </div>
            <div
              className={`flex items-center gap-1 ${limits.features.exportData ? "text-[#006633]" : "text-[#F5F5DC]/50"}`}
            >
              <div className={`w-2 h-2 rounded-full ${limits.features.exportData ? "bg-[#006633]" : "bg-[#F5F5DC]/30"}`} />
              Export de données
            </div>
            <div
              className={`flex items-center gap-1 ${limits.features.prioritySupport ? "text-[#006633]" : "text-[#F5F5DC]/50"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${limits.features.prioritySupport ? "bg-[#006633]" : "bg-[#F5F5DC]/30"}`}
              />
              Support prioritaire
            </div>
            <div
              className={`flex items-center gap-1 ${limits.features.customReports ? "text-[#006633]" : "text-[#F5F5DC]/50"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${limits.features.customReports ? "bg-[#006633]" : "bg-[#F5F5DC]/30"}`}
              />
              Rapports personnalisés
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
