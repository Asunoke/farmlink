"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { User, MapPin, Phone, Mail, Calendar } from "lucide-react"

interface ProfileStepProps {
  onNext: () => void
  onSkip: () => void
  isLoading: boolean
}

export function ProfileStep({ onNext, onSkip, isLoading }: ProfileStepProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
    experience: "",
    specialties: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(resolve => setTimeout(resolve, 1000))
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#006633]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-[#006633]" />
        </div>
        <h3 className="text-lg font-semibold text-[#0D1B2A] mb-2">
          Complétez votre profil
        </h3>
        <p className="text-[#0D1B2A]/70 text-sm">
          Finalisez vos informations pour une meilleure expérience sur FarmLink
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#0D1B2A] font-medium">
            Nom complet *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Amadou Traoré"
            className="border-[#D4AF37]/30 focus:border-[#006633]"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#0D1B2A] font-medium">
              Téléphone
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-[#0D1B2A]/50" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Ex: +223 70 12 34 56"
                className="pl-10 border-[#D4AF37]/30 focus:border-[#006633]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#0D1B2A] font-medium">
              Localisation
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#0D1B2A]/50" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: Bamako, Mali"
                className="pl-10 border-[#D4AF37]/30 focus:border-[#006633]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-[#0D1B2A] font-medium">
            À propos de vous
          </Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Parlez-nous de votre expérience agricole, vos objectifs, etc..."
            className="border-[#D4AF37]/30 focus:border-[#006633]"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-[#0D1B2A] font-medium">
              Années d'expérience
            </Label>
            <Input
              id="experience"
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="Ex: 5"
              className="border-[#D4AF37]/30 focus:border-[#006633]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialties" className="text-[#0D1B2A] font-medium">
              Spécialités
            </Label>
            <Input
              id="specialties"
              value={formData.specialties}
              onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
              placeholder="Ex: Riz, Maraîchage, Élevage"
              className="border-[#D4AF37]/30 focus:border-[#006633]"
            />
          </div>
        </div>

        <Card className="bg-[#F5F5DC] border-[#D4AF37]/30">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#006633]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-[#006633]" />
              </div>
              <div>
                <h4 className="font-medium text-[#0D1B2A] mb-1">
                  💡 Pourquoi compléter votre profil ?
                </h4>
                <ul className="text-sm text-[#0D1B2A]/70 space-y-1">
                  <li>• Améliorez votre visibilité sur le marché</li>
                  <li>• Trouvez des partenaires agricoles</li>
                  <li>• Recevez des conseils personnalisés</li>
                  <li>• Accédez à des fonctionnalités avancées</li>
                </ul>
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
            disabled={isLoading || !formData.name}
            className="bg-[#006633] hover:bg-[#C1440E] text-white"
          >
            {isLoading ? "Sauvegarde..." : "Sauvegarder le profil"}
          </Button>
        </div>
      </form>
    </div>
  )
}
