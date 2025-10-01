import { type NextRequest, NextResponse } from "next/server"
import { getHourlyForecast, getDailyForecast } from "@/lib/weather"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city") || "Bamako"
    const type = searchParams.get("type") || "daily"

    if (type === "hourly") {
      const forecast = await getHourlyForecast(city)
      return NextResponse.json(forecast)
    } else {
      const forecast = await getDailyForecast(city)
      return NextResponse.json(forecast)
    }
  } catch (error) {
    console.error("Forecast API error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des prévisions" }, { status: 500 })
  }
}
