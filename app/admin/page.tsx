"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { Users, Leaf, DollarSign, UserCheck, TrendingUp, Search, Trash2, Crown, AlertTriangle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface AdminStats {
  overview: {
    totalUsers: number
    totalFarms: number
    totalExpenses: number
    totalTeamMembers: number
    totalRevenue: number
  }
  usersBySubscription: Array<{
    subscription: string
    count: number
  }>
  recentUsers: Array<{
    id: string
    name: string
    email: string
    subscription: string
    createdAt: string
  }>
  monthlyGrowth: Array<{
    month: string
    users: number
  }>
}

interface User {
  id: string
  name: string
  email: string
  role: string
  subscription: string
  createdAt: string
  _count: {
    farms: number
    expenses: number
    teamMembers: number
  }
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [subscriptionFilter, setSubscriptionFilter] = useState("ALL")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      router.push("/dashboard")
      return
    }
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (!response.ok) throw new Error("Erreur lors du chargement des statistiques")
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    }
  }

  const fetchUsers = async (page = 1, search = "", subscription = "") => {
    setUsersLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(subscription && { subscription }),
      })

      const response = await fetch(`/api/admin/users?${params}`)
      if (!response.ok) throw new Error("Erreur lors du chargement des utilisateurs")

      const data = await response.json()
      setUsers(data.users)
      setTotalPages(data.pagination.pages)
      setCurrentPage(data.pagination.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setUsersLoading(false)
    }
  }

  const updateUserSubscription = async (userId: string, subscription: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      })

      if (!response.ok) throw new Error("Erreur lors de la mise à jour")

      // Refresh users list
      fetchUsers(currentPage, searchTerm, subscriptionFilter)
      fetchStats() // Refresh stats too
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erreur lors de la suppression")

      // Refresh users list
      fetchUsers(currentPage, searchTerm, subscriptionFilter)
      fetchStats() // Refresh stats too
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    }
  }

  useEffect(() => {
    if (session?.user && (session.user as any).role === "ADMIN") {
      Promise.all([fetchStats(), fetchUsers()]).finally(() => setLoading(false))
    }
  }, [session])

  useEffect(() => {
    if (session?.user && (session.user as any).role === "ADMIN") {
      fetchUsers(1, searchTerm, subscriptionFilter)
    }
  }, [searchTerm, subscriptionFilter])

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case "ENTREPRISE":
        return "bg-green-500 text-yellow-50"
      case "BUSINESS":
        return "bg-red-500 text-yellow-50"
      case "PREMIUM":
        return "bg-yellow-500 text-yellow-50"
      case "BASIC":
        return "bg-blue-500 text-blue-50"
      default:
        return "bg-gray-500 text-gray-50"
    }
  }

  const getRoleColor = (role: string) => {
    return role === "ADMIN" ? "bg-purple-500 text-purple-50" : "bg-green-500 text-green-50"
  }

  if (status === "loading" || loading) {
    return (
      <AdminDashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </AdminDashboardLayout>
    )
  }

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return null
  }

  if (error) {
    return (
      <AdminDashboardLayout>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </AdminDashboardLayout>
    )
  }

  return (
    <AuthGuard requireAdmin>
      <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance flex items-center gap-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              Administration
            </h1>
            <p className="text-muted-foreground">Tableau de bord administrateur - Gestion de la plateforme</p>
          </div>
        </div>

        {/* Overview Stats */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.overview.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Comptes créés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fermes Total</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.overview.totalFarms || 0}</div>
                <p className="text-xs text-muted-foreground">Parcelles créées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Équipe Total</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.overview.totalTeamMembers || 0}</div>
                <p className="text-xs text-muted-foreground">Membres d'équipe</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dépenses Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.overview.totalExpenses || 0}</div>
                <p className="text-xs text-muted-foreground">Transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus Estimés</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats.overview.totalRevenue || 0).toLocaleString('fr-FR')} FCFA</div>
                <p className="text-xs text-muted-foreground">Revenus mensuels</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Gestion Utilisateurs</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Utilisateurs</CardTitle>
                <CardDescription>Gérez les comptes utilisateurs et leurs abonnements</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrer par abonnement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les abonnements</SelectItem>
                      <SelectItem value="FREE">Gratuit</SelectItem>
                      <SelectItem value="BASIC">Basic</SelectItem>
                      <SelectItem value="PREMIUM">Premium</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                      <SelectItem value="ENTREPRISE">Entreprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Abonnement</TableHead>
                        <TableHead>Fermes</TableHead>
                        <TableHead>Équipe</TableHead>
                        <TableHead>Inscription</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            {Array.from({ length: 7 }).map((_, j) => (
                              <TableCell key={j}>
                                <Skeleton className="h-4 w-full" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Aucun utilisateur trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getRoleColor(user.role)}>
                                {user.role === "ADMIN" ? "Admin" : "Utilisateur"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={user.subscription}
                                onValueChange={(value) => updateUserSubscription(user.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="FREE">Gratuit</SelectItem>
                                  <SelectItem value="BASIC">Basic</SelectItem>
                                  <SelectItem value="PREMIUM">Premium</SelectItem>
                                  <SelectItem value="BUSINESS">Business</SelectItem>
                                  <SelectItem value="ENTREPRISE">Entreprise</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>{user._count?.farms || 0}</TableCell>
                            <TableCell>{user._count?.teamMembers || 0}</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteUser(user.id)}
                                  disabled={user.id === session.user?.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} sur {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchUsers(currentPage - 1, searchTerm, subscriptionFilter)}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchUsers(currentPage + 1, searchTerm, subscriptionFilter)}
                        disabled={currentPage === totalPages}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Paiements</CardTitle>
                <CardDescription>Gérez les paiements Orange Money et les abonnements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Gérez les paiements et vérifiez les abonnements
                  </p>
                  <Link href="/admin/payments">
                    <Button>
                      Accéder à la gestion des paiements
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {stats && (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Monthly Growth Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Croissance Mensuelle</CardTitle>
                    <CardDescription>Nouveaux utilisateurs par mois</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={stats.monthlyGrowth || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Subscription Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des Abonnements</CardTitle>
                    <CardDescription>Distribution des types d'abonnements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.usersBySubscription || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ subscription, count }) => `${subscription}: ${count}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {(stats.usersBySubscription || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Recent Users */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Utilisateurs Récents</CardTitle>
                    <CardDescription>Derniers comptes créés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(stats.recentUsers || []).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getSubscriptionColor(user.subscription)}>{user.subscription}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      </AdminDashboardLayout>
    </AuthGuard>
  )
}
