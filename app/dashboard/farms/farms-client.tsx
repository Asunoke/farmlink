"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Leaf, MapPin, Calendar, Droplets, Thermometer, TrendingUp, AlertCircle, Edit, Eye, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

type PlotStatus = "PREPARATION" | "PLANTED" | "GROWING" | "HARVESTED" | "FALLOW"

interface Plot {
  id: string
  name: string
  area: number
  cropType: string
  plantedDate: string | null
  harvestDate: string | null
  status: PlotStatus
  farmId: string
  createdAt: string
  updatedAt: string
  farm?: {
    name: string
    location: string
  }
}

interface Farm {
  id: string
  name: string
  location: string
  totalArea: number
  userId: string
  createdAt: string
  updatedAt: string
  plots: Plot[]
  _count?: {
    plots: number
  }
  // Propriétés optionnelles utilisées dans le code mais pas dans le schéma Prisma
  crop?: string
  plantingDate?: string
  harvestDate?: string
  notes?: string
}

interface FarmsClientProps {
  farms: Farm[]
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

export function FarmsClient({ farms: initialFarms }: FarmsClientProps) {
  const [farms, setFarms] = useState<Farm[]>(initialFarms)
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(initialFarms.length > 0 ? initialFarms[0] : null)
  const [isAddFarmDialogOpen, setIsAddFarmDialogOpen] = useState(false)
  const [isEditFarmDialogOpen, setIsEditFarmDialogOpen] = useState(false)
  const [isAddPlotDialogOpen, setIsAddPlotDialogOpen] = useState(false)
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null)
  const [editingPlot, setEditingPlot] = useState<any>(null)
  const [isEditPlotDialogOpen, setIsEditPlotDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const refreshFarms = async () => {
    try {
      const response = await fetch('/api/farms')
      if (response.ok) {
        const data = await response.json()
        setFarms(data)
        if (data.length > 0 && !selectedFarm) {
          setSelectedFarm(data[0])
        }
      }
    } catch (error) {
      toast.error("Erreur lors du rechargement des données")
    }
  }

  const handleAddFarm = async (formData: FormData) => {
    setLoading(true)
    try {
      const farmData = {
        name: formData.get("name") as string,
        crop: formData.get("crop") as string,
        area: Number.parseFloat(formData.get("area") as string),
        location: formData.get("location") as string,
        plantingDate: new Date(formData.get("plantingDate") as string).toISOString(),
        harvestDate: new Date(formData.get("harvestDate") as string).toISOString(),
        notes: formData.get("notes") as string,
      }

      const response = await fetch("/api/farms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(farmData),
      })

      if (response.ok) {
        toast.success("Ferme créée avec succès")
        await refreshFarms()
        setIsAddFarmDialogOpen(false)
      } else {
        const error = await response.json()
        toast.error(error.error || "Erreur lors de la création de la ferme")
      }
    } catch (error) {
      toast.error("Erreur lors de la création de la ferme")
    } finally {
      setLoading(false)
    }
  }

  const handleEditFarm = async (formData: FormData) => {
    if (!editingFarm) return
    
    setLoading(true)
    try {
      const farmData = {
        name: formData.get("name") as string,
        crop: formData.get("crop") as string,
        area: Number.parseFloat(formData.get("area") as string),
        location: formData.get("location") as string,
        plantingDate: new Date(formData.get("plantingDate") as string).toISOString(),
        harvestDate: new Date(formData.get("harvestDate") as string).toISOString(),
        notes: formData.get("notes") as string,
      }

      const response = await fetch(`/api/farms/${editingFarm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(farmData),
      })

      if (response.ok) {
        toast.success("Ferme mise à jour avec succès")
        await refreshFarms()
        setIsEditFarmDialogOpen(false)
        setEditingFarm(null)
      } else {
        const error = await response.json()
        toast.error(error.error || "Erreur lors de la mise à jour de la ferme")
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la ferme")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFarm = async (farmId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/farms/${farmId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Ferme supprimée avec succès")
        await refreshFarms()
        if (selectedFarm?.id === farmId) {
          setSelectedFarm(null)
        }
      } else {
        const error = await response.json()
        toast.error(error.error || "Erreur lors de la suppression de la ferme")
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de la ferme")
    } finally {
      setLoading(false)
    }
  }

  const handleAddPlot = async (formData: FormData) => {
    if (!selectedFarm) return
    
    setLoading(true)
    try {
      const plotData = {
        name: formData.get("name") as string,
        area: Number.parseFloat(formData.get("area") as string),
        cropType: formData.get("cropType") as string,
        status: formData.get("status") as string,
        plantedDate: formData.get("plantedDate") ? new Date(formData.get("plantedDate") as string).toISOString() : undefined,
        harvestDate: formData.get("harvestDate") ? new Date(formData.get("harvestDate") as string).toISOString() : undefined,
        farmId: selectedFarm.id,
      }

      const response = await fetch("/api/plots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plotData),
      })

      if (response.ok) {
        toast.success("Parcelle créée avec succès")
        await refreshFarms()
        setIsAddPlotDialogOpen(false)
      } else {
        const error = await response.json()
        toast.error(error.error || "Erreur lors de la création de la parcelle")
      }
    } catch (error) {
      toast.error("Erreur lors de la création de la parcelle")
    } finally {
      setLoading(false)
    }
  }

  const handleEditPlot = async (formData: FormData) => {
    if (!editingPlot) return
    
    setLoading(true)
    try {
      const plantedDateValue = formData.get("plantedDate") as string
      const harvestDateValue = formData.get("harvestDate") as string
      
      const plotData = {
        name: formData.get("name") as string,
        area: Number.parseFloat(formData.get("area") as string),
        cropType: formData.get("cropType") as string,
        status: formData.get("status") as string,
        plantedDate: plantedDateValue || '',
        harvestDate: harvestDateValue || '',
      }

      const response = await fetch(`/api/plots/${editingPlot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plotData),
      })

      if (response.ok) {
        toast.success("Parcelle mise à jour avec succès")
        await refreshFarms()
        setIsEditPlotDialogOpen(false)
        setEditingPlot(null)
      } else {
        const error = await response.json()
        toast.error(error.error || "Erreur lors de la mise à jour de la parcelle")
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la parcelle")
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlot = async (plotId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/plots/${plotId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Parcelle supprimée avec succès")
        await refreshFarms()
      } else {
        const error = await response.json()
        toast.error(error.error || "Erreur lors de la suppression de la parcelle")
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de la parcelle")
    } finally {
      setLoading(false)
    }
  }

  const openEditPlot = (plot: any) => {
    setEditingPlot(plot)
    setIsEditPlotDialogOpen(true)
  }

  if (farms.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Leaf className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune ferme enregistrée</h3>
          <p className="text-muted-foreground text-center mb-4">
            Commencez par créer votre première ferme pour gérer vos parcelles et cultures.
          </p>
          <Dialog open={isAddFarmDialogOpen} onOpenChange={setIsAddFarmDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Créer ma première ferme
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer une Nouvelle Ferme</DialogTitle>
                <DialogDescription>Créez votre première ferme pour commencer à gérer vos cultures.</DialogDescription>
              </DialogHeader>
              <form action={handleAddFarm} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom de la ferme</Label>
                  <Input 
                    name="name" 
                    id="name" 
                    placeholder="Ex: Ferme de Bamako" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="crop">Culture principale</Label>
                    <Input 
                      name="crop" 
                      id="crop" 
                      placeholder="Ex: Mil" 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="area">Surface totale (ha)</Label>
                    <Input 
                      name="area" 
                      id="area" 
                      type="number" 
                      step="0.1"
                      placeholder="0.0" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input 
                    name="location" 
                    id="location" 
                    placeholder="Ex: Bamako, Mali" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="plantingDate">Date de plantation</Label>
                    <Input 
                      name="plantingDate" 
                      id="plantingDate" 
                      type="date" 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="harvestDate">Date de récolte prévue</Label>
                    <Input 
                      name="harvestDate" 
                      id="harvestDate" 
                      type="date" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    name="notes" 
                    id="notes" 
                    placeholder="Observations, remarques..." 
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddFarmDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Création..." : "Créer la ferme"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Farm List */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Mes Fermes</CardTitle>
                <CardDescription>Cliquez sur une ferme pour voir les détails</CardDescription>
              </div>
              <Dialog open={isAddFarmDialogOpen} onOpenChange={setIsAddFarmDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Créer une Nouvelle Ferme</DialogTitle>
                    <DialogDescription>Créez une nouvelle ferme pour gérer vos cultures.</DialogDescription>
                  </DialogHeader>
                  <form action={handleAddFarm} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nom de la ferme</Label>
                      <Input 
                        name="name" 
                        id="name" 
                        placeholder="Ex: Ferme de Bamako" 
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="crop">Culture principale</Label>
                        <Input 
                          name="crop" 
                          id="crop" 
                          placeholder="Ex: Mil" 
                          required 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="area">Surface totale (ha)</Label>
                        <Input 
                          name="area" 
                          id="area" 
                          type="number" 
                          step="0.1"
                          placeholder="0.0" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Localisation</Label>
                      <Input 
                        name="location" 
                        id="location" 
                        placeholder="Ex: Bamako, Mali" 
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="plantingDate">Date de plantation</Label>
                        <Input 
                          name="plantingDate" 
                          id="plantingDate" 
                          type="date" 
                          required 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="harvestDate">Date de récolte prévue</Label>
                        <Input 
                          name="harvestDate" 
                          id="harvestDate" 
                          type="date" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea 
                        name="notes" 
                        id="notes" 
                        placeholder="Observations, remarques..." 
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddFarmDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Création..." : "Créer la ferme"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {farms.map((farm) => (
              <div
                key={farm.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedFarm?.id === farm.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}
                onClick={() => setSelectedFarm(farm)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{farm.name}</h4>
                  <Badge variant="secondary">
                    {farm.plots.length} parcelle{farm.plots.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{farm.totalArea} ha</span>
                  <span>{farm.crop}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  {farm.location}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Farm Details */}
      {selectedFarm && (
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    {selectedFarm.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {selectedFarm.location}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isEditFarmDialogOpen} onOpenChange={setIsEditFarmDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingFarm(selectedFarm)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Modifier la Ferme</DialogTitle>
                        <DialogDescription>Modifiez les informations de votre ferme.</DialogDescription>
                      </DialogHeader>
                      <form action={handleEditFarm} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-name">Nom de la ferme</Label>
                          <Input 
                            name="name" 
                            id="edit-name" 
                            defaultValue={editingFarm?.name}
                            placeholder="Ex: Ferme de Bamako" 
                            required 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-crop">Culture principale</Label>
                            <Input 
                              name="crop" 
                              id="edit-crop" 
                              defaultValue={editingFarm?.crop}
                              placeholder="Ex: Mil" 
                              required 
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-area">Surface totale (ha)</Label>
                            <Input 
                              name="area" 
                              id="edit-area" 
                              type="number" 
                              step="0.1"
                              defaultValue={editingFarm?.totalArea}
                              placeholder="0.0" 
                              required 
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-location">Localisation</Label>
                          <Input 
                            name="location" 
                            id="edit-location" 
                            defaultValue={editingFarm?.location}
                            placeholder="Ex: Bamako, Mali" 
                            required 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-planting-date">Date de plantation</Label>
                            <Input 
                              name="plantingDate" 
                              id="edit-planting-date" 
                              type="date" 
                              defaultValue={editingFarm?.plantingDate ? new Date(editingFarm.plantingDate).toISOString().split('T')[0] : ''}
                              required 
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-harvest-date">Date de récolte prévue</Label>
                            <Input 
                              name="harvestDate" 
                              id="edit-harvest-date" 
                              type="date" 
                              defaultValue={editingFarm?.harvestDate ? new Date(editingFarm.harvestDate).toISOString().split('T')[0] : ''}
                              required 
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-notes">Notes</Label>
                          <Textarea 
                            name="notes" 
                            id="edit-notes" 
                            defaultValue={editingFarm?.notes}
                            placeholder="Observations, remarques..." 
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsEditFarmDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {loading ? "Mise à jour..." : "Mettre à jour"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer la ferme</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer la ferme "{selectedFarm?.name}" ? 
                          Cette action supprimera également toutes les parcelles associées et ne peut pas être annulée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => selectedFarm && handleDeleteFarm(selectedFarm.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="plots">Parcelles</TabsTrigger>
                  <TabsTrigger value="history">Historique</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Culture principale:</span>
                        <span className="text-sm text-muted-foreground">{selectedFarm.crop}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Surface totale:</span>
                        <span className="text-sm text-muted-foreground">{selectedFarm.totalArea} hectares</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Nombre de parcelles:</span>
                        <span className="text-sm text-muted-foreground">{selectedFarm.plots.length}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Date plantation:</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedFarm.plantingDate ? new Date(selectedFarm.plantingDate).toLocaleDateString("fr-FR") : "Non définie"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Récolte prévue:</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedFarm.harvestDate ? new Date(selectedFarm.harvestDate).toLocaleDateString("fr-FR") : "Non définie"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Créée le:</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(selectedFarm.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedFarm.notes && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Notes et observations</Label>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">{selectedFarm.notes}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="plots" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Parcelles</h3>
                    <Dialog open={isAddPlotDialogOpen} onOpenChange={setIsAddPlotDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une parcelle
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Ajouter une Parcelle</DialogTitle>
                          <DialogDescription>Créez une nouvelle parcelle pour la ferme "{selectedFarm?.name}".</DialogDescription>
                        </DialogHeader>
                        <form action={handleAddPlot} className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="plot-name">Nom de la parcelle</Label>
                            <Input 
                              name="name" 
                              id="plot-name" 
                              placeholder="Ex: Parcelle A - Mil" 
                              required 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="plot-crop">Type de culture</Label>
                              <Select name="cropType" required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Mil">Mil</SelectItem>
                                  <SelectItem value="Sorgho">Sorgho</SelectItem>
                                  <SelectItem value="Maïs">Maïs</SelectItem>
                                  <SelectItem value="Arachide">Arachide</SelectItem>
                                  <SelectItem value="Coton">Coton</SelectItem>
                                  <SelectItem value="Riz">Riz</SelectItem>
                                  <SelectItem value="Autre">Autre</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="plot-area">Surface (ha)</Label>
                              <Input 
                                name="area" 
                                id="plot-area" 
                                type="number" 
                                step="0.1"
                                placeholder="0.0" 
                                required 
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="plot-status">Statut</Label>
                            <Select name="status" defaultValue="PREPARATION">
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PREPARATION">Préparation</SelectItem>
                                <SelectItem value="PLANTED">Semis</SelectItem>
                                <SelectItem value="GROWING">Croissance</SelectItem>
                                <SelectItem value="HARVESTED">Récolté</SelectItem>
                                <SelectItem value="FALLOW">En jachère</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="plot-planting-date">Date de plantation</Label>
                              <Input 
                                name="plantedDate" 
                                id="plot-planting-date" 
                                type="date" 
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="plot-harvest-date">Date de récolte prévue</Label>
                              <Input 
                                name="harvestDate" 
                                id="plot-harvest-date" 
                                type="date" 
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsAddPlotDialogOpen(false)}>
                              Annuler
                            </Button>
                            <Button type="submit" disabled={loading}>
                              {loading ? "Création..." : "Créer la parcelle"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedFarm.plots.length > 0 ? (
                      selectedFarm.plots.map((plot) => (
                        <div key={plot.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-sm">{plot.name}</h4>
                              <p className="text-xs text-muted-foreground">{plot.cropType} - {plot.area} ha</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(plot.status)} variant="secondary">
                                {getStatusText(plot.status)}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditPlot(plot)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeletePlot(plot.id)}
                                disabled={loading}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Progression</span>
                              <span>{getProgressValue(plot.status)}%</span>
                            </div>
                            <Progress value={getProgressValue(plot.status)} className="h-2" />
                          </div>
                          {plot.plantedDate && (
                            <div className="text-xs text-muted-foreground mt-2">
                              Planté le {new Date(plot.plantedDate).toLocaleDateString("fr-FR")}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Leaf className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Aucune parcelle enregistrée</p>
                        <p className="text-xs">Ajoutez des parcelles à cette ferme</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Ferme créée</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(selectedFarm.createdAt).toLocaleDateString("fr-FR")} - {selectedFarm.name}
                        </p>
                      </div>
                    </div>

                    {selectedFarm.plots.map((plot) => (
                      <div key={plot.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Parcelle ajoutée</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(plot.createdAt).toLocaleDateString("fr-FR")} - {plot.name} ({plot.cropType})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Plot Dialog */}
      <Dialog open={isEditPlotDialogOpen} onOpenChange={setIsEditPlotDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier la Parcelle</DialogTitle>
            <DialogDescription>Mettez à jour les informations de la parcelle.</DialogDescription>
          </DialogHeader>
          <form action={handleEditPlot} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-plot-name">Nom de la parcelle</Label>
              <Input 
                name="name" 
                id="edit-plot-name" 
                defaultValue={editingPlot?.name}
                placeholder="Ex: Parcelle A - Mil" 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-plot-crop">Type de culture</Label>
                <Select name="cropType" defaultValue={editingPlot?.cropType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mil">Mil</SelectItem>
                    <SelectItem value="Sorgho">Sorgho</SelectItem>
                    <SelectItem value="Maïs">Maïs</SelectItem>
                    <SelectItem value="Arachide">Arachide</SelectItem>
                    <SelectItem value="Coton">Coton</SelectItem>
                    <SelectItem value="Riz">Riz</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-plot-area">Surface (ha)</Label>
                <Input 
                  name="area" 
                  id="edit-plot-area" 
                  type="number" 
                  step="0.1"
                  defaultValue={editingPlot?.area}
                  placeholder="0.0" 
                  required 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-plot-status">Statut</Label>
              <Select name="status" defaultValue={editingPlot?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PREPARATION">Préparation</SelectItem>
                  <SelectItem value="PLANTED">Semis</SelectItem>
                  <SelectItem value="GROWING">Croissance</SelectItem>
                  <SelectItem value="HARVESTED">Récolté</SelectItem>
                  <SelectItem value="FALLOW">En jachère</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-plot-planting-date">Date de plantation</Label>
                <Input 
                  name="plantedDate" 
                  id="edit-plot-planting-date" 
                  type="date" 
                  defaultValue={editingPlot?.plantedDate ? new Date(editingPlot.plantedDate).toISOString().split('T')[0] : ''}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-plot-harvest-date">Date de récolte prévue</Label>
                <Input 
                  name="harvestDate" 
                  id="edit-plot-harvest-date" 
                  type="date" 
                  defaultValue={editingPlot?.harvestDate ? new Date(editingPlot.harvestDate).toISOString().split('T')[0] : ''}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditPlotDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
