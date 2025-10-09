import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getCurrentWeather, getUVIndex, malianCities } from "@/lib/weather"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

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

    // Track the API call directly
    try {
      await prisma.expense.create({
        data: {
          userId: session.user.id,
          description: `weather_api_call_current_${city}`,
          amount: 0,
          category: 'OTHER',
          date: new Date(),
          type: 'EXPENSE'
        }
      })
    } catch (trackError) {
      console.error('Erreur lors du tracking:', trackError)
    }

    return NextResponse.json(weather)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des données météo" }, { status: 500 })
  }
}
