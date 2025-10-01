"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Package, ShoppingCart } from "lucide-react"
import { calculateDistance, LocationCoordinates } from "@/lib/geolocation"

interface MarketplaceItem {
  id: string
  title: string
  price: number
  quantity: number
  unit: string
  location: string
  latitude?: number
  longitude?: number
  type: "offer" | "demand"
  user: { name: string }
}

interface MarketplaceMapProps {
  items: MarketplaceItem[]
  userLocation?: LocationCoordinates
  onItemClick?: (item: MarketplaceItem) => void
}

export function MarketplaceMap({ items, userLocation, onItemClick }: MarketplaceMapProps) {
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>(items)
  const [maxDistance, setMaxDistance] = useState(50) // km
  const [selectedType, setSelectedType] = useState<"all" | "offer" | "demand">("all")

  useEffect(() => {
    let filtered = items

    // Filtrer par type
    if (selectedType !== "all") {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    // Filtrer par distance si l'utilisateur a partagé sa localisation
    if (userLocation) {
      filtered = filtered.filter(item => {
        if (!item.latitude || !item.longitude) return false
        
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          item.latitude,
          item.longitude
        )
        
        return distance <= maxDistance
      })

      // Trier par distance
      filtered.sort((a, b) => {
        if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0
        
        const distanceA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.latitude,
          a.longitude
        )
        
        const distanceB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.latitude,
          b.longitude
        )
        
        return distanceA - distanceB
      })
    }

    setFilteredItems(filtered)
  }, [items, userLocation, maxDistance, selectedType])

  const getDistance = (item: MarketplaceItem) => {
    if (!userLocation || !item.latitude || !item.longitude) return null
    
    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      item.latitude,
      item.longitude
    )
  }

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Type</label>
              <div className="flex gap-2">
                <Button
                  variant={selectedType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType("all")}
                >
                  Tous
                </Button>
                <Button
                  variant={selectedType === "offer" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType("offer")}
                >
                  <Package className="h-4 w-4 mr-1" />
                  Offres
                </Button>
                <Button
                  variant={selectedType === "demand" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType("demand")}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Demandes
                </Button>
              </div>
            </div>
            
            {userLocation && (
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  Distance max: {maxDistance} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liste des items */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucun élément trouvé dans cette zone
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => {
            const distance = getDistance(item)
            
            return (
              <Card 
                key={item.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onItemClick?.(item)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.type === "offer" ? (
                          <Package className="h-4 w-4 text-blue-600" />
                        ) : (
                          <ShoppingCart className="h-4 w-4 text-green-600" />
                        )}
                        <h3 className="font-medium">{item.title}</h3>
                        <Badge variant={item.type === "offer" ? "default" : "secondary"}>
                          {item.type === "offer" ? "Offre" : "Demande"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </div>
                        {distance && (
                          <div className="flex items-center gap-1">
                            <Navigation className="h-3 w-3" />
                            {distance} km
                          </div>
                        )}
                        <div>
                          {item.price.toLocaleString()} fcfa / {item.quantity} {item.unit}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mt-1">
                        Par {item.user.name}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Statistiques */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {filteredItems.length} élément(s) trouvé(s)
            </span>
            {userLocation && (
              <span className="text-muted-foreground">
                Dans un rayon de {maxDistance} km
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
