"use client"

import { useState, useEffect } from "react"
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
  CheckCircle
} from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "next-themes"

type Theme = "light" | "dark" | "system"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState<Theme>("system")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setCurrentTheme(savedTheme)
      setTheme(savedTheme)
    }
  }, [setTheme])

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
            <h1 className="text-3xl font-bold text-balance">Paramètres</h1>
            <p className="text-muted-foreground">
              Gérez vos préférences et paramètres de compte
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Settings className="mr-2 h-4 w-4" />
            Configuration
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apparence
                </CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de votre interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Thème</Label>
                  <div className="grid gap-3">
                    {(["light", "dark", "system"] as Theme[]).map((themeType) => (
                      <div
                        key={themeType}
                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                          currentTheme === themeType
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                        onClick={() => handleThemeChange(themeType)}
                      >
                        <div className="flex items-center gap-3">
                          {getThemeIcon(themeType)}
                          <div>
                            <div className="font-medium capitalize">
                              {themeType === "system" ? "Système" : themeType === "light" ? "Clair" : "Sombre"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getThemeDescription(themeType)}
                            </div>
                          </div>
                        </div>
                        {currentTheme === themeType && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configurez vos préférences de notification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des mises à jour importantes par email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Notifications push</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des notifications dans votre navigateur
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing</Label>
                      <p className="text-sm text-muted-foreground">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Utilisateur FarmLink</p>
                    <p className="text-sm text-muted-foreground">Membre depuis 2024</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      Modifier le profil
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Sécurité
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleContactSupport("email")}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contacter par email
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleContactSupport("whatsapp")}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Zone de danger
                </CardTitle>
                <CardDescription>
                  Actions irréversibles sur votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer le compte
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Supprimer votre compte</DialogTitle>
                      <DialogDescription>
                        Cette action est irréversible. Toutes vos données seront supprimées définitivement.
                      </DialogDescription>
                    </DialogHeader>
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Vous perdrez accès à toutes vos fermes, parcelles, équipes et données financières.
                      </AlertDescription>
                    </Alert>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsDeleteDialogOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
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
