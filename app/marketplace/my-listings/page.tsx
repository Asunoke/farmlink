"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, MessageSquare, MapPin, Calendar, DollarSign, Package, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Offer {
  id: string
  title: string
  description: string
  category: string
  price: number
  quantity: number
  unit: string
  location: string
  status: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
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
  status: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  negotiations: { id: string }[]
}

const categories = [
  { value: "CROPS", label: "Récoltes" },
  { value: "SEEDS", label: "Graines" },
  { value: "FERTILIZER", label: "Engrais" },
  { value: "EQUIPMENT", label: "Équipement" },
  { value: "LIVESTOCK", label: "Bétail" },
  { value: "SERVICES", label: "Services" },
  { value: "OTHER", label: "Autre" },
]

export default function MyListingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [demands, setDemands] = useState<Demand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les données
  useEffect(() => {
    if (session?.user) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Récupérer les offres et demandes de l'utilisateur
      const [offersResponse, demandsResponse] = await Promise.all([
        fetch("/api/marketplace/offers"),
        fetch("/api/marketplace/demands")
      ])

      if (!offersResponse.ok || !demandsResponse.ok) {
        throw new Error("Erreur lors du chargement des données")
      }

      const offersData = await offersResponse.json()
      const demandsData = await demandsResponse.json()

      // Filtrer pour ne garder que celles de l'utilisateur connecté
      const userOffers = offersData.offers?.filter((offer: Offer) => 
        offer.user.id === (session?.user as any)?.id
      ) || []
      
      const userDemands = demandsData.demands?.filter((demand: Demand) => 
        demand.user.id === (session?.user as any)?.id
      ) || []

      setOffers(userOffers)
      setDemands(userDemands)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) return

    try {
      const response = await fetch(`/api/marketplace/offers/${offerId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setOffers(prev => prev.filter(offer => offer.id !== offerId))
      } else {
        const error = await response.json()
        alert(error.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting offer:", error)
      alert("Erreur lors de la suppression")
    }
  }

  const handleDeleteDemand = async (demandId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) return

    try {
      const response = await fetch(`/api/marketplace/demands/${demandId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setDemands(prev => prev.filter(demand => demand.id !== demandId))
      } else {
        const error = await response.json()
        alert(error.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting demand:", error)
      alert("Erreur lors de la suppression")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="default">Actif</Badge>
      case "SOLD":
        return <Badge variant="secondary">Vendu</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Annulé</Badge>
      case "EXPIRED":
        return <Badge variant="outline">Expiré</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour voir vos annonces.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Link href="/auth/signin" className="flex-1">
                <Button className="w-full">Se connecter</Button>
              </Link>
              <Link href="/marketplace" className="flex-1">
                <Button variant="outline" className="w-full">Retour</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de vos annonces...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchData} className="w-full">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
            <Link href="/marketplace">
              <Button variant="outline">Retour au marché</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Mes annonces</h1>
            <p className="text-muted-foreground">
              Gérez vos offres et demandes sur le marché agricole
            </p>
          </div>

          <Tabs defaultValue="offers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="offers">
                Mes offres ({offers.length})
              </TabsTrigger>
              <TabsTrigger value="demands">
                Mes demandes ({demands.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="offers" className="mt-6">
              {offers.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune offre</h3>
                    <p className="text-muted-foreground mb-4">
                      Vous n'avez pas encore créé d'offres.
                    </p>
                    <Link href="/marketplace/offers/create">
                      <Button>
                        <Package className="h-4 w-4 mr-2" />
                        Créer une offre
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {offers.map((offer) => (
                  <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{offer.title}</CardTitle>
                            {getStatusBadge(offer.status)}
                          </div>
                          <CardDescription className="mb-2">{offer.description}</CardDescription>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              {getCategoryLabel(offer.category)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {offer.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(offer.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {offer.negotiations.length} négociation(s)
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/marketplace/negotiation/${offer.negotiations[0]?.id ?? ""}`}>
                                <div className="flex items-center">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir
                                </div>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/marketplace/offers/create?edit=${offer.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteOffer(offer.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-2xl font-bold text-primary">
                            {offer.price.toLocaleString()} fcfa
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / {offer.quantity} {offer.unit}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {offer.negotiations[0] && (
                            <Link href={`/marketplace/negotiation/${offer.negotiations[0].id}`}>
                              <Button size="sm" variant="outline">Voir les négociations</Button>
                            </Link>
                          )}
                          <Button size="sm" onClick={() => router.push(`/marketplace/offers/create?edit=${offer.id}`)}>Modifier</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteOffer(offer.id)}>Supprimer</Button>
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
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune demande</h3>
                    <p className="text-muted-foreground mb-4">
                      Vous n'avez pas encore créé de demandes.
                    </p>
                    <Link href="/marketplace/demands/create">
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Créer une demande
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {demands.map((demand) => (
                  <Card key={demand.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{demand.title}</CardTitle>
                            {getStatusBadge(demand.status)}
                          </div>
                          <CardDescription className="mb-2">{demand.description}</CardDescription>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              {getCategoryLabel(demand.category)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {demand.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(demand.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {demand.negotiations.length} proposition(s)
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/marketplace/negotiation/${demand.negotiations[0]?.id ?? ""}`}>
                                <div className="flex items-center">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir
                                </div>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/marketplace/demands/create?edit=${demand.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteDemand(demand.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-2xl font-bold text-primary">
                            Max: {demand.maxPrice.toLocaleString()} fcfa
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / {demand.quantity} {demand.unit}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {demand.negotiations[0] && (
                            <Link href={`/marketplace/negotiation/${demand.negotiations[0].id}`}>
                              <Button size="sm" variant="outline">Voir les propositions</Button>
                            </Link>
                          )}
                          <Button size="sm" onClick={() => router.push(`/marketplace/demands/create?edit=${demand.id}`)}>Modifier</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteDemand(demand.id)}>Supprimer</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Link href="/marketplace/offers/create">
              <Button className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Créer une offre
              </Button>
            </Link>
            <Link href="/marketplace/demands/create">
              <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Créer une demande
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
