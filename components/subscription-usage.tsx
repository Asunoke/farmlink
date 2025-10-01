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
          expenses: expenses.length || 0,
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

  const subscription = session.user.subscription
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
      name: "Dépenses",
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Utilisation de votre abonnement
            </CardTitle>
            <CardDescription>
              Plan actuel: <Badge className="ml-1">{subscription}</Badge>
            </CardDescription>
          </div>
          <Link href="/pricing">
            <Button variant="outline" size="sm">
              Changer de plan
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasWarnings && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Vous approchez des limites de votre plan. Considérez un upgrade pour éviter les restrictions.
            </AlertDescription>
          </Alert>
        )}

        {usageItems.map((item) => {
          const percentage = getUsagePercentage(subscription, item.key, item.current)
          const isNearLimit = percentage >= 80
          const isAtLimit = percentage >= 100

          return (
            <div key={item.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.name}</span>
                <span
                  className={`text-sm ${isAtLimit ? "text-red-600" : isNearLimit ? "text-yellow-600" : "text-muted-foreground"}`}
                >
                  {item.current} / {item.limit === Number.POSITIVE_INFINITY ? "∞" : item.limit}
                </span>
              </div>
              <Progress
                value={percentage}
                className={`h-2 ${isAtLimit ? "[&>div]:bg-red-500" : isNearLimit ? "[&>div]:bg-yellow-500" : ""}`}
              />
              {isAtLimit && (
                <p className="text-xs text-red-600">Limite atteinte - Upgradez votre plan pour continuer</p>
              )}
              {isNearLimit && !isAtLimit && (
                <p className="text-xs text-yellow-600">Attention: {Math.round(percentage)}% de votre limite utilisée</p>
              )}
            </div>
          )
        })}

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Fonctionnalités disponibles</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              className={`flex items-center gap-1 ${limits.features.advancedAnalytics ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${limits.features.advancedAnalytics ? "bg-green-500" : "bg-gray-300"}`}
              />
              Analytiques avancées
            </div>
            <div
              className={`flex items-center gap-1 ${limits.features.exportData ? "text-green-600" : "text-gray-400"}`}
            >
              <div className={`w-2 h-2 rounded-full ${limits.features.exportData ? "bg-green-500" : "bg-gray-300"}`} />
              Export de données
            </div>
            <div
              className={`flex items-center gap-1 ${limits.features.prioritySupport ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${limits.features.prioritySupport ? "bg-green-500" : "bg-gray-300"}`}
              />
              Support prioritaire
            </div>
            <div
              className={`flex items-center gap-1 ${limits.features.customReports ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${limits.features.customReports ? "bg-green-500" : "bg-gray-300"}`}
              />
              Rapports personnalisés
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
