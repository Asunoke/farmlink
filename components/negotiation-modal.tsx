"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface NegotiationModalProps {
  offerId?: string
  demandId?: string
  offerTitle?: string
  demandTitle?: string
  currentPrice?: number
  currentQuantity?: number
  unit?: string
  children: React.ReactNode
}

export function NegotiationModal({
  offerId,
  demandId,
  offerTitle,
  demandTitle,
  currentPrice = 0,
  currentQuantity = 0,
  unit = "",
  children
}: NegotiationModalProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    price: currentPrice.toString(),
    quantity: currentQuantity.toString(),
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/marketplace/negotiations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerId,
          demandId,
          price: parseFloat(formData.price) || 0,
          quantity: parseFloat(formData.quantity) || 0,
          message: formData.message
        })
      })

      if (response.ok) {
        const negotiation = await response.json()
        setIsOpen(false)
        router.push(`/marketplace/negotiation/${negotiation.id}`)
      } else {
        const error = await response.json()
        alert(error.error || "Erreur lors de la création de la négociation")
      }
    } catch (error) {
      console.error("Error creating negotiation:", error)
      alert("Erreur lors de la création de la négociation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!session) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connexion requise</DialogTitle>
            <DialogDescription>
              Vous devez être connecté pour négocier.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/auth/signin")} className="flex-1">
              Se connecter
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-[#0B1623] border border-[#D4AF37]/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#D4AF37]">
            <MessageSquare className="h-5 w-5" />
            Démarrer une négociation
          </DialogTitle>
          <DialogDescription className="text-[#F5F5DC]/80">
            {offerId ? `Négocier pour: ${offerTitle}` : `Proposer pour: ${demandTitle}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-[#F5F5DC]">Prix (fcfa)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0"
                className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]"
              />
            </div>
            <div>
              <Label htmlFor="quantity" className="text-[#F5F5DC]">Quantité ({unit})</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="0"
                className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message" className="text-[#F5F5DC]">Message (optionnel)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Ajoutez un message pour expliquer votre proposition..."
              rows={3}
              className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#006633] hover:bg-[#C1440E] text-white"
            >
              {isSubmitting ? (
                "Envoi..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Démarrer la négociation
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
