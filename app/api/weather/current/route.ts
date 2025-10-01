import { type NextRequest, NextResponse } from "next/server"
import { getCurrentWeather, getUVIndex, malianCities } from "@/lib/weather"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city") || "Bamako"

    // Find city coordinates for UV index
    const cityData = malianCities.find((c) => c.name.toLowerCase() === city.toLowerCase())

    const weather = await getCurrentWeather(city)

    // Get UV index if coordinates are available
    if (cityData) {
      const uvIndex = await getUVIndex(cityData.lat, cityData.lon)
      weather.uvIndex = uvIndex
    }

    return NextResponse.json(weather)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des données météo" }, { status: 500 })
  }
}
