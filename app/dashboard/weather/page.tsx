"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { malianCities } from "@/lib/weather"

const getWeatherIcon = (condition: string, size = 24) => {
  const iconProps = { size, className: "text-current" }

  switch (condition) {
    case "sunny":
      return <Sun {...iconProps} className="text-yellow-500" />
    case "partly-cloudy":
      return <Cloud {...iconProps} className="text-gray-400" />
    case "cloudy":
      return <Cloud {...iconProps} className="text-gray-500" />
    case "rainy":
      return <CloudRain {...iconProps} className="text-blue-500" />
    case "stormy":
      return <CloudRain {...iconProps} className="text-purple-500" />
    default:
      return <Sun {...iconProps} />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200"
    case "low":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200"
  }
}

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState("Bamako")
  const [currentWeather, setCurrentWeather] = useState<any>(null)
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([])
  const [dailyForecast, setDailyForecast] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [error, setError] = useState<string | null>(null)

  const fetchWeatherData = async (city: string, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const [currentRes, hourlyRes, dailyRes, alertsRes] = await Promise.all([
        fetch(`/api/weather/current?city=${city}`),
        fetch(`/api/weather/forecast?city=${city}&type=hourly`),
        fetch(`/api/weather/forecast?city=${city}&type=daily`),
        fetch(`/api/weather/alerts?city=${city}`),
      ])

      if (!currentRes.ok) throw new Error("Erreur lors du chargement des données météo")

      const [current, hourly, daily, weatherAlerts] = await Promise.all([
        currentRes.json(),
        hourlyRes.json(),
        dailyRes.json(),
        alertsRes.json(),
      ])

      setCurrentWeather(current)
      setHourlyForecast(hourly)
      setDailyForecast(daily)
      setAlerts(weatherAlerts)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
      console.error("Weather fetch error:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWeatherData(selectedCity)
  }, [selectedCity])

  const refreshWeather = () => {
    fetchWeatherData(selectedCity, true)
  }

  const rainfallData = [
    { month: "Jan", rainfall: 2 },
    { month: "Fév", rainfall: 5 },
    { month: "Mar", rainfall: 15 },
    { month: "Avr", rainfall: 35 },
    { month: "Mai", rainfall: 85 },
    { month: "Jun", rainfall: 165 },
    { month: "Jul", rainfall: 220 },
    { month: "Aoû", rainfall: 285 },
    { month: "Sep", rainfall: 180 },
    { month: "Oct", rainfall: 65 },
    { month: "Nov", rainfall: 8 },
    { month: "Déc", rainfall: 1 },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <div className="grid gap-6">
            <Skeleton className="h-64 w-full" />
            <div className="grid gap-6 lg:grid-cols-2">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
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
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="outline" size="sm" className="ml-4 bg-transparent" onClick={refreshWeather}>
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Météo Agricole</h1>
            <p className="text-muted-foreground">
              Prévisions météorologiques en temps réel pour optimiser vos activités agricoles
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {malianCities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{city.name}</span>
                      <span className="text-xs text-muted-foreground">({city.region})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={refreshWeather} disabled={refreshing}>
              {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Actualiser
            </Button>
          </div>
        </div>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{alert.title}</h4>
                        <Badge variant="secondary" className={getSeverityColor(alert.severity)}>
                          {alert.severity === "high" ? "Élevé" : alert.severity === "medium" ? "Moyen" : "Faible"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium">Action: {alert.action}</p>
                        <p className="text-xs text-muted-foreground">
                          Valide jusqu'au {new Date(alert.validUntil).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Current Weather */}
        {currentWeather && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle>{currentWeather.location}</CardTitle>
                    <CardDescription>
                      Dernière mise à jour:{" "}
                      {lastUpdated.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </CardDescription>
                  </div>
                </div>
                {getWeatherIcon(currentWeather.icon, 48)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{currentWeather.temperature}°C</div>
                  <p className="text-sm text-muted-foreground">Ressenti {currentWeather.feelsLike}°C</p>
                  <p className="text-sm font-medium capitalize">{currentWeather.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Humidité: {currentWeather.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Vent: {currentWeather.windSpeed} km/h {currentWeather.windDirection}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Pression: {currentWeather.pressure} hPa</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Visibilité: {currentWeather.visibility} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">UV Index: {currentWeather.uvIndex}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Condition: {currentWeather.condition}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sunrise className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Lever: {currentWeather.sunrise}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sunset className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Coucher: {currentWeather.sunset}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hourly Forecast */}
        {hourlyForecast.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Prévisions Horaires</CardTitle>
              <CardDescription>Évolution météo des prochaines 24 heures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hourlyForecast.map((hour, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium w-12">{hour.time}</span>
                      {getWeatherIcon(hour.condition, 20)}
                      <span className="text-sm font-bold">{hour.temp}°C</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CloudRain className="h-3 w-3 text-blue-500" />
                        <span>{hour.rain}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="h-3 w-3 text-gray-500" />
                        <span>{hour.wind} km/h</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Forecast */}
        {dailyForecast.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Prévisions 7 Jours</CardTitle>
              <CardDescription>Tendances météorologiques de la semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dailyForecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-16">
                        <p className="text-sm font-medium">{day.day}</p>
                        <p className="text-xs text-muted-foreground">{day.date}</p>
                      </div>
                      {getWeatherIcon(day.icon, 20)}
                      <div className="flex-1">
                        <p className="text-sm">{day.condition}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CloudRain className="h-3 w-3 text-blue-500" />
                          <span>{day.rain}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{day.high}°</p>
                      <p className="text-xs text-muted-foreground">{day.low}°</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Agricultural Insights */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Conseils Agricoles</CardTitle>
              <CardDescription>Recommandations basées sur la météo actuelle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Droplets className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Irrigation</p>
                    <p className="text-xs text-green-700 dark:text-green-200">
                      Avec les pluies prévues demain, reportez l'arrosage de 2-3 jours pour éviter l'excès d'eau.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Planification</p>
                    <p className="text-xs text-blue-700 dark:text-blue-200">
                      Conditions idéales pour les semis d'arachide la semaine prochaine (sol humide, températures
                      modérées).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sun className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Protection</p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-200">
                      UV élevé aujourd'hui. Protégez les jeunes plants et planifiez les travaux tôt le matin.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Récolte</p>
                    <p className="text-xs text-purple-700 dark:text-purple-200">
                      Conditions sèches prévues en fin de semaine, idéales pour la récolte du mil en Parcelle A.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pluviométrie Annuelle</CardTitle>
              <CardDescription>Précipitations moyennes au Mali</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={rainfallData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} mm`, "Précipitations"]} />
                  <Bar dataKey="rainfall" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-xs text-muted-foreground">
                <p>Saison sèche: Novembre - Avril</p>
                <p>Saison des pluies: Mai - Octobre</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weather History & Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tendances Météorologiques</CardTitle>
            <CardDescription>Évolution des conditions météo sur les 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="temperature" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="temperature">Température</TabsTrigger>
                <TabsTrigger value="rainfall">Précipitations</TabsTrigger>
                <TabsTrigger value="humidity">Humidité</TabsTrigger>
              </TabsList>

              <TabsContent value="temperature" className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { day: "1", max: 35, min: 22 },
                      { day: "5", max: 37, min: 24 },
                      { day: "10", max: 34, min: 21 },
                      { day: "15", max: 36, min: 23 },
                      { day: "20", max: 33, min: 20 },
                      { day: "25", max: 35, min: 22 },
                      { day: "30", max: 32, min: 19 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}°C`, ""]} />
                    <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={2} name="Max" />
                    <Line type="monotone" dataKey="min" stroke="#3b82f6" strokeWidth={2} name="Min" />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="rainfall" className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { day: "1", rainfall: 0 },
                      { day: "5", rainfall: 15 },
                      { day: "10", rainfall: 45 },
                      { day: "15", rainfall: 0 },
                      { day: "20", rainfall: 85 },
                      { day: "25", rainfall: 25 },
                      { day: "30", rainfall: 0 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} mm`, "Précipitations"]} />
                    <Bar dataKey="rainfall" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="humidity" className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { day: "1", humidity: 45 },
                      { day: "5", humidity: 52 },
                      { day: "10", humidity: 68 },
                      { day: "15", humidity: 41 },
                      { day: "20", humidity: 78 },
                      { day: "25", humidity: 55 },
                      { day: "30", humidity: 48 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Humidité"]} />
                    <Line type="monotone" dataKey="humidity" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
