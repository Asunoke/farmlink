"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Users, Plus, Calendar, Clock, Phone, Mail, Edit, Star, TrendingUp, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface TeamMember {
  id: string
  name: string
  role: string
  salary?: number
  phone?: string
  email?: string
  hireDate: string
  createdAt: string
  updatedAt: string
}

interface Task {
  id: string
  title: string
  description?: string
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  dueDate?: string
  createdAt: string
  teamMemberId: string
  teamMember: {
    name: string
    role: string
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "CANCELLED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "LOW":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "URGENT":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const formatCurrency = (amount: number) => {
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " FCFA"
  )
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false)
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamMembers()
    fetchTasks()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/team")
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
        if (data.length > 0 && !selectedMember) {
          setSelectedMember(data[0])
        }
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des membres de l'équipe")
    } finally {
      setLoading(false)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des tâches")
    }
  }

  const handleAddMember = async (formData: FormData) => {
    try {
      const memberData = {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        salary: Number.parseFloat(formData.get("salary") as string) || undefined,
        hireDate: new Date().toISOString(),
      }

      const response = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberData),
      })

      if (response.ok) {
        toast.success("Membre ajouté avec succès")
        fetchTeamMembers()
        setIsAddMemberDialogOpen(false)
      } else {
        toast.error("Erreur lors de l'ajout du membre")
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout du membre")
    }
  }

  const handleAddTask = async (formData: FormData) => {
    try {
      const taskData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        priority: formData.get("priority") as string,
        dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string).toISOString() : undefined,
        teamMemberId: formData.get("teamMemberId") as string,
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        toast.success("Tâche assignée avec succès")
        fetchTasks()
        setIsAddTaskDialogOpen(false)
      } else {
        toast.error("Erreur lors de l'assignation de la tâche")
      }
    } catch (error) {
      toast.error("Erreur lors de l'assignation de la tâche")
    }
  }

  const handleEditMember = async (formData: FormData) => {
    if (!editingMember) return

    try {
      const memberData = {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        salary: Number.parseFloat(formData.get("salary") as string) || undefined,
      }

      const response = await fetch(`/api/team/${editingMember.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberData),
      })

      if (response.ok) {
        toast.success("Membre modifié avec succès")
        fetchTeamMembers()
        setIsEditMemberDialogOpen(false)
        setEditingMember(null)
      } else {
        toast.error("Erreur lors de la modification du membre")
      }
    } catch (error) {
      toast.error("Erreur lors de la modification du membre")
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) return

    try {
      const response = await fetch(`/api/team/${memberId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Membre supprimé avec succès")
        fetchTeamMembers()
        if (selectedMember?.id === memberId) {
          setSelectedMember(null)
        }
      } else {
        toast.error("Erreur lors de la suppression du membre")
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du membre")
    }
  }

  const handleEditTask = async (formData: FormData) => {
    if (!editingTask) return

    try {
      const taskData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        priority: formData.get("priority") as string,
        status: formData.get("status") as string,
        dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string).toISOString() : undefined,
        teamMemberId: formData.get("teamMemberId") as string,
      }

      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        toast.success("Tâche modifiée avec succès")
        fetchTasks()
        setIsEditTaskDialogOpen(false)
        setEditingTask(null)
      } else {
        toast.error("Erreur lors de la modification de la tâche")
      }
    } catch (error) {
      toast.error("Erreur lors de la modification de la tâche")
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) return

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Tâche supprimée avec succès")
        fetchTasks()
      } else {
        toast.error("Erreur lors de la suppression de la tâche")
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de la tâche")
    }
  }

  const totalSalaries = teamMembers.reduce((sum, member) => sum + (member.salary || 0), 0)
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED").length
  const pendingTasks = tasks.filter((task) => task.status === "PENDING" || task.status === "IN_PROGRESS").length

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Gestion d'Équipe</h1>
            <p className="text-muted-foreground">Gérez votre équipe et assignez les tâches agricoles</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Tâche
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Assigner une Nouvelle Tâche</DialogTitle>
                  <DialogDescription>Créez et assignez une tâche à un membre de l'équipe.</DialogDescription>
                </DialogHeader>
                <form action={handleAddTask} className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-title">Titre de la tâche</Label>
                    <Input name="title" id="task-title" placeholder="Ex: Arrosage Parcelle C" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea name="description" id="task-description" placeholder="Détails de la tâche..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Assigné à</Label>
                      <Select name="teamMemberId" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Priorité</Label>
                      <Select name="priority" defaultValue="MEDIUM">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HIGH">Haute</SelectItem>
                          <SelectItem value="MEDIUM">Moyenne</SelectItem>
                          <SelectItem value="LOW">Basse</SelectItem>
                          <SelectItem value="URGENT">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="due-date">Date limite</Label>
                    <Input name="dueDate" id="due-date" type="date" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">Assigner la Tâche</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Membre
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un Membre d'Équipe</DialogTitle>
                  <DialogDescription>Enregistrez un nouveau membre dans votre équipe agricole.</DialogDescription>
                </DialogHeader>
                <form action={handleAddMember} className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="member-name">Nom complet</Label>
                      <Input name="name" id="member-name" placeholder="Ex: Sekou Diallo" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="member-role">Rôle</Label>
                      <Input name="role" id="member-role" placeholder="Ex: Ouvrier agricole" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input name="phone" id="phone" placeholder="+223 XX XX XX XX" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input name="email" id="email" type="email" placeholder="email@farmlink.ml" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="salary">Salaire mensuel (FCFA)</Label>
                    <Input name="salary" id="salary" type="number" placeholder="0" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">Ajouter le Membre</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Team Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Équipe</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">{teamMembers.length} membres actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Masse Salariale</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSalaries)}</div>
              <p className="text-xs text-muted-foreground">Par mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tâches Terminées</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tâches Actives</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <p className="text-xs text-muted-foreground">En cours</p>
            </CardContent>
          </Card>
        </div>

        {teamMembers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun membre d'équipe</h3>
              <p className="text-muted-foreground text-center mb-4">
                Commencez par ajouter des membres à votre équipe pour gérer vos tâches agricoles.
              </p>
              <Button onClick={() => setIsAddMemberDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un membre
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Team Members List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Membres de l'Équipe</CardTitle>
                  <CardDescription>Cliquez sur un membre pour voir les détails</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedMember?.id === member.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            >
                              Actif
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Member Details */}
            {selectedMember && (
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg" alt={selectedMember.name} />
                          <AvatarFallback>
                            {selectedMember.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{selectedMember.name}</CardTitle>
                          <CardDescription>{selectedMember.role}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingMember(selectedMember)
                            setIsEditMemberDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteMember(selectedMember.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {selectedMember.phone && (
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="profile" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Profil</TabsTrigger>
                        <TabsTrigger value="tasks">Tâches</TabsTrigger>
                      </TabsList>

                      <TabsContent value="profile" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            {selectedMember.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{selectedMember.phone}</span>
                              </div>
                            )}
                            {selectedMember.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{selectedMember.email}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Embauché le {new Date(selectedMember.hireDate).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {selectedMember.salary && (
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">Salaire mensuel:</span>
                                <span className="text-sm text-muted-foreground">
                                  {formatCurrency(selectedMember.salary)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="tasks" className="space-y-4">
                        <div className="space-y-3">
                          {tasks
                            .filter((task) => task.teamMember.name === selectedMember.name)
                            .map((task) => (
                              <div key={task.id} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-sm">{task.title}</h4>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setEditingTask(task)
                                        setIsEditTaskDialogOpen(true)
                                      }}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteTask(task.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                    <Badge variant="secondary">
                                      {task.priority === "HIGH"
                                        ? "Haute"
                                        : task.priority === "MEDIUM"
                                          ? "Moyenne"
                                          : task.priority === "URGENT"
                                            ? "Urgente"
                                            : "Basse"}
                                    </Badge>
                                    <Badge variant="secondary">
                                      {task.status === "COMPLETED"
                                        ? "Terminée"
                                        : task.status === "IN_PROGRESS"
                                          ? "En cours"
                                          : task.status === "CANCELLED"
                                            ? "Annulée"
                                            : "En attente"}
                                    </Badge>
                                  </div>
                                </div>
                                {task.description && (
                                  <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                                )}
                                {task.dueDate && (
                                  <div className="text-xs text-muted-foreground">
                                    Échéance: {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                                  </div>
                                )}
                              </div>
                            ))}
                          {tasks.filter((task) => task.teamMember.name === selectedMember.name).length === 0 && (
                            <p className="text-muted-foreground text-center py-4">Aucune tâche assignée</p>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Tasks Overview */}
        {tasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tâches en Cours</CardTitle>
              <CardDescription>Vue d'ensemble des tâches assignées à l'équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tâche</TableHead>
                    <TableHead>Assigné à</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{task.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {task.teamMember.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{task.teamMember.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {task.priority === "HIGH"
                            ? "Haute"
                            : task.priority === "MEDIUM"
                              ? "Moyenne"
                              : task.priority === "URGENT"
                                ? "Urgente"
                                : "Basse"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {task.status === "COMPLETED"
                            ? "Terminée"
                            : task.status === "IN_PROGRESS"
                              ? "En cours"
                              : task.status === "CANCELLED"
                                ? "Annulée"
                                : "En attente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString("fr-FR") : "Non définie"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTask(task)
                              setIsEditTaskDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Edit Member Dialog */}
        <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier le Membre d'Équipe</DialogTitle>
              <DialogDescription>Modifiez les informations du membre de votre équipe.</DialogDescription>
            </DialogHeader>
            <form action={handleEditMember} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-member-name">Nom complet</Label>
                  <Input 
                    name="name" 
                    id="edit-member-name" 
                    placeholder="Ex: Sekou Diallo" 
                    defaultValue={editingMember?.name}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-member-role">Rôle</Label>
                  <Input 
                    name="role" 
                    id="edit-member-role" 
                    placeholder="Ex: Ouvrier agricole" 
                    defaultValue={editingMember?.role}
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Téléphone</Label>
                  <Input 
                    name="phone" 
                    id="edit-phone" 
                    placeholder="+223 XX XX XX XX" 
                    defaultValue={editingMember?.phone}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    name="email" 
                    id="edit-email" 
                    type="email" 
                    placeholder="email@farmlink.ml" 
                    defaultValue={editingMember?.email}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-salary">Salaire mensuel (FCFA)</Label>
                <Input 
                  name="salary" 
                  id="edit-salary" 
                  type="number" 
                  placeholder="0" 
                  defaultValue={editingMember?.salary}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditMemberDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Modifier le Membre</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog open={isEditTaskDialogOpen} onOpenChange={setIsEditTaskDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier la Tâche</DialogTitle>
              <DialogDescription>Modifiez les détails de la tâche assignée.</DialogDescription>
            </DialogHeader>
            <form action={handleEditTask} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-task-title">Titre de la tâche</Label>
                <Input 
                  name="title" 
                  id="edit-task-title" 
                  placeholder="Ex: Arrosage Parcelle C" 
                  defaultValue={editingTask?.title}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-task-description">Description</Label>
                <Textarea 
                  name="description" 
                  id="edit-task-description" 
                  placeholder="Détails de la tâche..." 
                  defaultValue={editingTask?.description}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Assigné à</Label>
                  <Select name="teamMemberId" defaultValue={editingTask?.teamMemberId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Priorité</Label>
                  <Select name="priority" defaultValue={editingTask?.priority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH">Haute</SelectItem>
                      <SelectItem value="MEDIUM">Moyenne</SelectItem>
                      <SelectItem value="LOW">Basse</SelectItem>
                      <SelectItem value="URGENT">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Statut</Label>
                  <Select name="status" defaultValue={editingTask?.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">En attente</SelectItem>
                      <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                      <SelectItem value="COMPLETED">Terminée</SelectItem>
                      <SelectItem value="CANCELLED">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-due-date">Date limite</Label>
                  <Input 
                    name="dueDate" 
                    id="edit-due-date" 
                    type="date" 
                    defaultValue={editingTask?.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditTaskDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Modifier la Tâche</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
