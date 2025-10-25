"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Crop, Calendar, FileText } from "lucide-react"

interface FarmStepProps {
  onNext: () => void
  onSkip: () => void
  isLoading: boolean
}

export function FarmStep({ onNext, onSkip, isLoading }: FarmStepProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    area: "",
    crop: "",
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Ici on pourrait appeler l'API pour créer la ferme
    // Pour l'instant, on simule juste la création
    await new Promise(resolve => setTimeout(resolve, 1000))
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#006633]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crop className="h-8 w-8 text-[#006633]" />
        </div>
        <h3 className="text-lg font-semibold text-[#0D1B2A] mb-2">
          Créons votre première ferme
        </h3>
        <p className="text-[#0D1B2A]/70 text-sm">
          Commencez par ajouter les informations de base de votre exploitation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#0D1B2A] font-medium">
              Nom de la ferme *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Ferme de Sotuba"
              className="border-[#D4AF37]/30 focus:border-[#006633]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#0D1B2A] font-medium">
              Localisation *
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#0D1B2A]/50" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: Bamako, Mali"
                className="pl-10 border-[#D4AF37]/30 focus:border-[#006633]"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="area" className="text-[#0D1B2A] font-medium">
              Superficie (hectares) *
            </Label>
            <Input
              id="area"
              type="number"
              value={formData.area}
              onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
              placeholder="Ex: 5.5"
              className="border-[#D4AF37]/30 focus:border-[#006633]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crop" className="text-[#0D1B2A] font-medium">
              Culture principale
            </Label>
            <Input
              id="crop"
              value={formData.crop}
              onChange={(e) => setFormData(prev => ({ ...prev, crop: e.target.value }))}
              placeholder="Ex: Riz, Mil, Sorgho"
              className="border-[#D4AF37]/30 focus:border-[#006633]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-[#0D1B2A] font-medium">
            Notes supplémentaires
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Ajoutez des informations utiles sur votre ferme..."
            className="border-[#D4AF37]/30 focus:border-[#006633]"
            rows={3}
          />
        </div>

        <Card className="bg-[#F5F5DC] border-[#D4AF37]/30">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#006633]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-[#006633]" />
              </div>
              <div>
                <h4 className="font-medium text-[#0D1B2A] mb-1">
                  💡 Conseil
                </h4>
                <p className="text-sm text-[#0D1B2A]/70">
                  Vous pourrez ajouter des parcelles et des cultures spécifiques après avoir créé votre ferme.
                  Commencez par les informations générales.
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
            disabled={isLoading || !formData.name || !formData.location || !formData.area}
            className="bg-[#006633] hover:bg-[#C1440E] text-white"
          >
            {isLoading ? "Création..." : "Créer ma ferme"}
          </Button>
        </div>
      </form>
    </div>
  )
}
