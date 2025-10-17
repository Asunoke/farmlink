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
import { LazyFarmsClient } from "@/components/lazy-components"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestion des Fermes',
  description: 'Gérez vos fermes et parcelles agricoles avec FarmLink. Suivez vos cultures, planifiez vos récoltes et optimisez vos rendements.',
  keywords: ['gestion ferme', 'parcelles agricoles', 'cultures', 'récoltes', 'rendement agricole'],
}

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
      return "bg-[#006633] text-white"
    case "PLANTED":
      return "bg-[#D4AF37] text-[#0D1B2A]"
    case "PREPARATION":
      return "bg-[#F5F5DC] text-[#0D1B2A]"
    case "HARVESTED":
      return "bg-[#C1440E] text-white"
    case "FALLOW":
      return "bg-[#0B1623] text-[#F5F5DC] border border-[#D4AF37]/20"
    default:
      return "bg-[#0B1623] text-[#F5F5DC] border border-[#D4AF37]/20"
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
            <h1 className="text-3xl font-bold text-balance text-[#D4AF37]">Gestion des Fermes</h1>
            <p className="text-[#F5F5DC]/70">Gérez vos parcelles et suivez vos cultures</p>
          </div>
              
        </div>

        {/* Farm Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#D4AF37]">Total Fermes</CardTitle>
              <Leaf className="h-4 w-4 text-[#006633]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#F5F5DC]">{farms.length}</div>
              <p className="text-xs text-[#F5F5DC]/70">{totalArea.toFixed(1)} hectares au total</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#D4AF37]">Parcelles Actives</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#006633]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#F5F5DC]">{activePlots}</div>
              <p className="text-xs text-[#F5F5DC]/70">Sur {totalPlots} parcelles</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#D4AF37]">Prêt à Récolter</CardTitle>
              <Calendar className="h-4 w-4 text-[#006633]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#F5F5DC]">{readyToHarvest}</div>
              <p className="text-xs text-[#F5F5DC]/70">Parcelle{readyToHarvest > 1 ? 's' : ''} récoltée{readyToHarvest > 1 ? 's' : ''}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#D4AF37]">Total Parcelles</CardTitle>
              <AlertCircle className="h-4 w-4 text-[#006633]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#F5F5DC]">{totalPlots}</div>
              <p className="text-xs text-[#F5F5DC]/70">Parcelle{totalPlots > 1 ? 's' : ''} enregistrée{totalPlots > 1 ? 's' : ''}</p>
            </CardContent>
          </Card>
        </div>

        <LazyFarmsClient farms={farms as Farm[]} />
      </div>
    </DashboardLayout>
  )
}
