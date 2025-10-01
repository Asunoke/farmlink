import { type NextRequest, NextResponse } from "next/server"
import { getCurrentWeather, getDailyForecast, generateAgriculturalAlerts } from "@/lib/weather"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city") || "Bamako"

    const [currentWeather, dailyForecast] = await Promise.all([getCurrentWeather(city), getDailyForecast(city)])

    const alerts = generateAgriculturalAlerts(currentWeather, dailyForecast)

    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Weather alerts API error:", error)
    return NextResponse.json({ error: "Erreur lors de la génération des alertes météo" }, { status: 500 })
  }
}
