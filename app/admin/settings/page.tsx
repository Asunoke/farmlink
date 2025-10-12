"use client"

import { useState, useEffect } from "react"
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  Trash2, 
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "FarmLink",
    siteDescription: "Plateforme SaaS de gestion agricole pour le Mali",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    maxFileSize: "10",
    sessionTimeout: "30"
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error)
      }
    }

    loadSettings()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSuccess("Paramètres sauvegardés avec succès")
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors de la sauvegarde des paramètres")
      }
    } catch (error) {
      setError("Erreur lors de la sauvegarde des paramètres")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'admin-settings.json'
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      setError("Erreur lors de l'export des paramètres")
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings(importedSettings)
          setSuccess("Paramètres importés avec succès")
        } catch (error) {
          setError("Erreur lors de l'import des paramètres")
        }
      }
      reader.readAsText(file)
    }
  }

  const handleMaintenanceAction = async (action: string) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess(data.message)
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors de l'action de maintenance")
      }
    } catch (error) {
      setError("Erreur lors de l'action de maintenance")
    } finally {
      setLoading(false)
    }
  }

  const handleClearCache = () => {
    if (confirm("Êtes-vous sûr de vouloir vider le cache ?")) {
      handleMaintenanceAction('clear-cache')
    }
  }

  const handleResetDatabase = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser la base de données ? Cette action est irréversible !")) {
      if (confirm("Confirmez-vous cette action critique ?")) {
        handleMaintenanceAction('reset-database')
      }
    }
  }

  const handleBackupDatabase = () => {
    handleMaintenanceAction('backup-database')
  }

  return (
    <AuthGuard requireAdmin>
      <AdminDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#006633]/20 rounded-xl">
              <Settings className="h-6 w-6 text-[#006633]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#D4AF37]">Paramètres Admin</h1>
              <p className="text-[#F5F5DC]/70">Configuration de la plateforme FarmLink</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-[#C1440E] bg-[#C1440E]/10">
            <AlertTriangle className="h-4 w-4 text-[#C1440E]" />
            <AlertDescription className="text-[#F5F5DC]">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-[#006633] bg-[#006633]/10">
            <CheckCircle className="h-4 w-4 text-[#006633]" />
            <AlertDescription className="text-[#F5F5DC]">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Configuration générale */}
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration générale
              </CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">
                Paramètres de base de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-[#F5F5DC]">Nom du site</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    className="bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription" className="text-[#F5F5DC]">Description</Label>
                  <Input
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    className="bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] placeholder:text-[#F5F5DC]/50 focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mode maintenance */}
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Mode maintenance
              </CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">
                Contrôle de l'accès à la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode" className="text-[#F5F5DC]">Activer le mode maintenance</Label>
                  <p className="text-sm text-[#F5F5DC]/70">Bloque l'accès aux utilisateurs non-admin</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">
                Configuration des notifications système
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications" className="text-[#F5F5DC]">Notifications email</Label>
                  <p className="text-sm text-[#F5F5DC]/70">Activer les notifications par email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications" className="text-[#F5F5DC]">Notifications SMS</Label>
                  <p className="text-sm text-[#F5F5DC]/70">Activer les notifications par SMS</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Base de données */}
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                <Database className="h-5 w-5" />
                Base de données
              </CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">
                Gestion des sauvegardes et maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoBackup" className="text-[#F5F5DC]">Sauvegarde automatique</Label>
                  <p className="text-sm text-[#F5F5DC]/70">Sauvegarde quotidienne de la base de données</p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoBackup: checked }))}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter les paramètres
                </Button>
                <Button
                  onClick={handleBackupDatabase}
                  variant="outline"
                  className="border-[#006633] text-[#006633] hover:bg-[#006633] hover:text-white"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Sauvegarder la base
                </Button>
                <Button
                  variant="outline"
                  className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    id="import-settings"
                  />
                  <label htmlFor="import-settings" className="cursor-pointer">
                    Importer les paramètres
                  </label>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Zone de danger */}
          <Card className="bg-[#0B1623] border border-[#C1440E]/30">
            <CardHeader>
              <CardTitle className="text-[#C1440E] flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Zone de danger
              </CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">
                Actions irréversibles - Procéder avec prudence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  onClick={handleClearCache}
                  variant="outline"
                  className="border-[#C1440E] text-[#C1440E] hover:bg-[#C1440E] hover:text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vider le cache
                </Button>
                <Button
                  onClick={handleResetDatabase}
                  variant="outline"
                  className="border-[#C1440E] text-[#C1440E] hover:bg-[#C1440E] hover:text-white"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Réinitialiser la base
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#006633] hover:bg-[#C1440E] text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      </AdminDashboardLayout>
    </AuthGuard>
  )
}
