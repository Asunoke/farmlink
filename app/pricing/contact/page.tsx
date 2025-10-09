"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, MessageCircle, Phone, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')
  
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    company: '',
    message: '',
    phone: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Ici tu peux ajouter la logique pour envoyer l'email ou sauvegarder la demande
    console.log('Demande de contact:', formData)
    
    // Simuler l'envoi
    setIsSubmitted(true)
  }

  const openWhatsApp = () => {
    const message = `Bonjour, je suis intéressé par le plan ENTREPRISE de FarmLink. Pouvez-vous me contacter pour discuter des détails ?`
    const whatsappUrl = `https://wa.me/22385239219?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/pricing" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Retour aux plans</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h1 className="text-3xl font-bold mb-4">Demande envoyée !</h1>
            <p className="text-muted-foreground mb-8">
              Merci pour votre intérêt pour le plan ENTREPRISE. 
              Notre équipe vous contactera dans les plus brefs délais.
            </p>
            <div className="space-y-4">
              <Link href="/dashboard">
                <Button size="lg">Retour au tableau de bord</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/pricing" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour aux plans</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline">Tableau de Bord</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Plan Entreprise</h1>
          <p className="text-xl text-muted-foreground">
            Solution sur mesure pour votre exploitation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulaire de contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Demande de devis
              </CardTitle>
              <CardDescription>
                Remplissez ce formulaire pour recevoir un devis personnalisé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nom complet</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Entreprise</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Nom de votre exploitation"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Téléphone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+223 XX XX XX XX"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Décrivez vos besoins spécifiques..."
                    rows={4}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Envoyer la demande
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact direct */}
          <Card>
            <CardHeader>
              <CardTitle>Contact direct</CardTitle>
              <CardDescription>
                Contactez-nous directement pour discuter de vos besoins
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>Prix minimum :</strong> 75,000 fcfa/mois
                  <br />
                  <strong>Devis personnalisé :</strong> Selon vos besoins spécifiques
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-sm text-muted-foreground">+223 85 23 92 19</div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={openWhatsApp}
                    className="ml-auto"
                  >
                    Ouvrir WhatsApp
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Téléphone</div>
                    <div className="text-sm text-muted-foreground">+223 85 23 92 19</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">support@farmlink.ml</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Fonctionnalités incluses :</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Gestion illimitée de fermes et parcelles</li>
                  <li>• Équipe illimitée</li>
                  <li>• API complète</li>
                  <li>• Support prioritaire 24/7</li>
                  <li>• Formation personnalisée</li>
                  <li>• Intégrations sur mesure</li>
                  <li>• Rapports avancés</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
