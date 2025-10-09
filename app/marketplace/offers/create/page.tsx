"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"

const categories = [
  { value: "CROPS", label: "Récoltes" },
  { value: "SEEDS", label: "Graines" },
  { value: "FERTILIZER", label: "Engrais" },
  { value: "EQUIPMENT", label: "Équipement" },
  { value: "LIVESTOCK", label: "Bétail" },
  { value: "SERVICES", label: "Services" },
  { value: "OTHER", label: "Autre" },
]

const units = [
  { value: "kg", label: "Kilogramme" },
  { value: "tonne", label: "Tonne" },
  { value: "unité", label: "Unité" },
  { value: "sac", label: "Sac" },
  { value: "hectare", label: "Hectare" },
  { value: "mètre", label: "Mètre" },
  { value: "litre", label: "Litre" },
]

export default function CreateOfferPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    unit: "",
    location: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/marketplace/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const offer = await response.json()
        router.push("/marketplace")
      } else {
        const error = await response.json()
        alert(error.error || "Erreur lors de la création de l'offre")
      }
    } catch (error) {
      console.error("Error creating offer:", error)
      alert("Erreur lors de la création de l'offre")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <MainNav />
        <Card className="w-full max-w-md bg-[#0B1623] border border-[#D4AF37]/20">
          <CardHeader>
            <CardTitle className="text-[#D4AF37]">Connexion requise</CardTitle>
            <CardDescription className="text-[#F5F5DC]/70">
              Vous devez être connecté pour créer une offre.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Link href="/auth/signin" className="flex-1">
                <Button className="w-full bg-[#006633] hover:bg-[#C1440E] text-white">Se connecter</Button>
              </Link>
              <Link href="/marketplace" className="flex-1">
                <Button variant="outline" className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">Retour</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-[#006633]/10">
                <Package className="h-8 w-8 text-[#006633]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#D4AF37]">Créer une offre</h1>
            <p className="text-[#F5F5DC]/70">
              Publiez votre produit ou service sur le marché agricole
            </p>
          </div>

          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-[#D4AF37]">Détails de l'offre</CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">
                Remplissez les informations sur votre produit ou service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Tomates fraîches biologiques"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre produit en détail..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation *</Label>
                    <Input
                      id="location"
                      placeholder="Ex: Dakar, Thiès..."
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (fcfa) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="500"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantité *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="100"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unité *</Label>
                    <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unité" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#006633] hover:bg-[#C1440E] text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Création..." : "Créer l'offre"}
                  </Button>
                  <Link href="/marketplace" className="flex-1">
                    <Button type="button" variant="outline" className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
                      Annuler
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
