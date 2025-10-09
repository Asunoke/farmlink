import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SUBSCRIPTION_LIMITS } from "@/lib/subscription-limits"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const subscription = session.user.subscription || 'FREE'
    const limits = SUBSCRIPTION_LIMITS[subscription] || SUBSCRIPTION_LIMITS['FREE']

    console.log('Subscription:', subscription, 'Limits found:', !!limits)

    // Calculer les appels API restants pour ce mois
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    // Compter les appels API météo du mois en cours
    const apiCallsThisMonth = await prisma.expense.count({
      where: {
        userId: session.user.id,
        category: 'OTHER', // On peut utiliser une catégorie spéciale pour les appels API
        description: {
          contains: 'weather_api_call'
        },
        createdAt: {
          gte: startOfMonth
        }
      }
    })

    const apiCallsRemaining = Math.max(0, limits.weatherApiCalls - apiCallsThisMonth)

    // Déterminer les fonctionnalités disponibles selon le plan
    const canViewForecast = ['BUSINESS', 'ENTERPRISE'].includes(subscription)
    const canViewAdvanced = ['BUSINESS', 'ENTERPRISE'].includes(subscription)
    const canViewMultipleCities = ['BUSINESS', 'ENTERPRISE'].includes(subscription)

    return NextResponse.json({
      canViewForecast,
      canViewAdvanced,
      canViewMultipleCities,
      apiCallsRemaining,
      apiCallsLimit: limits.weatherApiCalls,
      subscription
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des limites météo:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
