"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, Sun, Droplets, Wind, Eye, Thermometer, Gauge, RefreshCw, AlertTriangle, Crown, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { DashboardLayout } from "@/components/dashboard-layout"
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

export default function WeatherPage() {
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
        setForecast(forecastData.slice(0, 7)) // 7 jours complets
        
        // Vérifier les alertes de pluie pour Business/Entreprise
        if (['BUSINESS', 'ENTERPRISE'].includes(subscription)) {
          checkRainAlerts(forecastData.slice(0, 5))
        }
      }

      await fetchLimits()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
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

  if (loading && !weather) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg">Chargement des données météo...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          {limits && limits.apiCallsRemaining <= 0 && (
            <div className="text-center">
              <Link href="/pricing">
                <Button size="lg">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgradez votre plan
                </Button>
              </Link>
            </div>
          )}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Météo</h1>
            <p className="text-muted-foreground">
              Conditions météorologiques et prévisions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={fetchWeatherData}
              disabled={loading || (limits && limits.apiCallsRemaining <= 0)}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Alerte de pluie pour Business/Entreprise */}
        {rainAlert.show && ['BUSINESS', 'ENTERPRISE'].includes(subscription) && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              {rainAlert.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Sélection de ville */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Sélection de ville
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full max-w-xs">
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
              {lastUpdate && (
                <div className="text-sm text-muted-foreground">
                  Dernière mise à jour: {format(lastUpdate, 'HH:mm', { locale: fr })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Données météo actuelles */}
        {weather && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Conditions actuelles - {weather.city}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  {getWeatherIcon(weather.icon)}
                  <div>
                    <div className="text-4xl font-bold">{weather.temperature}°C</div>
                    <div className="text-lg text-muted-foreground">{weather.description}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Humidité</div>
                      <div className="font-semibold">{weather.humidity}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Vent</div>
                      <div className="font-semibold">{weather.windSpeed} km/h</div>
                    </div>
                  </div>
                  
                  {limits?.canViewAdvanced && weather.uvIndex && (
                    <div className="flex items-center gap-2">
                      <Sun className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Index UV</div>
                        <div className={`font-semibold ${getUVIndexColor(weather.uvIndex)}`}>
                          {weather.uvIndex} ({getUVIndexLabel(weather.uvIndex)})
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {limits?.canViewAdvanced && weather.pressure && (
                    <div className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">Pression</div>
                        <div className="font-semibold">{weather.pressure} hPa</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prévisions */}
        {limits?.canViewForecast && forecast.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Prévisions 7 jours
              </CardTitle>
              <CardDescription>
                Prévisions détaillées pour {selectedCity}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                  {getWeatherIcon(day.icon)}
                  <div>
                    <div className="font-medium">
                      {index === 0 ? 'Aujourd\'hui' : format(new Date(day.date), 'EEEE dd MMMM', { locale: fr })}
                    </div>
                    <div className="text-sm text-muted-foreground">{day.description}</div>
                    {day.rainProbability && (
                      <div className="text-xs text-blue-600">
                        Pluie: {day.rainProbability}%
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">{day.temperature.max}°</div>
                    <div className="text-sm text-muted-foreground">{day.temperature.min}°</div>
                  </div>
                  {day.rainProbability && day.rainProbability > 50 && (
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      <Droplets className="h-3 w-3 mr-1" />
                      Pluie probable
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )}

    {/* Limitations par plan */}
    {!limits?.canViewForecast && (
      <Alert>
        <Crown className="h-4 w-4" />
        <AlertDescription>
          Les prévisions météo sont disponibles avec les plans Business et Entreprise.
          <Link href="/pricing" className="ml-2 underline">
            Upgradez votre plan
          </Link>
        </AlertDescription>
      </Alert>
    )}

    {/* Compteur d'appels API */}
    {limits && (
      <div className="text-center text-sm text-muted-foreground">
        {limits.apiCallsRemaining} appels API restants ce mois ({limits.apiCallsLimit} total)
      </div>
    )}
  </div>
</DashboardLayout>
)
}
