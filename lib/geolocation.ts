// Service de géolocalisation pour le marketplace

export interface LocationCoordinates {
  latitude: number
  longitude: number
}

export interface LocationInfo {
  name: string
  coordinates: LocationCoordinates
  address?: string
}

// Calculer la distance entre deux points en kilomètres (formule de Haversine)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Rayon de la Terre en kilomètres
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return Math.round(distance * 100) / 100 // Arrondir à 2 décimales
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Obtenir la position actuelle de l'utilisateur
export function getCurrentPosition(): Promise<LocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("La géolocalisation n'est pas supportée par ce navigateur"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

// Géocoder une adresse (utilise l'API de géocodage)
export async function geocodeAddress(address: string): Promise<LocationInfo | null> {
  try {
    // Utiliser l'API de géocodage (ici on utilise une API gratuite)
    // En production, vous pourriez utiliser Google Maps API, OpenStreetMap, etc.
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    )
    
    if (!response.ok) {
      throw new Error("Erreur lors du géocodage")
    }
    
    const data = await response.json()
    
    if (data.length === 0) {
      return null
    }
    
    const result = data[0]
    
    return {
      name: result.display_name,
      coordinates: {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon)
      },
      address: result.display_name
    }
  } catch (error) {
    console.error("Error geocoding address:", error)
    return null
  }
}

// Géocoder des coordonnées (reverse geocoding)
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<LocationInfo | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    )
    
    if (!response.ok) {
      throw new Error("Erreur lors du géocodage inverse")
    }
    
    const data = await response.json()
    
    if (!data.display_name) {
      return null
    }
    
    return {
      name: data.display_name,
      coordinates: {
        latitude,
        longitude
      },
      address: data.display_name
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error)
    return null
  }
}

// Filtrer les offres/demandes par distance
export function filterByDistance<T extends { latitude?: number; longitude?: number }>(
  items: T[],
  userLat: number,
  userLon: number,
  maxDistanceKm: number
): T[] {
  return items.filter(item => {
    if (!item.latitude || !item.longitude) {
      return false // Exclure les items sans coordonnées
    }
    
    const distance = calculateDistance(
      userLat,
      userLon,
      item.latitude,
      item.longitude
    )
    
    return distance <= maxDistanceKm
  })
}

// Trier les offres/demandes par distance
export function sortByDistance<T extends { latitude?: number; longitude?: number }>(
  items: T[],
  userLat: number,
  userLon: number
): T[] {
  return items
    .map(item => ({
      ...item,
      distance: item.latitude && item.longitude 
        ? calculateDistance(userLat, userLon, item.latitude, item.longitude)
        : Infinity
    }))
    .sort((a, b) => a.distance - b.distance)
    .map(({ distance, ...item }) => item as unknown as T)
}

// Villes principales du Sénégal avec leurs coordonnées
export const SENEGAL_CITIES = {
  "Dakar": { latitude: 14.6928, longitude: -17.4467 },
  "Thiès": { latitude: 14.7894, longitude: -16.9260 },
  "Kaolack": { latitude: 14.1519, longitude: -16.0726 },
  "Saint-Louis": { latitude: 16.0179, longitude: -16.4896 },
  "Ziguinchor": { latitude: 12.5831, longitude: -16.2719 },
  "Diourbel": { latitude: 14.6550, longitude: -16.2314 },
  "Tambacounda": { latitude: 13.7539, longitude: -13.7586 },
  "Mbour": { latitude: 14.4167, longitude: -16.9667 },
  "Rufisque": { latitude: 14.7167, longitude: -17.2667 },
  "Kolda": { latitude: 12.8833, longitude: -14.9500 }
} as const

// Obtenir les coordonnées d'une ville sénégalaise
export function getSenegalCityCoordinates(cityName: string): LocationCoordinates | null {
  const city = SENEGAL_CITIES[cityName as keyof typeof SENEGAL_CITIES]
  return city || null
}
