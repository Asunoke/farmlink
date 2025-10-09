"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cloud, Sun, Droplets, Wind, Eye, Thermometer, Gauge, RefreshCw, AlertTriangle, Crown } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
  city: string
  uvIndex?: number
  pressure?: number
  visibility?: number
}

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

interface WeatherLimits {
  canViewForecast: boolean
  canViewAdvanced: boolean
  canViewMultipleCities: boolean
  apiCallsRemaining: number
  apiCallsLimit: number
}

const malianCities = [
  "Bamako", "Sikasso", "Mopti", "Ségou", "Gao", "Koutiala", 
  "Kayes", "Kati", "San", "Bougouni", "Koulikoro", "Djenné"
]

export function WeatherWidget() {
  const { data: session } = useSession()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData[]>([])
  const [selectedCity, setSelectedCity] = useState("Bamako")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [limits, setLimits] = useState<WeatherLimits | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [rainAlert, setRainAlert] = useState<{show: boolean, message: string}>({show: false, message: ''})

  const subscription = (session?.user as any)?.subscription || 'FREE'

  useEffect(() => {
    fetchWeatherData()
    fetchLimits()
  }, [selectedCity, subscription])

  const fetchLimits = async () => {
    try {
      const response = await fetch('/api/user/weather-limits')
      if (response.ok) {
        const data = await response.json()
        setLimits(data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des limites:', error)
    }
  }

  const fetchWeatherData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Vérifier les limites avant de faire l'appel
      if (limits && limits.apiCallsRemaining <= 0) {
        setError("Limite d'appels API météo atteinte. Upgradez votre plan pour continuer.")
        return
      }

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`/api/weather/current?city=${selectedCity}`),
        limits?.canViewForecast ? fetch(`/api/weather/forecast?city=${selectedCity}`) : Promise.resolve(null)
      ])

      if (!weatherResponse.ok) {
        throw new Error("Erreur lors de la récupération des données météo")
      }

      const weatherData = await weatherResponse.json()
      setWeather(weatherData)
      setLastUpdate(new Date())

      if (forecastResponse && forecastResponse.ok) {
        const forecastData = await forecastResponse.json()
        setForecast(forecastData.slice(0, 5)) // Limiter à 5 jours
        
        // Vérifier les alertes de pluie pour Business/Entreprise
        if (['BUSINESS', 'ENTERPRISE'].includes(subscription)) {
          checkRainAlerts(forecastData.slice(0, 3)) // Vérifier les 3 prochains jours
        }
      }

      // Mettre à jour les limites après l'appel
      await fetchLimits()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sunny':
      case 'clear':
        return <Sun className="h-6 w-6 text-yellow-500" />
      case 'cloudy':
      case 'overcast':
        return <Cloud className="h-6 w-6 text-gray-500" />
      case 'rainy':
      case 'rain':
        return <Droplets className="h-6 w-6 text-blue-500" />
      default:
        return <Cloud className="h-6 w-6 text-gray-400" />
    }
  }

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return "text-green-600"
    if (uvIndex <= 5) return "text-yellow-600"
    if (uvIndex <= 7) return "text-orange-600"
    if (uvIndex <= 10) return "text-red-600"
    return "text-purple-600"
  }

  const getUVIndexLabel = (uvIndex: number) => {
    if (uvIndex <= 2) return "Faible"
    if (uvIndex <= 5) return "Modéré"
    if (uvIndex <= 7) return "Élevé"
    if (uvIndex <= 10) return "Très élevé"
    return "Extrême"
  }

  const checkRainAlerts = (forecastData: ForecastData[]) => {
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
      
      setRainAlert({
        show: true,
        message: `⚠️ Pluie prévue ${date} - ${day!.description}${day!.rainProbability ? ` (${day!.rainProbability}% de probabilité)` : ''}`
      })
    } else {
      setRainAlert({ show: false, message: '' })
    }
  }

  if (loading && !weather) {
    return (
      <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
            <Cloud className="h-5 w-5" />
            Météo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-[#006633]" />
            <span className="ml-2 text-[#F5F5DC]">Chargement...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
            <Cloud className="h-5 w-5" />
            Météo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-[#C1440E] bg-[#C1440E]/10">
            <AlertTriangle className="h-4 w-4 text-[#C1440E]" />
            <AlertDescription className="text-[#F5F5DC]">{error}</AlertDescription>
          </Alert>
          {limits && limits.apiCallsRemaining <= 0 && (
            <div className="mt-4">
              <Link href="/pricing">
                <Button size="sm" className="w-full bg-[#006633] hover:bg-[#C1440E] text-white">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgradez votre plan
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
            <Cloud className="h-5 w-5" />
            Météo
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
            onClick={fetchWeatherData}
            disabled={loading || (limits && limits.apiCallsRemaining <= 0)}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription className="text-[#F5F5DC]/70">
          {lastUpdate && `Dernière mise à jour: ${format(lastUpdate, 'HH:mm', { locale: fr })}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sélection de ville */}
        <div className="flex items-center gap-2">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {malianCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Alerte de pluie pour Business/Entreprise */}
        {rainAlert.show && ['BUSINESS', 'ENTERPRISE'].includes(subscription) && (
          <Alert className="border-[#006633] bg-[#006633]/10">
            <AlertTriangle className="h-4 w-4 text-[#006633]" />
            <AlertDescription className="text-[#F5F5DC]">
              {rainAlert.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Données météo actuelles */}
        {weather && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getWeatherIcon(weather.icon)}
                <div>
                  <div className="text-2xl font-bold text-[#F5F5DC]">{weather.temperature}°C</div>
                  <div className="text-sm text-[#F5F5DC]/70">{weather.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-[#D4AF37]">{weather.city}</div>
                <div className="text-xs text-[#F5F5DC]/70">
                  {format(new Date(), 'dd MMM yyyy', { locale: fr })}
                </div>
              </div>
            </div>

            {/* Données détaillées */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span>Humidité: {weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wind className="h-4 w-4 text-gray-500" />
                <span>Vent: {weather.windSpeed} km/h</span>
              </div>
              
              {limits?.canViewAdvanced && weather.uvIndex && (
                <div className="flex items-center gap-2 text-sm">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <span>UV: <span className={getUVIndexColor(weather.uvIndex)}>{weather.uvIndex} ({getUVIndexLabel(weather.uvIndex)})</span></span>
                </div>
              )}
              
              {limits?.canViewAdvanced && weather.pressure && (
                <div className="flex items-center gap-2 text-sm">
                  <Gauge className="h-4 w-4 text-gray-500" />
                  <span>Pression: {weather.pressure} hPa</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prévisions */}
        {limits?.canViewForecast && forecast.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Prévisions 5 jours</h4>
              <Badge variant="outline" className="text-xs border-[#D4AF37] text-[#D4AF37]">
                {limits.apiCallsRemaining}/{limits.apiCallsLimit} appels restants
              </Badge>
            </div>
            <div className="space-y-2">
              {forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-2">
                    {getWeatherIcon(day.icon)}
                    <span className="text-sm font-medium">
                      {index === 0 ? 'Aujourd\'hui' : format(new Date(day.date), 'EEE', { locale: fr })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{day.temperature.min}°</span>
                    <span className="font-medium">{day.temperature.max}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Limitations par plan */}
        {!limits?.canViewForecast && (
          <Alert className="border-[#D4AF37] bg-[#D4AF37]/10">
            <Crown className="h-4 w-4 text-[#D4AF37]" />
            <AlertDescription className="text-[#F5F5DC]">
              Les prévisions météo sont disponibles avec les plans Business et Entreprise.
            </AlertDescription>
          </Alert>
        )}

        {!limits?.canViewAdvanced && (
          <Alert className="border-[#D4AF37] bg-[#D4AF37]/10">
            <Crown className="h-4 w-4 text-[#D4AF37]" />
            <AlertDescription className="text-[#F5F5DC]">
              Les données avancées (UV, pression) sont disponibles avec les plans Business et Entreprise.
            </AlertDescription>
          </Alert>
        )}

        {/* Compteur d'appels API */}
        {limits && (
          <div className="text-xs text-[#F5F5DC]/70 text-center">
            {limits.apiCallsRemaining} appels API restants ce mois
          </div>
        )}
      </CardContent>
    </Card>
  )
}
