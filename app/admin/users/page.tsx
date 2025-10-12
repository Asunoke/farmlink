"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"

interface User {
  id: string
  name: string
  email: string
  role: string
  subscription: string
  createdAt: string
  updatedAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    role: "",
    subscription: ""
  })
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
      setUsers([]) // S'assurer que users est toujours un tableau
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditData({
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: user.subscription
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!selectedUser) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const requestData = {
        ...editData,
        password: newPassword || undefined
      }
      
      console.log('Données envoyées:', requestData)
      
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        setSuccess("Utilisateur mis à jour avec succès")
        setIsEditing(false)
        setNewPassword("")
        fetchUsers()
      } else {
        const data = await response.json()
        console.error('Erreur API:', data)
        setError(data.error || `Erreur lors de la mise à jour (${response.status})`)
      }
    } catch (error) {
      setError("Erreur lors de la mise à jour")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSuccess("Utilisateur supprimé avec succès")
        fetchUsers()
      } else {
        setError("Erreur lors de la suppression")
      }
    } catch (error) {
      setError("Erreur lors de la suppression")
    }
  }

  const filteredUsers = Array.isArray(users) ? users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []

  const getRoleBadge = (role: string) => {
    const variants = {
      ADMIN: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      USER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    }
    return variants[role as keyof typeof variants] || variants.USER
  }

  const getSubscriptionBadge = (subscription: string) => {
    const variants = {
      FREE: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
      BASIC: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      BUSINESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      ENTERPRISE: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
    }
    return variants[subscription as keyof typeof variants] || variants.FREE
  }

  return (
    <AuthGuard requireAdmin>
      <AdminDashboardLayout>
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestion des utilisateurs
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gérez les comptes utilisateurs et leurs permissions
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20">
            <AlertDescription className="text-green-800 dark:text-green-300">
              {success}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Abonnement</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadge(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSubscriptionBadge(user.subscription)}>
                      {user.subscription}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Modifier l'utilisateur</DialogTitle>
                            <DialogDescription>
                              Modifiez les informations de {user.name}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {isEditing && selectedUser?.id === user.id && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name">Nom</Label>
                                  <Input
                                    id="name"
                                    value={editData.name}
                                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="email">Email</Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="role">Rôle</Label>
                                  <select
                                    id="role"
                                    value={editData.role}
                                    onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-slate-800"
                                  >
                                    <option value="USER">Utilisateur</option>
                                    <option value="ADMIN">Administrateur</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="subscription">Abonnement</Label>
                                  <select
                                    id="subscription"
                                    value={editData.subscription}
                                    onChange={(e) => setEditData(prev => ({ ...prev, subscription: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-slate-800"
                                  >
                                    <option value="FREE">Gratuit</option>
                                    <option value="BASIC">Basique</option>
                                    <option value="PREMIUM">Premium</option>
                                    <option value="BUSINESS">Business</option>
                                    <option value="ENTERPRISE">Entreprise</option>
                                  </select>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="password">Nouveau mot de passe (optionnel)</Label>
                                <div className="relative">
                                  <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Laissez vide pour ne pas changer"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </div>

                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setIsEditing(false)
                                    setNewPassword("")
                                  }}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Annuler
                                </Button>
                                <Button
                                  onClick={handleSave}
                                  disabled={loading}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  {loading ? "Sauvegarde..." : "Sauvegarder"}
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-700"
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
      </div>
      </AdminDashboardLayout>
    </AuthGuard>
  )
}
