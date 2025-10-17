"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, Users, TrendingUp, Cloud, Calculator, AlertTriangle, Droplets, Wind, Eye, Plus, X, Save } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SubscriptionUsage } from "@/components/subscription-usage"
import { TrialAlert } from "@/components/trial-alert"
import { WeatherWidget } from "@/components/weather-widget"
import { WeatherAlert } from "@/components/weather-alert"
import { useSession } from "next-auth/react"
import { AuthGuard } from "@/components/auth-guard"
import Link from "next/link"

interface DashboardData {
  farms: any[]
  plots: any[]
  teamMembers: any[]
  expenses: any[]
  tasks: any[]
  weatherLimits: any
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // États pour les modales
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [showReportsModal, setShowReportsModal] = useState(false)
  
  // États pour les formulaires
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    description: "",
    category: "",
    farmId: ""
  })
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "MEDIUM",
    dueDate: ""
  })
  const [cropForm, setCropForm] = useState({
    plotId: "",
    cropType: "",
    plantingDate: "",
    notes: ""
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      } else {
        setError("Erreur lors du chargement des données")
      }
    } catch (error) {
      setError("Erreur lors du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseForm),
      })

      if (response.ok) {
        setSuccess("Dépense enregistrée avec succès")
        setExpenseForm({ amount: "", description: "", category: "", farmId: "" })
        setShowExpenseModal(false)
        fetchDashboardData()
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors de l'enregistrement")
      }
    } catch (error) {
      setError("Erreur lors de l'enregistrement")
    } finally {
      setSubmitting(false)
    }
  }

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskForm),
      })

      if (response.ok) {
        setSuccess("Tâche assignée avec succès")
        setTaskForm({ title: "", description: "", assignedTo: "", priority: "MEDIUM", dueDate: "" })
        setShowTaskModal(false)
        fetchDashboardData()
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors de l'assignation")
      }
    } catch (error) {
      setError("Erreur lors de l'assignation")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCropSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch('/api/crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cropForm),
      })

      if (response.ok) {
        setSuccess("Culture mise à jour avec succès")
        setCropForm({ plotId: "", cropType: "", plantingDate: "", notes: "" })
        setShowCropModal(false)
        fetchDashboardData()
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      setError("Erreur lors de la mise à jour")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div>Aucune donnée disponible</div>
      </DashboardLayout>
    )
  }

  const { farms, plots, teamMembers, expenses, tasks, weatherLimits } = dashboardData

  return (
    <AuthGuard>
      <DashboardLayout>
      <div className="space-y-6">
        {/* Alerts */}
        {error && (
          <Alert className="border-[#C1440E] bg-[#C1440E]/10">
            <AlertTriangle className="h-4 w-4 text-[#C1440E]" />
            <AlertDescription className="text-[#F5F5DC]">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-[#006633] bg-[#006633]/10">
            <AlertDescription className="text-[#F5F5DC]">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Trial Alert */}
        <TrialAlert />
        
        {/* Subscription Usage */}
        <SubscriptionUsage />

        {/* Weather Alert */}
        <WeatherAlert />

        {/* Weather Widget */}
        <WeatherWidget />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#D4AF37]">Fermes</CardTitle>
              <Leaf className="h-4 w-4 text-[#006633]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#F5F5DC]">{farms.length}</div>
              <p className="text-xs text-[#F5F5DC]/70">
                {plots.length} parcelles au total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#D4AF37]">Équipe</CardTitle>
              <Users className="h-4 w-4 text-[#006633]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#F5F5DC]">{teamMembers.length}</div>
              <p className="text-xs text-[#F5F5DC]/70">
                Membres actifs
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#D4AF37]">Dépenses</CardTitle>
              <Calculator className="h-4 w-4 text-[#006633]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#F5F5DC]">
                {expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()} FCFA
              </div>
              <p className="text-xs text-[#F5F5DC]/70">
                Ce mois-ci
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#D4AF37]">Tâches</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#006633]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#F5F5DC]">{tasks.length}</div>
              <p className="text-xs text-[#F5F5DC]/70">
                En cours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300">
            <CardHeader>
                <CardTitle className="text-[#D4AF37]">Activités récentes</CardTitle>
                <CardDescription className="text-[#F5F5DC]/70">Dernières actions sur vos fermes</CardDescription>
            </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.slice(0, 5).map((task, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-[#006633] rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#F5F5DC]">{task.title}</p>
                          <p className="text-xs text-[#F5F5DC]/70">
                          Assigné à {task.assignedTo} • {new Date(task.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                      </div>
                      <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37]">{task.status}</Badge>
                  </div>
                  ))}
              </div>
                <Button variant="outline" className="w-full mt-4 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A] transition-all duration-300">
                <Eye className="mr-2 h-4 w-4" />
                Voir toutes les activités
              </Button>
            </CardContent>
          </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-[#D4AF37]">Actions Rapides</CardTitle>
              <CardDescription className="text-[#F5F5DC]/70">Raccourcis vers les tâches courantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start bg-transparent hover:bg-[#006633]/10 border-[#D4AF37]/30 text-[#F5F5DC] hover:text-[#006633] transition-all duration-300" 
                  variant="outline"
                  onClick={() => setShowExpenseModal(true)}
                >
                <Calculator className="mr-2 h-4 w-4" />
                Enregistrer une dépense
              </Button>

                <Button 
                  className="w-full justify-start bg-transparent hover:bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#F5F5DC] hover:text-[#D4AF37] transition-all duration-300" 
                  variant="outline"
                  onClick={() => setShowTaskModal(true)}
                >
                <Users className="mr-2 h-4 w-4" />
                Assigner une tâche
              </Button>

                <Button 
                  className="w-full justify-start bg-transparent hover:bg-[#C1440E]/10 border-[#D4AF37]/30 text-[#F5F5DC] hover:text-[#C1440E] transition-all duration-300" 
                  variant="outline"
                  onClick={() => setShowCropModal(true)}
                >
                <Leaf className="mr-2 h-4 w-4" />
                Mettre à jour les cultures
              </Button>

                <Button 
                  className="w-full justify-start bg-transparent hover:bg-[#006633]/10 border-[#D4AF37]/30 text-[#F5F5DC] hover:text-[#006633] transition-all duration-300" 
                  variant="outline"
                  onClick={() => setShowReportsModal(true)}
                >
                <TrendingUp className="mr-2 h-4 w-4" />
                Voir les rapports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>

      {/* Expense Modal */}
      <Dialog open={showExpenseModal} onOpenChange={setShowExpenseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer une dépense</DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle dépense à votre ferme
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (FCFA)</Label>
              <Input
                id="amount"
                type="number"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={expenseForm.category} onValueChange={(value) => setExpenseForm(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEEDS">Graines</SelectItem>
                  <SelectItem value="FERTILIZER">Engrais</SelectItem>
                  <SelectItem value="EQUIPMENT">Équipement</SelectItem>
                  <SelectItem value="LABOR">Main d'œuvre</SelectItem>
                  <SelectItem value="OTHER">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmId">Ferme</Label>
              <Select value={expenseForm.farmId} onValueChange={(value) => setExpenseForm(prev => ({ ...prev, farmId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une ferme" />
                </SelectTrigger>
                <SelectContent>
                  {farms.map((farm) => (
                    <SelectItem key={farm.id} value={farm.id}>{farm.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowExpenseModal(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={submitting}>
                <Save className="h-4 w-4 mr-2" />
                {submitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Task Modal */}
      <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner une tâche</DialogTitle>
            <DialogDescription>
              Créez une nouvelle tâche pour votre équipe
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la tâche</Label>
              <Input
                id="title"
                value={taskForm.title}
                onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={taskForm.description}
                onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigné à</Label>
              <Select value={taskForm.assignedTo} onValueChange={(value) => setTaskForm(prev => ({ ...prev, assignedTo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un membre" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Faible</SelectItem>
                    <SelectItem value="MEDIUM">Moyenne</SelectItem>
                    <SelectItem value="HIGH">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date limite</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowTaskModal(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={submitting}>
                <Save className="h-4 w-4 mr-2" />
                {submitting ? "Assignation..." : "Assigner"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Crop Modal */}
      <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mettre à jour les cultures</DialogTitle>
            <DialogDescription>
              Enregistrez les informations sur vos cultures
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCropSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plotId">Parcelle</Label>
              <Select value={cropForm.plotId} onValueChange={(value) => setCropForm(prev => ({ ...prev, plotId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une parcelle" />
                </SelectTrigger>
                <SelectContent>
                  {plots.map((plot) => (
                    <SelectItem key={plot.id} value={plot.id}>
                      {plot.name} - {farms.find(f => f.id === plot.farmId)?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cropType">Type de culture</Label>
              <Input
                id="cropType"
                value={cropForm.cropType}
                onChange={(e) => setCropForm(prev => ({ ...prev, cropType: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plantingDate">Date de plantation</Label>
              <Input
                id="plantingDate"
                type="date"
                value={cropForm.plantingDate}
                onChange={(e) => setCropForm(prev => ({ ...prev, plantingDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={cropForm.notes}
                onChange={(e) => setCropForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Observations, conditions, etc."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowCropModal(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={submitting}>
                <Save className="h-4 w-4 mr-2" />
                {submitting ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reports Modal */}
      <Dialog open={showReportsModal} onOpenChange={setShowReportsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Rapports et analyses</DialogTitle>
            <DialogDescription>
              Consultez les rapports détaillés de vos fermes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rapport financier</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Analysez vos dépenses et revenus par période
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/reports/financial">
                      Voir le rapport financier
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rapport de production</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Suivez les rendements et performances de vos cultures
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/reports/production">
                      Voir le rapport de production
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rapport météo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Analysez l'impact météorologique sur vos cultures
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/reports/weather">
                      Voir le rapport météo
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rapport d'équipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Évaluez les performances et tâches de votre équipe
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/reports/team">
                      Voir le rapport d'équipe
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </DashboardLayout>
    </AuthGuard>
  )
}