"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  Settings, 
  Palette, 
  User, 
  Bell, 
  Shield, 
  Trash2, 
  Mail, 
  MessageCircle, 
  Monitor, 
  Moon, 
  Sun,
  AlertTriangle,
  CheckCircle,
  Calendar
} from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

type Theme = "light" | "dark" | "system"

export default function SettingsPage() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState<Theme>("system")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setCurrentTheme(savedTheme)
      setTheme(savedTheme)
    }
  }, [setTheme])

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/user/profile')
          if (response.ok) {
            const data = await response.json()
            setUserData(data)
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error)
        }
      }
    }

    fetchUserData()
  }, [session?.user?.id])

  const handleThemeChange = (newTheme: Theme) => {
    setCurrentTheme(newTheme)
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    toast.success("Thème mis à jour avec succès")
  }

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
    toast.success("Préférences de notification mises à jour")
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Votre compte a été supprimé avec succès")
        // Rediriger vers la page de connexion
        window.location.href = "/auth/signin"
      } else {
        const error = await response.json()
        toast.error(error.error || "Erreur lors de la suppression du compte")
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du compte")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactSupport = (method: "email" | "whatsapp") => {
    if (method === "email") {
      window.open("mailto:support@farmlink.ml?subject=Support FarmLink", "_blank")
    } else {
      window.open("https://wa.me/223XXXXXXXX?text=Bonjour, j'ai besoin d'aide avec FarmLink", "_blank")
    }
  }

  const getThemeIcon = (themeType: Theme) => {
    switch (themeType) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      case "system":
        return <Monitor className="h-4 w-4" />
    }
  }

  const getThemeDescription = (themeType: Theme) => {
    switch (themeType) {
      case "light":
        return "Thème clair avec fond blanc"
      case "dark":
        return "Thème sombre avec fond noir"
      case "system":
        return "Suit les préférences de votre système"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance text-[#D4AF37]">Paramètres</h1>
            <p className="text-[#F5F5DC]/70">
              Gérez vos préférences et paramètres de compte
            </p>
          </div>
          <Badge className="bg-[#006633]/10 text-[#006633] border-[#006633]/20">
            <Settings className="mr-2 h-4 w-4" />
            Configuration
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Theme Settings */}
            <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
                  <Palette className="h-5 w-5 text-[#006633]" />
                  Apparence
                </CardTitle>
                <CardDescription className="text-[#F5F5DC]/70">
                  Personnalisez l'apparence de votre interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium text-[#F5F5DC]">Thème</Label>
                  <div className="grid gap-3">
                    {(["light", "dark", "system"] as Theme[]).map((themeType) => (
                      <div
                        key={themeType}
                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                          currentTheme === themeType
                            ? "border-[#006633] bg-[#006633]/10"
                            : "border-[#D4AF37]/20 hover:bg-[#D4AF37]/5"
                        }`}
                        onClick={() => handleThemeChange(themeType)}
                      >
                        <div className="flex items-center gap-3">
                          {getThemeIcon(themeType)}
                          <div>
                            <div className="font-medium capitalize text-[#F5F5DC]">
                              {themeType === "system" ? "Système" : themeType === "light" ? "Clair" : "Sombre"}
                            </div>
                            <div className="text-sm text-[#F5F5DC]/70">
                              {getThemeDescription(themeType)}
                            </div>
                          </div>
                        </div>
                        {currentTheme === themeType && (
                          <CheckCircle className="h-5 w-5 text-[#006633]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Settings */}
            <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
                  <Bell className="h-5 w-5 text-[#006633]" />
                  Notifications
                </CardTitle>
                <CardDescription className="text-[#F5F5DC]/70">
                  Configurez vos préférences de notification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base text-[#F5F5DC]">Notifications par email</Label>
                      <p className="text-sm text-[#F5F5DC]/70">
                        Recevez des mises à jour importantes par email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                    />
                  </div>
                  
                  <Separator className="bg-[#D4AF37]/20" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base text-[#F5F5DC]">Notifications push</Label>
                      <p className="text-sm text-[#F5F5DC]/70">
                        Recevez des notifications dans votre navigateur
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                    />
                  </div>
                  
                  <Separator className="bg-[#D4AF37]/20" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base text-[#F5F5DC]">Marketing</Label>
                      <p className="text-sm text-[#F5F5DC]/70">
                        Recevez des offres et nouvelles fonctionnalités
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => handleNotificationChange("marketing", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
                  <User className="h-5 w-5 text-[#006633]" />
                  Compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-[#006633]/10 rounded-full flex items-center justify-center mx-auto">
                    {userData?.image ? (
                      <img 
                        src={userData.image} 
                        alt="Avatar" 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-[#006633]" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[#F5F5DC]">
                      {userData?.name || session?.user?.name || "Utilisateur FarmLink"}
                    </p>
                    <p className="text-sm text-[#F5F5DC]/70">
                      {userData?.email || session?.user?.email}
                    </p>
                    <p className="text-xs text-[#F5F5DC]/60 flex items-center justify-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      Membre depuis {userData?.createdAt ? format(new Date(userData.createdAt), 'MMMM yyyy', { locale: fr }) : '2024'}
                    </p>
                  </div>
                </div>
                
                <Separator className="bg-[#D4AF37]/20" />
                
                {/* Plan d'abonnement */}
                <div className="text-center space-y-2">
                  <Badge 
                    variant="outline" 
                    className={`border-[#D4AF37] text-[#D4AF37] ${
                      userData?.subscription === 'FREE' ? 'bg-gray-100 text-gray-600 border-gray-300' :
                      userData?.subscription === 'BASIC' ? 'bg-[#006633]/10 text-[#006633] border-[#006633]' :
                      userData?.subscription === 'PREMIUM' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]' :
                      'bg-[#C1440E]/10 text-[#C1440E] border-[#C1440E]'
                    }`}
                  >
                    {userData?.subscription === 'FREE' ? 'Gratuit' :
                     userData?.subscription === 'BASIC' ? 'Professional' :
                     userData?.subscription === 'PREMIUM' ? 'Business' :
                     userData?.subscription === 'ENTERPRISE' ? 'Enterprise' :
                     'Gratuit'}
                  </Badge>
                  <p className="text-xs text-[#F5F5DC]/60">
                    {userData?.subscription === 'FREE' ? 'Plan de base' :
                     userData?.subscription === 'BASIC' ? 'Plan professionnel' :
                     userData?.subscription === 'PREMIUM' ? 'Plan business' :
                     userData?.subscription === 'ENTERPRISE' ? 'Plan entreprise' :
                     'Plan de base'}
                  </p>
                </div>
                
                <Separator className="bg-[#D4AF37]/20" />
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]" asChild>
                    <a href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      Modifier le profil
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
                    <Shield className="mr-2 h-4 w-4" />
                    Sécurité
                  </Button>
                  
                  {userData?.subscription === 'FREE' && (
                    <Button variant="outline" className="w-full justify-start border-[#006633] text-[#006633] hover:bg-[#006633] hover:text-white" asChild>
                      <a href="/pricing">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Upgradez votre plan
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
                  <MessageCircle className="h-5 w-5 text-[#006633]" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                  onClick={() => handleContactSupport("email")}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contacter par email
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                  onClick={() => handleContactSupport("whatsapp")}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-[#0B1623] border border-[#C1440E]/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#C1440E]">
                  <AlertTriangle className="h-5 w-5" />
                  Zone de danger
                </CardTitle>
                <CardDescription className="text-[#F5F5DC]/70">
                  Actions irréversibles sur votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#C1440E] hover:bg-[#C1440E]/80 text-white">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer le compte
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0B1623] border border-[#D4AF37]/20">
                    <DialogHeader>
                      <DialogTitle className="text-[#D4AF37]">Supprimer votre compte</DialogTitle>
                      <DialogDescription className="text-[#F5F5DC]/70">
                        Cette action est irréversible. Toutes vos données seront supprimées définitivement.
                      </DialogDescription>
                    </DialogHeader>
                    <Alert className="border-[#C1440E] bg-[#C1440E]/10">
                      <AlertTriangle className="h-4 w-4 text-[#C1440E]" />
                      <AlertDescription className="text-[#F5F5DC]">
                        Vous perdrez accès à toutes vos fermes, parcelles, équipes et données financières.
                      </AlertDescription>
                    </Alert>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsDeleteDialogOpen(false)}
                        className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                      >
                        Annuler
                      </Button>
                      <Button 
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                        className="bg-[#C1440E] hover:bg-[#C1440E]/80 text-white"
                      >
                        {isLoading ? "Suppression..." : "Supprimer définitivement"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
