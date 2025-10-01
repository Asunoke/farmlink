interface WeatherData {
  location: string
  temperature: number
  feelsLike: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  windDirection: string
  pressure: number
  visibility: number
  uvIndex: number
  sunrise: string
  sunset: string
  icon: string
}

interface HourlyForecast {
  time: string
  temp: number
  condition: string
  rain: number
  wind: number
  icon: string
}

interface DailyForecast {
  day: string
  date: string
  high: number
  low: number
  condition: string
  rain: number
  icon: string
}

interface WeatherAlert {
  id: string
  type: string
  severity: "low" | "medium" | "high"
  title: string
  description: string
  action: string
  validUntil: string
}

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5"

export async function getCurrentWeather(city: string): Promise<WeatherData> {
  if (!OPENWEATHER_API_KEY) {
    throw new Error("OpenWeather API key not configured")
  }

  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city},ML&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`,
      { next: { revalidate: 300 } }, // Cache for 5 minutes
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      location: `${data.name}, Mali`,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: getWindDirection(data.wind.deg),
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1000), // Convert m to km
      uvIndex: 0, // UV index requires separate API call
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      icon: mapWeatherIcon(data.weather[0].icon),
    }
  } catch (error) {
    console.error("Error fetching current weather:", error)
    throw error
  }
}

export async function getHourlyForecast(city: string): Promise<HourlyForecast[]> {
  if (!OPENWEATHER_API_KEY) {
    throw new Error("OpenWeather API key not configured")
  }

  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city},ML&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`,
      { next: { revalidate: 300 } },
    )

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`)
    }

    const data = await response.json()

    return data.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      rain: item.pop * 100, // Probability of precipitation
      wind: Math.round(item.wind.speed * 3.6),
      icon: mapWeatherIcon(item.weather[0].icon),
    }))
  } catch (error) {
    console.error("Error fetching hourly forecast:", error)
    throw error
  }
}

export async function getDailyForecast(city: string): Promise<DailyForecast[]> {
  if (!OPENWEATHER_API_KEY) {
    throw new Error("OpenWeather API key not configured")
  }

  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city},ML&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`,
      { next: { revalidate: 300 } },
    )

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`)
    }

    const data = await response.json()

    // Group by day and get daily min/max
    const dailyData = new Map()

    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000)
      const dayKey = date.toDateString()

      if (!dailyData.has(dayKey)) {
        dailyData.set(dayKey, {
          date: date,
          temps: [item.main.temp],
          conditions: [item.weather[0]],
          rain: item.pop * 100,
        })
      } else {
        const existing = dailyData.get(dayKey)
        existing.temps.push(item.main.temp)
        existing.conditions.push(item.weather[0])
        existing.rain = Math.max(existing.rain, item.pop * 100)
      }
    })

    const result: DailyForecast[] = []
    let dayIndex = 0

    for (const [dayKey, dayData] of dailyData) {
      if (result.length >= 7) break

      const date = dayData.date
      const dayName =
        dayIndex === 0
          ? "Aujourd'hui"
          : dayIndex === 1
            ? "Demain"
            : date.toLocaleDateString("fr-FR", { weekday: "long" })

      result.push({
        day: dayName,
        date: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
        high: Math.round(Math.max(...dayData.temps)),
        low: Math.round(Math.min(...dayData.temps)),
        condition: dayData.conditions[0].description,
        rain: Math.round(dayData.rain),
        icon: mapWeatherIcon(dayData.conditions[0].icon),
      })

      dayIndex++
    }

    return result
  } catch (error) {
    console.error("Error fetching daily forecast:", error)
    throw error
  }
}

export async function getUVIndex(lat: number, lon: number): Promise<number> {
  if (!OPENWEATHER_API_KEY) {
    return 0
  }

  try {
    const response = await fetch(
      `${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!response.ok) {
      return 0
    }

    const data = await response.json()
    return Math.round(data.value)
  } catch (error) {
    console.error("Error fetching UV index:", error)
    return 0
  }
}

export function generateAgriculturalAlerts(weather: WeatherData, forecast: DailyForecast[]): WeatherAlert[] {
  const alerts: WeatherAlert[] = []

  // High temperature alert
  if (weather.temperature > 35) {
    alerts.push({
      id: "high-temp",
      type: "heat",
      severity: weather.temperature > 40 ? "high" : "medium",
      title: "Températures élevées",
      description: `Température actuelle de ${weather.temperature}°C. Risque de stress hydrique pour les cultures.`,
      action: "Augmenter la fréquence d'arrosage et protéger les jeunes plants",
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  // Heavy rain alert
  const tomorrowRain = forecast[1]?.rain || 0
  if (tomorrowRain > 70) {
    alerts.push({
      id: "heavy-rain",
      type: "rain",
      severity: tomorrowRain > 90 ? "high" : "medium",
      title: "Fortes pluies prévues",
      description: `Probabilité de pluie de ${tomorrowRain}% demain. Risque d'inondation des parcelles.`,
      action: "Reporter l'arrosage et vérifier le drainage des parcelles",
      validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    })
  }

  // Strong wind alert
  if (weather.windSpeed > 25) {
    alerts.push({
      id: "strong-wind",
      type: "wind",
      severity: weather.windSpeed > 40 ? "high" : "medium",
      title: "Vents forts",
      description: `Vents de ${weather.windSpeed} km/h. Risque de dommages aux structures et cultures hautes.`,
      action: "Sécuriser les équipements mobiles et vérifier les tuteurs",
      validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    })
  }

  // Low humidity alert
  if (weather.humidity < 30) {
    alerts.push({
      id: "low-humidity",
      type: "drought",
      severity: "medium",
      title: "Humidité faible",
      description: `Humidité de ${weather.humidity}%. Conditions sèches défavorables aux cultures.`,
      action: "Augmenter l'arrosage et surveiller les signes de stress hydrique",
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return alerts
}

function getWindDirection(degrees: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSO",
    "SO",
    "OSO",
    "O",
    "ONO",
    "NO",
    "NNO",
  ]
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

function mapWeatherIcon(openWeatherIcon: string): string {
  const iconMap: { [key: string]: string } = {
    "01d": "sunny",
    "01n": "clear-night",
    "02d": "partly-cloudy",
    "02n": "partly-cloudy-night",
    "03d": "cloudy",
    "03n": "cloudy",
    "04d": "cloudy",
    "04n": "cloudy",
    "09d": "rainy",
    "09n": "rainy",
    "10d": "rainy",
    "10n": "rainy",
    "11d": "stormy",
    "11n": "stormy",
    "13d": "snowy",
    "13n": "snowy",
    "50d": "foggy",
    "50n": "foggy",
  }

  return iconMap[openWeatherIcon] || "sunny"
}

// Malian cities with coordinates for weather API
export const malianCities = [
  { name: "Bamako", region: "District de Bamako", lat: 12.6392, lon: -8.0029 },
  { name: "Sikasso", region: "Sikasso", lat: 11.3176, lon: -5.6717 },
  { name: "Koutiala", region: "Sikasso", lat: 12.3924, lon: -5.4636 },
  { name: "Kayes", region: "Kayes", lat: 14.4461, lon: -11.4456 },
  { name: "Mopti", region: "Mopti", lat: 14.4843, lon: -4.196 },
  { name: "Ségou", region: "Ségou", lat: 13.4317, lon: -6.2158 },
  { name: "Gao", region: "Gao", lat: 16.2719, lon: -0.0447 },
  { name: "Tombouctou", region: "Tombouctou", lat: 16.7666, lon: -3.0026 },
]
