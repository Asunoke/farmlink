import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

interface ForecastData {
  date: string
  temperature: {
    min: number
    max: number
  }
  description: string
  icon: string
  precipitation?: number
  rainProbability?: number
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city') || 'Bamako'
    const subscription = (session.user as any)?.subscription || 'FREE'

    // Vérifier si l'utilisateur peut voir les alertes (Business/Enterprise)
    if (!['BUSINESS', 'ENTERPRISE'].includes(subscription)) {
      return NextResponse.json({ alerts: [] })
    }

    // Récupérer les données de prévision
    const baseUrl = process.env.NEXTAUTH_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') || 
                    'http://localhost:3000'
    const forecastResponse = await fetch(`${baseUrl}/api/weather/forecast?city=${city}`)
    
    if (!forecastResponse.ok) {
      return NextResponse.json({ alerts: [] })
    }

    const forecastData: ForecastData[] = await forecastResponse.json()
    
    // Vérifier les alertes de pluie
    const alerts = []
    const rainKeywords = ['rain', 'pluie', 'shower', 'drizzle', 'storm', 'orage', 'thunder']
    
    const highRainProbability = forecastData.find(day => 
      day.rainProbability && day.rainProbability > 70
    )
    
    const rainInDescription = forecastData.find(day => 
      rainKeywords.some(keyword => 
        day.description.toLowerCase().includes(keyword)
      )
    )

    if (highRainProbability || rainInDescription) {
      const day = highRainProbability || rainInDescription
      const date = new Date(day!.date).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      })
      
      alerts.push({
        type: 'rain',
        severity: 'warning',
        title: 'Alerte Météo - Pluies prévues',
        message: `Pluie prévue ${date} - ${day!.description}${day!.rainProbability ? ` (${day!.rainProbability}% de probabilité)` : ''}`,
        date: day!.date,
        probability: day!.rainProbability || 0
      })
    }

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes météo:', error)
    return NextResponse.json({ alerts: [] })
  }
}