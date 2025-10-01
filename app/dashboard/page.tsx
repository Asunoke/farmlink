import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Leaf, Users, TrendingUp, Cloud, Calculator, AlertTriangle, Droplets, Wind, Eye } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SubscriptionUsage } from "@/components/subscription-usage"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getDashboardData() {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  const userId = session.user.id

  // Récupérer les données en parallèle
  const [farms, plots, teamMembers, expenses, tasks] = await Promise.all([
    // Fermes
    prisma.farm.findMany({
      where: { userId },
      include: {
        plots: true,
        _count: {
          select: { plots: true }
        }
      }
    }),
    
    // Parcelles
    prisma.plot.findMany({
      where: {
        farm: { userId }
      },
      include: {
        farm: {
          select: { name: true }
        }
      }
    }),
    
    // Équipe
    prisma.teamMember.findMany({
      where: { userId }
    }),
    
    // Dépenses du mois en cours
    prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        }
      }
    }),
    
    // Tâches récentes
    prisma.task.findMany({
      where: {
        teamMember: { userId }
      },
      include: {
        teamMember: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ])

  // Calculer les métriques
  const totalArea = farms.reduce((sum, farm) => sum + farm.totalArea, 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const activeTeamMembers = teamMembers.length
  const activePlots = plots.filter(plot => plot.status !== 'FALLOW').length

  return {
    farms,
    plots,
    teamMembers,
    expenses,
    tasks,
    metrics: {
      totalArea,
      totalExpenses,
      activeTeamMembers,
      activePlots
    }
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  
  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Erreur de chargement des données</p>
        </div>
      </DashboardLayout>
    )
  }

  const { farms, plots, teamMembers, expenses, tasks, metrics } = data
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Tableau de Bord</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de votre exploitation agricole
              {farms.length > 0 && ` - ${farms[0].name}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <div className="w-2 h-2 bg-primary rounded-full mr-2" />
              {farms.length > 0 ? 'Ferme Active' : 'Aucune Ferme'}
            </Badge>
            {farms.length > 1 && (
              <Badge variant="outline">
                +{farms.length - 1} autre{farms.length > 2 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        {/* Subscription Usage Widget */}
        <SubscriptionUsage />

        {/* Weather Alert */}
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <p className="font-medium text-amber-900 dark:text-amber-100">Alerte Météo - Pluies prévues demain</p>
                <p className="text-sm text-amber-700 dark:text-amber-200">
                  Reportez l'arrosage prévu. Probabilité de précipitations: 85%
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent"
              >
                Voir détails
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Surface Totale</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalArea.toFixed(1)} ha</div>
              <p className="text-xs text-muted-foreground">{farms.length} ferme{farms.length > 1 ? 's' : ''} active{farms.length > 1 ? 's' : ''}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Équipe Active</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeTeamMembers}</div>
              <p className="text-xs text-muted-foreground">Membre{metrics.activeTeamMembers > 1 ? 's' : ''} d'équipe</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Parcelles Actives</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activePlots}</div>
              <p className="text-xs text-muted-foreground">Parcelle{metrics.activePlots > 1 ? 's' : ''} en culture</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dépenses ce Mois</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalExpenses.toLocaleString()} FCFA</div>
              <p className="text-xs text-muted-foreground">{expenses.length} transaction{expenses.length > 1 ? 's' : ''}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weather Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Météo Actuelle - Bamako
              </CardTitle>
              <CardDescription>Conditions météorologiques en temps réel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">32°C</div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Ensoleillé</p>
                    <p className="text-xs text-muted-foreground">Ressenti: 35°C</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>Humidité: 65%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span>Vent: 12 km/h</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Prévisions 24h</span>
                  <span className="text-muted-foreground">Pluie probable</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="space-y-1">
                    <p className="font-medium">12h</p>
                    <p>34°C</p>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mx-auto" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">18h</p>
                    <p>28°C</p>
                    <div className="w-2 h-2 bg-gray-400 rounded-full mx-auto" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">00h</p>
                    <p>24°C</p>
                    <div className="w-2 h-2 bg-blue-400 rounded-full mx-auto" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">06h</p>
                    <p>22°C</p>
                    <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farm Status */}
          <Card>
            <CardHeader>
              <CardTitle>État des Cultures</CardTitle>
              <CardDescription>Progression des cultures par parcelle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {plots.length > 0 ? (
                  plots.slice(0, 4).map((plot) => {
                    const getProgressValue = (status: string) => {
                      switch (status) {
                        case 'PREPARATION': return 10
                        case 'PLANTED': return 25
                        case 'GROWING': return 60
                        case 'HARVESTED': return 100
                        case 'FALLOW': return 0
                        default: return 0
                      }
                    }

                    const getStatusText = (status: string) => {
                      switch (status) {
                        case 'PREPARATION': return 'Préparation'
                        case 'PLANTED': return 'Semis'
                        case 'GROWING': return 'Croissance'
                        case 'HARVESTED': return 'Récolté'
                        case 'FALLOW': return 'En jachère'
                        default: return 'Inconnu'
                      }
                    }

                    const getStatusDescription = (status: string) => {
                      switch (status) {
                        case 'PREPARATION': return 'Préparation du terrain'
                        case 'PLANTED': return 'Germination en cours'
                        case 'GROWING': return 'Développement des cultures'
                        case 'HARVESTED': return 'Récolte terminée'
                        case 'FALLOW': return 'Parcelle en repos'
                        default: return ''
                      }
                    }

                    return (
                      <div key={plot.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">
                            {plot.cropType} - {plot.name} ({plot.area} ha)
                          </span>
                          <span className="text-muted-foreground">{getStatusText(plot.status)}</span>
                        </div>
                        <Progress value={getProgressValue(plot.status)} className="h-2" />
                        <p className="text-xs text-muted-foreground">{getStatusDescription(plot.status)}</p>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Leaf className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aucune parcelle enregistrée</p>
                    <p className="text-xs">Créez votre première parcelle pour commencer</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Activités Récentes</CardTitle>
              <CardDescription>Dernières tâches assignées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {tasks.length > 0 ? (
                  tasks.map((task) => {
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'PENDING': return 'bg-yellow-500'
                        case 'IN_PROGRESS': return 'bg-blue-500'
                        case 'COMPLETED': return 'bg-green-500'
                        case 'CANCELLED': return 'bg-red-500'
                        default: return 'bg-gray-500'
                      }
                    }

                    const getStatusText = (status: string) => {
                      switch (status) {
                        case 'PENDING': return 'En attente'
                        case 'IN_PROGRESS': return 'En cours'
                        case 'COMPLETED': return 'Terminé'
                        case 'CANCELLED': return 'Annulé'
                        default: return 'Inconnu'
                      }
                    }

                    const formatDate = (date: Date) => {
                      const now = new Date()
                      const diff = now.getTime() - date.getTime()
                      const hours = Math.floor(diff / (1000 * 60 * 60))
                      const days = Math.floor(hours / 24)

                      if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`
                      if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
                      return 'À l\'instant'
                    }

                    return (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className={`w-2 h-2 ${getStatusColor(task.status)} rounded-full`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(new Date(task.createdAt))} • {task.teamMember.name} • {getStatusText(task.status)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aucune tâche récente</p>
                    <p className="text-xs">Assignez des tâches à votre équipe</p>
                  </div>
                )}
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                <Eye className="mr-2 h-4 w-4" />
                Voir toutes les activités
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>Raccourcis vers les tâches courantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Calculator className="mr-2 h-4 w-4" />
                Enregistrer une dépense
              </Button>

              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Assigner une tâche
              </Button>

              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Leaf className="mr-2 h-4 w-4" />
                Mettre à jour les cultures
              </Button>

              <Button className="w-full justify-start bg-transparent" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Voir les rapports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
