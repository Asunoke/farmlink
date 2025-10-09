"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, CreditCard, Calendar, CheckCircle, AlertTriangle, Edit } from "lucide-react"
import { getSubscriptionLimits } from "@/lib/subscription-limits"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  
  // État pour la modification du profil
  const [profileData, setProfileData] = useState({
    name: "",
    email: ""
  })
  
  // État pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // État pour les informations de facturation
  const [billingInfo, setBillingInfo] = useState({
    subscription: "FREE",
    startDate: null,
    endDate: null,
    status: "active"
  })

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || ""
      })
      setBillingInfo({
        subscription: (session.user as any).subscription || "FREE",
        startDate: (session.user as any).subscriptionStartDate,
        endDate: (session.user as any).subscriptionEndDate,
        status: "active"
      })
    }
  }, [session])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
        }),
      })

      if (response.ok) {
        setMessage("Profil mis à jour avec succès")
        // Mettre à jour la session
        await update()
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors de la mise à jour du profil")
      }
    } catch (error) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (response.ok) {
        setMessage("Mot de passe modifié avec succès")
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors du changement de mot de passe")
      }
    } catch (error) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const getSubscriptionStatus = () => {
    const subscription = billingInfo.subscription
    const limits = getSubscriptionLimits(subscription)
    
    if (subscription === "FREE") {
      return {
        color: "bg-gray-100 text-gray-800",
        icon: AlertTriangle,
        text: "Plan gratuit"
      }
    } else if (subscription === "PREMIUM") {
      return {
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
        text: "Plan Premium"
      }
    } else if (subscription === "ENTERPRISE") {
      return {
        color: "bg-purple-100 text-purple-800",
        icon: CheckCircle,
        text: "Plan Enterprise"
      }
    }
    
    return {
      color: "bg-gray-100 text-gray-800",
      icon: AlertTriangle,
      text: "Plan inconnu"
    }
  }

  const getDaysRemaining = () => {
    if (!billingInfo.endDate) return null
    
    const endDate = new Date(billingInfo.endDate)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays > 0 ? diffDays : 0
  }

  const subscriptionStatus = getSubscriptionStatus()
  const daysRemaining = getDaysRemaining()
  const limits = getSubscriptionLimits(billingInfo.subscription)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-[#006633]" />
          <div>
            <h1 className="text-3xl font-bold text-[#D4AF37]">Mon Profil</h1>
            <p className="text-[#F5F5DC]/70">Gérez vos informations personnelles et votre abonnement</p>
          </div>
        </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-[#0B1623] border border-[#D4AF37]/20">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#006633] data-[state=active]:text-white text-[#F5F5DC]">Profil</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[#006633] data-[state=active]:text-white text-[#F5F5DC]">Sécurité</TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-[#006633] data-[state=active]:text-white text-[#F5F5DC]">Facturation</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
                <Edit className="h-5 w-5 text-[#006633]" />
                Informations personnelles
              </CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">Modifiez vos informations de base</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                {error && (
                  <Alert className="border-[#C1440E] bg-[#C1440E]/10">
                    <AlertTriangle className="h-4 w-4 text-[#C1440E]" />
                    <AlertDescription className="text-[#F5F5DC]">{error}</AlertDescription>
                  </Alert>
                )}
                
                {message && (
                  <Alert className="border-[#006633] bg-[#006633]/10">
                    <CheckCircle className="h-4 w-4 text-[#006633]" />
                    <AlertDescription className="text-[#F5F5DC]">{message}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-[#F5F5DC]">Nom d'utilisateur</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#F5F5DC]">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="role" className="text-[#F5F5DC]">Rôle</Label>
                  <Input
                    id="role"
                    value={(session?.user as any)?.role || "USER"}
                    disabled
                    className="bg-[#0B1623] border-[#D4AF37]/20 text-[#F5F5DC]/70"
                  />
                </div>

                <Button type="submit" disabled={loading} className="bg-[#006633] hover:bg-[#C1440E] text-white">
                  {loading ? "Mise à jour..." : "Mettre à jour le profil"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
                <Lock className="h-5 w-5 text-[#006633]" />
                Changer le mot de passe
              </CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">Modifiez votre mot de passe pour sécuriser votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {error && (
                  <Alert className="border-[#C1440E] bg-[#C1440E]/10">
                    <AlertTriangle className="h-4 w-4 text-[#C1440E]" />
                    <AlertDescription className="text-[#F5F5DC]">{error}</AlertDescription>
                  </Alert>
                )}
                
                {message && (
                  <Alert className="border-[#006633] bg-[#006633]/10">
                    <CheckCircle className="h-4 w-4 text-[#006633]" />
                    <AlertDescription className="text-[#F5F5DC]">{message}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="currentPassword" className="text-[#F5F5DC]">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                    className="bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-[#F5F5DC]">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                    minLength={6}
                    className="bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-[#F5F5DC]">Confirmer le nouveau mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    className="bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                  />
                </div>

                <Button type="submit" disabled={loading} className="bg-[#006633] hover:bg-[#C1440E] text-white">
                  {loading ? "Modification..." : "Modifier le mot de passe"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
                <CreditCard className="h-5 w-5 text-[#006633]" />
                Abonnement et facturation
              </CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">Gérez votre abonnement et consultez vos informations de facturation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Statut de l'abonnement */}
              <div className="flex items-center justify-between p-4 border border-[#D4AF37]/20 rounded-lg bg-[#0D1B2A]">
                <div className="flex items-center gap-3">
                  <subscriptionStatus.icon className="h-6 w-6 text-[#006633]" />
                  <div>
                    <h3 className="font-semibold text-[#F5F5DC]">{subscriptionStatus.text}</h3>
                    <p className="text-sm text-[#F5F5DC]/70">
                      {billingInfo.subscription === "FREE" 
                        ? "Accès aux fonctionnalités de base"
                        : "Accès à toutes les fonctionnalités"
                      }
                    </p>
                  </div>
                </div>
                <Badge className="bg-[#006633] text-white">
                  {billingInfo.subscription}
                </Badge>
              </div>

              {/* Durée restante */}
              {billingInfo.subscription !== "FREE" && daysRemaining !== null && (
                <div className="flex items-center gap-2 p-4 border border-[#D4AF37]/20 rounded-lg bg-[#0D1B2A]">
                  <Calendar className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <h4 className="font-medium text-[#F5F5DC]">Durée restante</h4>
                    <p className="text-sm text-[#F5F5DC]/70">
                      {daysRemaining > 0 
                        ? `${daysRemaining} jour${daysRemaining > 1 ? "s" : ""} restant${daysRemaining > 1 ? "s" : ""}`
                        : "Abonnement expiré"
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Limites du plan */}
              <div>
                <h4 className="font-medium mb-3 text-[#D4AF37]">Limites de votre plan</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-[#D4AF37]/20 rounded-lg bg-[#0D1B2A]">
                    <div className="text-sm text-[#F5F5DC]/70">Fermes</div>
                    <div className="text-lg font-semibold text-[#D4AF37]">
                      {limits.farms === Number.POSITIVE_INFINITY ? "∞" : limits.farms}
                    </div>
                  </div>
                  <div className="p-3 border border-[#D4AF37]/20 rounded-lg bg-[#0D1B2A]">
                    <div className="text-sm text-[#F5F5DC]/70">Membres d'équipe</div>
                    <div className="text-lg font-semibold text-[#D4AF37]">
                      {limits.teamMembers === Number.POSITIVE_INFINITY ? "∞" : limits.teamMembers}
                    </div>
                  </div>
                  <div className="p-3 border border-[#D4AF37]/20 rounded-lg bg-[#0D1B2A]">
                    <div className="text-sm text-[#F5F5DC]/70">Appels API</div>
                    <div className="text-lg font-semibold text-[#D4AF37]">
                      {limits.expenses === Number.POSITIVE_INFINITY ? "∞" : limits.expenses}
                    </div>
                  </div>
                  <div className="p-3 border border-[#D4AF37]/20 rounded-lg bg-[#0D1B2A]">
                    <div className="text-sm text-[#F5F5DC]/70">Support</div>
                    <div className="text-lg font-semibold text-[#D4AF37]">
                      {limits.features.prioritySupport ? "Prioritaire" : "Standard"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {billingInfo.subscription === "FREE" ? (
                  <Button asChild className="bg-[#006633] hover:bg-[#C1440E] text-white">
                    <a href="/pricing">Upgrader vers Premium</a>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
                      <a href="/pricing">Changer de plan</a>
                    </Button>
                    <Button variant="outline" asChild className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
                      <a href="/billing">Gérer la facturation</a>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  )
}