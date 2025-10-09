"use client"

import { useState, useEffect } from "react"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  CreditCard, 
  Settings,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  subscription: string
  createdAt: string
  subscriptionExpiresAt?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editData, setEditData] = useState({
    name: "",
    email: ""
  })
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setEditData({
          name: data.name,
          email: data.email
        })
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error)
    }
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        setSuccess("Profil mis à jour avec succès")
        fetchProfile()
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      setError("Erreur lors de la mise à jour")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      })

      if (response.ok) {
        setSuccess("Mot de passe modifié avec succès")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors du changement de mot de passe")
      }
    } catch (error) {
      setError("Erreur lors du changement de mot de passe")
    } finally {
      setLoading(false)
    }
  }

  const getSubscriptionBadge = (subscription: string) => {
    const variants = {
      FREE: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
      BASIC: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      BUSINESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      ENTERPRISE: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
    }
    return variants[subscription as keyof typeof variants] || variants.FREE
  }

  const getSubscriptionName = (subscription: string) => {
    const names = {
      FREE: "Gratuit",
      BASIC: "Basique",
      BUSINESS: "Business",
      ENTERPRISE: "Entreprise"
    }
    return names[subscription as keyof typeof names] || "Inconnu"
  }

  const getSubscriptionPrice = (subscription: string) => {
    const prices = {
      FREE: "0 FCFA",
      BASIC: "15,000 FCFA/mois",
      BUSINESS: "35,000 FCFA/mois",
      ENTERPRISE: "75,000 FCFA/mois"
    }
    return prices[subscription as keyof typeof prices] || "N/A"
  }

  const isSubscriptionExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const getDaysUntilExpiry = (expiresAt?: string) => {
    if (!expiresAt) return null
    const expiry = new Date(expiresAt)
    const now = new Date()
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  const daysUntilExpiry = getDaysUntilExpiry(profile.subscriptionExpiresAt)
  const isExpired = isSubscriptionExpired(profile.subscriptionExpiresAt)

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#006633]/20 rounded-xl">
              <User className="h-6 w-6 text-[#006633]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#D4AF37]">
                Mon profil
              </h1>
              <p className="text-[#F5F5DC]/70">
                Gérez vos informations personnelles et votre abonnement
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-[#C1440E] bg-[#C1440E]/10">
            <AlertCircle className="h-4 w-4 text-[#C1440E]" />
            <AlertDescription className="text-[#F5F5DC]">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6 border-[#006633] bg-[#006633]/10">
            <CheckCircle className="h-4 w-4 text-[#006633]" />
            <AlertDescription className="text-[#F5F5DC]">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-[#0B1623] border border-[#D4AF37]/20">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#006633] data-[state=active]:text-white text-[#F5F5DC]">Profil</TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-[#006633] data-[state=active]:text-white text-[#F5F5DC]">Facturation</TabsTrigger>
          </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#D4AF37]">
                <Settings className="h-5 w-5 text-[#006633]" />
                <span>Informations personnelles</span>
              </CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">
                Modifiez vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#F5F5DC]">Nom complet</Label>
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#F5F5DC]">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={loading} className="bg-[#006633] hover:bg-[#C1440E] text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#D4AF37]">
                <Shield className="h-5 w-5 text-[#006633]" />
                <span>Changer le mot de passe</span>
              </CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">
                Mettez à jour votre mot de passe pour plus de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-[#F5F5DC]">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-[#F5F5DC]">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#F5F5DC]">Confirmer le nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleChangePassword} disabled={loading} className="bg-[#006633] hover:bg-[#C1440E] text-white">
                  <Shield className="h-4 w-4 mr-2" />
                  {loading ? "Modification..." : "Modifier le mot de passe"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#D4AF37]">
                <CreditCard className="h-5 w-5 text-[#006633]" />
                <span>Abonnement actuel</span>
              </CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">
                Informations sur votre plan d'abonnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#F5F5DC]">{getSubscriptionName(profile.subscription)}</h3>
                    <p className="text-[#F5F5DC]/70">{getSubscriptionPrice(profile.subscription)}</p>
                  </div>
                  <Badge className="bg-[#006633] text-white">
                    {profile.subscription}
                  </Badge>
                </div>

                {profile.subscription !== 'FREE' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#F5F5DC]/70">
                        Statut de l'abonnement
                      </span>
                      <div className="flex items-center space-x-2">
                        {isExpired ? (
                          <Badge className="bg-[#C1440E] text-white">Expiré</Badge>
                        ) : (
                          <Badge className="bg-[#006633] text-white">
                            Actif
                          </Badge>
                        )}
                      </div>
                    </div>

                    {profile.subscriptionExpiresAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#F5F5DC]/70">
                          Date d'expiration
                        </span>
                        <span className="text-sm font-medium text-[#D4AF37]">
                          {new Date(profile.subscriptionExpiresAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}

                    {daysUntilExpiry !== null && !isExpired && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Jours restants
                        </span>
                        <span className={`text-sm font-medium ${
                          daysUntilExpiry <= 7 ? 'text-red-600' : 
                          daysUntilExpiry <= 30 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          {daysUntilExpiry} jour(s)
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {isExpired && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Votre abonnement a expiré. Renouvelez-le pour continuer à profiter de tous les services.
                    </AlertDescription>
                  </Alert>
                )}

                {daysUntilExpiry !== null && daysUntilExpiry <= 7 && !isExpired && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Votre abonnement expire bientôt ({daysUntilExpiry} jour(s)). Pensez à le renouveler.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-[#D4AF37]">Gérer l'abonnement</CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">
                Modifiez ou renouvelez votre abonnement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild className="h-auto p-4 bg-[#006633] hover:bg-[#C1440E] text-white">
                  <Link href="/pricing">
                    <div className="text-left">
                      <div className="font-semibold">Changer de plan</div>
                      <div className="text-sm text-white/70">
                        Découvrir nos autres plans
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" asChild className="h-auto p-4 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
                  <Link href="/pricing/payment">
                    <div className="text-left">
                      <div className="font-semibold">Renouveler</div>
                      <div className="text-sm text-[#F5F5DC]/70">
                        Renouveler l'abonnement actuel
                      </div>
                    </div>
                  </Link>
                </Button>
              </div>

              {profile.subscription !== 'FREE' && (
                <div className="pt-4 border-t border-[#D4AF37]/20">
                  <Button variant="outline" className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Historique des paiements
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
