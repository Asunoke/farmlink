"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, ShoppingCart, Package, MessageSquare, MapPin, Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NegotiationModal } from "@/components/negotiation-modal"

const categories = [
  { value: "CROPS", label: "Récoltes" },
  { value: "SEEDS", label: "Graines" },
  { value: "FERTILIZER", label: "Engrais" },
  { value: "EQUIPMENT", label: "Équipement" },
  { value: "LIVESTOCK", label: "Bétail" },
  { value: "SERVICES", label: "Services" },
  { value: "OTHER", label: "Autre" },
]

interface Offer {
  id: string
  title: string
  description: string
  category: string
  price: number
  quantity: number
  unit: string
  location: string
  latitude?: number
  longitude?: number
  status: string
  user: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  negotiations: { id: string }[]
}

interface Demand {
  id: string
  title: string
  description: string
  category: string
  maxPrice: number
  quantity: number
  unit: string
  location: string
  latitude?: number
  longitude?: number
  status: string
  user: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  negotiations: { id: string }[]
}

export default function MarketplacePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [offers, setOffers] = useState<Offer[]>([])
  const [demands, setDemands] = useState<Demand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les données
  useEffect(() => {
    fetchData()
  }, [searchTerm, selectedCategory])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory !== "all") params.append("category", selectedCategory)

      const [offersResponse, demandsResponse] = await Promise.all([
        fetch(`/api/marketplace/offers?${params}`),
        fetch(`/api/marketplace/demands?${params}`)
      ])

      if (!offersResponse.ok || !demandsResponse.ok) {
        throw new Error("Erreur lors du chargement des données")
      }

      const offersData = await offersResponse.json()
      const demandsData = await demandsResponse.json()

      setOffers(offersData.offers || [])
      setDemands(demandsData.demands || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  // Les fonctions handleNegotiate et handlePropose sont maintenant gérées par NegotiationModal

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">FL</span>
              </div>
              <span className="text-xl font-bold">FarmLink</span>
            </Link>
            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/dashboard">
                  <Button>Tableau de Bord</Button>
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link href="/auth/signin">
                    <Button variant="outline">Se connecter</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button>S'inscrire</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-balance mb-4">Marché Agricole</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connectez-vous avec d'autres agriculteurs pour acheter, vendre et négocier vos produits agricoles.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des offres ou demandes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Link href="/marketplace/offers/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Créer une offre
            </Button>
          </Link>
          <Link href="/marketplace/demands/create">
            <Button variant="outline" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Créer une demande
            </Button>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-4">
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchData}
                className="mt-2"
              >
                Réessayer
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des annonces...</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        {!isLoading && !error && (
          <Tabs defaultValue="offers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="offers" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Offres ({offers.length})
              </TabsTrigger>
              <TabsTrigger value="demands" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Demandes ({demands.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="offers" className="mt-6">
              {offers.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune offre trouvée</h3>
                    <p className="text-muted-foreground mb-4">
                      Il n'y a actuellement aucune offre correspondant à vos critères.
                    </p>
                    <Link href="/marketplace/offers/create">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Créer la première offre
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offers.map((offer) => (
                <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{offer.title}</CardTitle>
                        <CardDescription className="mt-1">{offer.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {categories.find((c) => c.value === offer.category)?.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">
                          {offer.price.toLocaleString()} fcfa
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {offer.quantity} {offer.unit}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {offer.location}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(offer.createdAt).toLocaleDateString()}
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Vendeur: </span>
                        <span className="font-medium">{offer.user.name}</span>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <NegotiationModal
                          offerId={offer.id}
                          offerTitle={offer.title}
                          currentPrice={offer.price}
                          currentQuantity={offer.quantity}
                          unit={offer.unit}
                        >
                          <Button size="sm" className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Négocier
                          </Button>
                        </NegotiationModal>
                        <Button size="sm" variant="outline">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="demands" className="mt-6">
              {demands.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune demande trouvée</h3>
                    <p className="text-muted-foreground mb-4">
                      Il n'y a actuellement aucune demande correspondant à vos critères.
                    </p>
                    <Link href="/marketplace/demands/create">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Créer la première demande
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {demands.map((demand) => (
                <Card key={demand.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{demand.title}</CardTitle>
                        <CardDescription className="mt-1">{demand.description}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        {categories.find((c) => c.value === demand.category)?.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">
                          Max: {demand.maxPrice.toLocaleString()} fcfa
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {demand.quantity} {demand.unit}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {demand.location}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(demand.createdAt).toLocaleDateString()}
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Acheteur: </span>
                        <span className="font-medium">{demand.user.name}</span>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <NegotiationModal
                          demandId={demand.id}
                          demandTitle={demand.title}
                          currentPrice={demand.maxPrice}
                          currentQuantity={demand.quantity}
                          unit={demand.unit}
                        >
                          <Button size="sm" className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Proposer
                          </Button>
                        </NegotiationModal>
                        <Button size="sm" variant="outline">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
