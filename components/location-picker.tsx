"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Navigation, Search } from "lucide-react"
import { getCurrentPosition, geocodeAddress, SENEGAL_CITIES, LocationCoordinates } from "@/lib/geolocation"

interface LocationPickerProps {
  value: string
  onChange: (location: string, coordinates?: LocationCoordinates) => void
  placeholder?: string
  label?: string
  required?: boolean
}

export function LocationPicker({ 
  value, 
  onChange, 
  placeholder = "Entrez une adresse ou sélectionnez une ville",
  label = "Localisation",
  required = false 
}: LocationPickerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [coordinates, setCoordinates] = useState<LocationCoordinates | null>(null)

  const handleLocationSearch = async () => {
    if (!value.trim()) return

    setIsLoading(true)
    try {
      const locationInfo = await geocodeAddress(value)
      if (locationInfo) {
        setCoordinates(locationInfo.coordinates)
        onChange(value, locationInfo.coordinates)
      } else {
        // Si le géocodage échoue, essayer de trouver dans les villes du Sénégal
        const cityCoords = Object.entries(SENEGAL_CITIES).find(([cityName]) => 
          cityName.toLowerCase().includes(value.toLowerCase()) ||
          value.toLowerCase().includes(cityName.toLowerCase())
        )
        
        if (cityCoords) {
          const [, coords] = cityCoords
          setCoordinates(coords)
          onChange(cityCoords[0], coords)
        }
      }
    } catch (error) {
      console.error("Error geocoding location:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCurrentLocation = async () => {
    setIsLoading(true)
    try {
      const position = await getCurrentPosition()
      setCoordinates(position)
      
      // Essayer de faire un reverse geocoding pour obtenir le nom de la localisation
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.latitude}&lon=${position.longitude}&zoom=18&addressdetails=1`
      )
      
      if (response.ok) {
        const data = await response.json()
        const locationName = data.display_name || "Position actuelle"
        onChange(locationName, position)
      } else {
        onChange("Position actuelle", position)
      }
    } catch (error) {
      console.error("Error getting current location:", error)
      alert("Impossible d'obtenir votre position actuelle. Vérifiez que la géolocalisation est activée.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCitySelect = (cityName: string) => {
    const cityCoords = SENEGAL_CITIES[cityName as keyof typeof SENEGAL_CITIES]
    if (cityCoords) {
      setCoordinates(cityCoords)
      onChange(cityName, cityCoords)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location" className="text-[#F5F5DC]">
          {label} {required && <span className="text-[#C1440E]">*</span>}
        </Label>
        
        <div className="flex gap-2">
          <Input
            id="location"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLocationSearch}
            disabled={isLoading || !value.trim()}
            className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCurrentLocation}
            disabled={isLoading}
            className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sélection rapide des villes du Sénégal */}
      <div className="space-y-2">
        <Label className="text-sm text-[#F5F5DC]/80">
          Ou sélectionnez une ville du Sénégal
        </Label>
        <Select onValueChange={handleCitySelect}>
          <SelectTrigger className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]">
            <SelectValue placeholder="Choisir une ville" />
          </SelectTrigger>
          <SelectContent className="bg-[#0B1623] border border-[#D4AF37]/30">
            {Object.keys(SENEGAL_CITIES).map((cityName) => (
              <SelectItem key={cityName} value={cityName} className="text-[#F5F5DC] hover:bg-[#006633]/20">
                {cityName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Affichage des coordonnées */}
      {coordinates && (
        <Card className="bg-gradient-to-br from-[#0B1623] to-[#1A2332] border border-[#D4AF37]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-[#D4AF37]">
              <MapPin className="h-4 w-4" />
              Coordonnées GPS
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm text-[#F5F5DC]/80">
              <p>Latitude: {coordinates.latitude.toFixed(6)}</p>
              <p>Longitude: {coordinates.longitude.toFixed(6)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-[#F5F5DC]/80">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D4AF37]"></div>
          Recherche de la localisation...
        </div>
      )}
    </div>
  )
}
