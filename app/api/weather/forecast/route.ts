import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getHourlyForecast, getDailyForecast } from "@/lib/weather"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city") || "Bamako"
    const type = searchParams.get("type") || "daily"

    let forecast
    if (type === "hourly") {
      forecast = await getHourlyForecast(city)
    } else {
      forecast = await getDailyForecast(city)
    }

    // Track the API call directly
    try {
      await prisma.expense.create({
        data: {
          userId: session.user.id,
          description: `weather_api_call_forecast_${type}_${city}`,
          amount: 0,
          category: 'OTHER',
          date: new Date(),
          type: 'EXPENSE'
        }
      })
    } catch (trackError) {
      console.error('Erreur lors du tracking:', trackError)
    }

    return NextResponse.json(forecast)
  } catch (error) {
    console.error("Forecast API error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des prévisions" }, { status: 500 })
  }
}
