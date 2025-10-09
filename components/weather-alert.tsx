"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Droplets } from "lucide-react"
import Link from "next/link"

interface WeatherAlert {
  type: string
  severity: string
  title: string
  message: string
  date: string
  probability: number
}

export function WeatherAlert() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeatherAlerts()
  }, [])

  const fetchWeatherAlerts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/weather/alerts?city=Bamako')
      
      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts || [])
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes météo:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null
  }

  if (alerts.length === 0) {
    return null
  }

  return (
    <>
      {alerts.map((alert, index) => (
        <Card key={index} className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {alert.type === 'rain' ? (
                <Droplets className="h-5 w-5 text-amber-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              )}
              <div className="flex-1">
                <p className="font-medium text-amber-900 dark:text-amber-100">{alert.title}</p>
                <p className="text-sm text-amber-700 dark:text-amber-200">
                  {alert.message}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent"
                asChild
              >
                <Link href="/weather">
                  Voir détails
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
