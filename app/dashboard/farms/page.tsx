import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Leaf, Plus, MapPin, Calendar, Droplets, Thermometer, TrendingUp, AlertCircle, Edit, Eye } from "lucide-react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FarmsClient } from "./farms-client"

type Farm = any

async function getFarmsData() {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  const userId = session.user.id

  const farms = await prisma.farm.findMany({
    where: { userId },
    include: {
      plots: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return farms
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "GROWING":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "PLANTED":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "PREPARATION":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    case "HARVESTED":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    case "FALLOW":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "GROWING": return "Croissance"
    case "PLANTED": return "Semis"
    case "PREPARATION": return "Préparation"
    case "HARVESTED": return "Récolté"
    case "FALLOW": return "En jachère"
    default: return "Inconnu"
  }
}

const getProgressValue = (status: string) => {
  switch (status) {
    case "PREPARATION": return 10
    case "PLANTED": return 25
    case "GROWING": return 60
    case "HARVESTED": return 100
    case "FALLOW": return 0
    default: return 0
  }
}

export default async function FarmsPage() {
  const farms = await getFarmsData()
  
  if (!farms) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Erreur de chargement des données</p>
        </div>
      </DashboardLayout>
    )
  }

  // Calculer les métriques
  const totalPlots = farms.reduce((sum, farm) => sum + farm.plots.length, 0)
  const totalArea = farms.reduce((sum, farm) => sum + farm.totalArea, 0)
  const activePlots = farms.reduce((sum, farm) => 
    sum + farm.plots.filter(plot => plot.status !== 'FALLOW').length, 0
  )
  const readyToHarvest = farms.reduce((sum, farm) => 
    sum + farm.plots.filter(plot => plot.status === 'HARVESTED').length, 0
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Gestion des Fermes</h1>
            <p className="text-muted-foreground">Gérez vos parcelles et suivez vos cultures</p>
          </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
            Nouvelle Ferme
                </Button>
        </div>

        {/* Farm Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fermes</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{farms.length}</div>
              <p className="text-xs text-muted-foreground">{totalArea.toFixed(1)} hectares au total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Parcelles Actives</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePlots}</div>
              <p className="text-xs text-muted-foreground">Sur {totalPlots} parcelles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prêt à Récolter</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readyToHarvest}</div>
              <p className="text-xs text-muted-foreground">Parcelle{readyToHarvest > 1 ? 's' : ''} récoltée{readyToHarvest > 1 ? 's' : ''}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Parcelles</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPlots}</div>
              <p className="text-xs text-muted-foreground">Parcelle{totalPlots > 1 ? 's' : ''} enregistrée{totalPlots > 1 ? 's' : ''}</p>
            </CardContent>
          </Card>
        </div>

        <FarmsClient farms={farms as Farm[]} />
      </div>
    </DashboardLayout>
  )
}
