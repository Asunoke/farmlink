"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Search, Handshake } from "lucide-react"

interface MarketplaceStepProps {
  onNext: () => void
  onSkip: () => void
  isLoading: boolean
}

const marketplaceCategories = [
  { value: "CROPS", label: "Cultures", icon: "🌾" },
  { value: "SEEDS", label: "Graines", icon: "🌱" },
  { value: "FERTILIZER", label: "Engrais", icon: "🌿" },
  { value: "EQUIPMENT", label: "Équipement", icon: "🔧" },
  { value: "LIVESTOCK", label: "Bétail", icon: "🐄" },
  { value: "SERVICES", label: "Services", icon: "🛠️" },
  { value: "OTHER", label: "Autres", icon: "📦" }
]

export function MarketplaceStep({ onNext, onSkip, isLoading }: MarketplaceStepProps) {
  const [listingType, setListingType] = useState<"offer" | "demand">("offer")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    unit: "",
    location: ""
  })

  const [currentSubStep, setCurrentSubStep] = useState<"type" | "details">("type")

  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(resolve => setTimeout(resolve, 500))
    setCurrentSubStep("details")
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(resolve => setTimeout(resolve, 1000))
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#006633]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="h-8 w-8 text-[#006633]" />
        </div>
        <h3 className="text-lg font-semibold text-[#0D1B2A] mb-2">
          Explorez le marché agricole
        </h3>
        <p className="text-[#0D1B2A]/70 text-sm">
          Créez vos premières offres ou demandes pour échanger avec d'autres agriculteurs
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className={`flex items-center space-x-2 ${currentSubStep === "type" ? "text-[#006633]" : "text-green-600"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentSubStep === "type" ? "bg-[#006633] text-white" : "bg-green-100 text-green-600"
          }`}>
            1
          </div>
          <span className="text-sm font-medium">Type d'annonce</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${currentSubStep === "details" ? "text-[#006633]" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentSubStep === "details" ? "bg-[#006633] text-white" : "bg-gray-100 text-gray-400"
          }`}>
            2
          </div>
          <span className="text-sm font-medium">Détails</span>
        </div>
      </div>

      {currentSubStep === "type" ? (
        <form onSubmit={handleTypeSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-[#0D1B2A] mb-2">
              Que souhaitez-vous faire ?
            </h4>
            <p className="text-[#0D1B2A]/70 text-sm">
              Choisissez le type d'annonce que vous voulez créer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all ${
                listingType === "offer" 
                  ? "border-[#006633] bg-[#006633]/5" 
                  : "border-[#D4AF37]/30 hover:border-[#006633]/50"
              }`}
              onClick={() => setListingType("offer")}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#006633]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 text-[#006633]" />
                </div>
                <h3 className="font-semibold text-[#0D1B2A] mb-2">Créer une offre</h3>
                <p className="text-sm text-[#0D1B2A]/70">
                  Vendez vos produits agricoles, équipements ou services
                </p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all ${
                listingType === "demand" 
                  ? "border-[#006633] bg-[#006633]/5" 
                  : "border-[#D4AF37]/30 hover:border-[#006633]/50"
              }`}
              onClick={() => setListingType("demand")}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#006633]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-[#006633]" />
                </div>
                <h3 className="font-semibold text-[#0D1B2A] mb-2">Créer une demande</h3>
                <p className="text-sm text-[#0D1B2A]/70">
                  Recherchez des produits ou services spécifiques
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#F5F5DC] border-[#D4AF37]/30">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#006633]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Handshake className="h-4 w-4 text-[#006633]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#0D1B2A] mb-1">
                    💡 Conseil
                  </h4>
                  <p className="text-sm text-[#0D1B2A]/70">
                    Le marché FarmLink vous permet d'échanger avec d'autres agriculteurs maliens. 
                    Vous pouvez vendre vos surplus ou acheter ce dont vous avez besoin.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
            >
              Passer cette étape
            </Button>
            <Button
              type="submit"
              className="bg-[#006633] hover:bg-[#C1440E] text-white"
            >
              Continuer
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#0D1B2A] font-medium">
              Titre de l'annonce *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={listingType === "offer" ? "Ex: Vente de riz de qualité" : "Ex: Recherche semences de mil"}
              className="border-[#D4AF37]/30 focus:border-[#006633]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#0D1B2A] font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez votre produit ou votre besoin en détail..."
              className="border-[#D4AF37]/30 focus:border-[#006633]"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[#0D1B2A] font-medium">
                Catégorie *
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="border-[#D4AF37]/30 focus:border-[#006633]">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {marketplaceCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-[#0D1B2A] font-medium">
                Localisation *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: Bamako, Mali"
                className="border-[#D4AF37]/30 focus:border-[#006633]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-[#0D1B2A] font-medium">
                {listingType === "offer" ? "Prix (FCFA)" : "Prix max (FCFA)"} *
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Ex: 50000"
                className="border-[#D4AF37]/30 focus:border-[#006633]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-[#0D1B2A] font-medium">
                Quantité *
              </Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Ex: 100"
                className="border-[#D4AF37]/30 focus:border-[#006633]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="text-[#0D1B2A] font-medium">
                Unité *
              </Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="Ex: kg, sacs, tonnes"
                className="border-[#D4AF37]/30 focus:border-[#006633]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentSubStep("type")}
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
            >
              Retour
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title || !formData.description || !formData.category}
              className="bg-[#006633] hover:bg-[#C1440E] text-white"
            >
              {isLoading ? "Création..." : "Créer l'annonce"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
