"use client"

import { useEffect, useState } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Calculator,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const categoryLabelToEnum: Record<string, string> = {
  "Semences": "SEEDS",
  "Engrais": "FERTILIZER",
  "Équipement": "EQUIPMENT",
  "Main d'œuvre": "LABOR",
  "Carburant": "FUEL",
  "Maintenance": "MAINTENANCE",
  "Autres": "OTHER",
}

const categoryEnumToLabel: Record<string, string> = Object.fromEntries(
  Object.entries(categoryLabelToEnum).map(([k, v]) => [v, k])
)

const expenseCategories = [
  "Semences",
  "Engrais",
  "Main d'œuvre",
  "Équipement",
  "Carburant",
  "Maintenance",
  "Autres",
]

const revenueCategories = [
  "Vente de récoltes",
  "Subventions",
  "Location d'équipement",
  "Services agricoles",
  "Autres",
]


type ExpenseApi = {
  id: string
  description: string
  amount: number
  category: string
  date: string
  type: string
  plot?: { id: string; name: string }
}

const breakdownColors: Record<string, string> = {
  "Engrais": "#006633",
  "Main d'œuvre": "#D4AF37",
  "Semences": "#C1440E",
  "Carburant": "#F5F5DC",
  "Équipement": "#0B1623",
  "Maintenance": "#006633",
  "Pesticides": "#D4AF37",
  "Transport": "#C1440E",
  "Irrigation": "#006633",
  "Autres": "#F5F5DC",
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

export default function BudgetPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<"expense" | "revenue">("expense")
  const [transactions, setTransactions] = useState<ExpenseApi[]>([])
  const [loading, setLoading] = useState(false)
  const [formCategory, setFormCategory] = useState<string>("")
  const [formAmount, setFormAmount] = useState<string>("")
  const [formDate, setFormDate] = useState<string>("")
  const [formDescription, setFormDescription] = useState<string>("")
  const [plots, setPlots] = useState<{ id: string; name: string }[]>([])
  const [formPlotId, setFormPlotId] = useState<string>("")
  const [formType, setFormType] = useState<"EXPENSE" | "REVENUE">("EXPENSE")
  const [editing, setEditing] = useState<ExpenseApi | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<string>("")
  const [editAmount, setEditAmount] = useState<string>("")
  const [editDate, setEditDate] = useState<string>("")
  const [editDescription, setEditDescription] = useState<string>("")

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const res = await fetch("/api/expenses")
        if (!res.ok) return
        const data: ExpenseApi[] = await res.json()
        // Filtrer les appels API météo et autres transactions système
        const filtered = data.filter(t => !t.description.includes('weather_api_call'))
        // sort desc by date
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setTransactions(filtered)
      } catch (e) {
        // ignore
      }
    }
    loadExpenses()
  }, [])

  useEffect(() => {
    const loadPlots = async () => {
      try {
        const res = await fetch("/api/plots")
        if (!res.ok) return
        const data = await res.json()
        const mapped = (data || []).map((p: any) => ({ id: p.id, name: p.name }))
        setPlots(mapped)
      } catch {}
    }
    if (isAddDialogOpen) {
      loadPlots()
    }
  }, [isAddDialogOpen])

  // Pré-remplir la modale avec des valeurs valides
  useEffect(() => {
    if (isAddDialogOpen) {
      if (!formCategory) setFormCategory(expenseCategories[0])
      if (!formDate) setFormDate(new Date().toISOString().split('T')[0])
    }
  }, [isAddDialogOpen])

  const handleCreateTransaction = async () => {
    setLoading(true)
    try {
      const amountNum = Number.parseFloat(String(formAmount).replace(/[^\d.]/g, ""))
      const categoryEnum = categoryLabelToEnum[formCategory] ?? "OTHER"
      const isoDate = formDate ? new Date(formDate).toISOString() : ""

      if (!formDescription || !formCategory || !formDate || !Number.isFinite(amountNum) || amountNum <= 0) {
        setLoading(false)
        return
      }

      const payload = {
        description: formDescription,
        amount: amountNum,
        category: formType === "REVENUE" ? "OTHER" : categoryEnum,
        date: isoDate,
        type: formType,
        plotId: formPlotId || undefined,
      }
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        // Option 1: refetch to stay consistent with server ordering
        const created: ExpenseApi = await res.json()
        setTransactions((prev) => {
          const next = [created, ...prev]
          next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          return next
        })
        setIsAddDialogOpen(false)
        setFormCategory("")
        setFormAmount("")
        setFormDate("")
        setFormDescription("")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" })
      if (res.ok) {
        setTransactions((prev) => prev.filter((e) => e.id !== id))
      }
    } finally {
      setLoading(false)
    }
  }

  const openEdit = (expense: ExpenseApi) => {
    setEditing(expense)
    setEditCategory(categoryEnumToLabel[expense.category] ?? expense.category)
    setEditAmount(String(expense.amount))
    setEditDate(expense.date.split("T")[0])
    setEditDescription(expense.description)
    setIsEditDialogOpen(true)
  }

  const handleUpdateExpense = async () => {
    if (!editing) return
    setLoading(true)
    try {
      const payload: any = {
        description: editDescription,
        amount: Number(editAmount || 0),
        category: categoryLabelToEnum[editCategory] ?? editCategory,
        date: new Date(editDate).toISOString(),
      }
      const res = await fetch(`/api/expenses/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const updated: ExpenseApi = await res.json()
        setTransactions((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
        setIsEditDialogOpen(false)
        setEditing(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const csvData = [
      ["Date", "Type", "Catégorie", "Description", "Parcelle", "Montant (FCFA)"],
      ...transactions.map((t) => [
        new Date(t.date).toLocaleDateString("fr-FR"),
        t.type === "REVENUE" ? "Revenu" : "Dépense",
        categoryEnumToLabel[t.category] ?? t.category,
        t.description,
        t.plot?.name ?? "—",
        t.amount.toString(),
      ]),
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `transactions-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalRevenue = transactions.filter((t) => t.type === "REVENUE").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0)
  const netProfit = totalRevenue - totalExpenses

  // Build last 9 months timeline
  const months: { key: string; label: string; year: number; month: number }[] = (() => {
    const arr: { key: string; label: string; year: number; month: number }[] = []
    const d = new Date()
    for (let i = 0; i < 9; i++) {
      const dt = new Date(d.getFullYear(), d.getMonth() - (8 - i), 1)
      const label = dt.toLocaleString("fr-FR", { month: "short" })
      const key = `${dt.getFullYear()}-${dt.getMonth()}`
      arr.push({ key, label, year: dt.getFullYear(), month: dt.getMonth() })
    }
    return arr
  })()

  const monthlyData = months.map(({ key, label, year, month }) => {
    const monthTransactions = transactions.filter((t) => {
      const d = new Date(t.date)
      return d.getFullYear() === year && d.getMonth() === month
    })
    
    const revenus = monthTransactions
      .filter((t) => t.type === "REVENUE")
      .reduce((sum, t) => sum + t.amount, 0)
    
    const depenses = monthTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0)
    
    return { 
      month: label.charAt(0).toUpperCase() + label.slice(1), 
      revenus, 
      depenses 
    }
  })

  // Breakdown for the current month
  const now = new Date()
  const currentMonthItems = transactions.filter((t) => {
    const d = new Date(t.date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
  const breakdownMap = currentMonthItems.reduce<Record<string, number>>((acc, t) => {
    const label = categoryEnumToLabel[t.category] ?? t.category
    acc[label] = (acc[label] || 0) + t.amount
    return acc
  }, {})
  const expenseBreakdown = Object.entries(breakdownMap).map(([name, value]) => ({
    name,
    value,
    color: breakdownColors[name] ?? "#94a3b8",
  }))

  const canSubmitCreate =
    formDescription.trim().length > 0 &&
    formCategory.trim().length > 0 &&
    formDate.trim().length > 0 &&
    Number.isFinite(Number.parseFloat(String(formAmount).replace(/[^\d.]/g, ""))) &&
    Number.parseFloat(String(formAmount).replace(/[^\d.]/g, "")) > 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance text-[#D4AF37]">Budget & Dépenses</h1>
            <p className="text-[#F5F5DC]/70">Suivez vos finances agricoles en temps réel</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#006633] hover:bg-[#C1440E] text-white transition-all duration-300 hover:scale-105">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Dépense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-[#0B1623] border border-[#D4AF37]/30">
                <DialogHeader>
                  <DialogTitle className="text-[#D4AF37]">Ajouter une Dépense</DialogTitle>
                  <DialogDescription className="text-[#F5F5DC]/80">Enregistrez une nouvelle dépense.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label className="text-[#F5F5DC]">Type de transaction</Label>
                    <Select value={formType} onValueChange={(v: "EXPENSE" | "REVENUE") => setFormType(v)}>
                      <SelectTrigger className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0B1623] border border-[#D4AF37]/30">
                        <SelectItem value="EXPENSE" className="text-[#F5F5DC] hover:bg-[#006633]/20">Dépense</SelectItem>
                        <SelectItem value="REVENUE" className="text-[#F5F5DC] hover:bg-[#006633]/20">Revenu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="text-[#F5F5DC]">Catégorie</Label>
                    <Select value={formCategory} onValueChange={setFormCategory}>
                      <SelectTrigger className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0B1623] border border-[#D4AF37]/30">
                        {(formType === "EXPENSE" ? expenseCategories : revenueCategories).map((category) => (
                          <SelectItem key={category} value={category} className="text-[#F5F5DC] hover:bg-[#006633]/20">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="amount" className="text-[#F5F5DC]">Montant (FCFA)</Label>
                      <Input id="amount" type="number" placeholder="0" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date" className="text-[#F5F5DC]">Date</Label>
                      <Input id="date" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="plot" className="text-[#F5F5DC]">Parcelle concernée</Label>
                    <Select value={formPlotId} onValueChange={setFormPlotId}>
                      <SelectTrigger className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0B1623] border border-[#D4AF37]/30">
                        {plots.map((p) => (
                          <SelectItem key={p.id} value={p.id} className="text-[#F5F5DC] hover:bg-[#006633]/20">{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-[#F5F5DC]">Description</Label>
                    <Textarea id="description" placeholder="Détails de la transaction..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)} className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
                    Annuler
                  </Button>
                  <Button type="button" onClick={handleCreateTransaction} disabled={loading || !canSubmitCreate} className="bg-[#006633] hover:bg-[#C1440E] text-white">
                    {loading ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#D4AF37]">Revenus Totaux</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#006633]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#006633]">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-[#F5F5DC]/70">+12% par rapport au mois dernier</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#D4AF37]">Dépenses Totales</CardTitle>
              <TrendingDown className="h-4 w-4 text-[#C1440E]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#C1440E]">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-[#F5F5DC]/70">-5% par rapport au mois dernier</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#D4AF37]">Bénéfice Net</CardTitle>
              <Calculator className="h-4 w-4 text-[#006633]" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-[#006633]" : "text-[#C1440E]"}`}>
                {formatCurrency(netProfit)}
              </div>
              <p className="text-xs text-[#F5F5DC]/70">{netProfit >= 0 ? "Bénéfice" : "Perte"} ce mois</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#D4AF37]">Marge Bénéficiaire</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#006633]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#F5F5DC]">
                {totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0}%
              </div>
              <p className="text-xs text-[#F5F5DC]/70">Ratio profit/revenus</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution Mensuelle</CardTitle>
              <CardDescription>Revenus vs Dépenses sur 9 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line type="monotone" dataKey="revenus" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="depenses" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Dépenses</CardTitle>
              <CardDescription>Par catégorie ce mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${Number(percent ?? 0) * 100 % 1 === 0 ? (Number(percent ?? 0) * 100).toFixed(0) : (Number(percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transactions Récentes</CardTitle>
                <CardDescription>Dernières opérations financières</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrer
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Période
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Parcelle</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          transaction.type === "REVENUE"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }
                      >
                        {transaction.type === "REVENUE" ? (
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                        )}
                        {transaction.type === "REVENUE" ? "Revenu" : "Dépense"}
                      </Badge>
                    </TableCell>
                    <TableCell>{categoryEnumToLabel[transaction.category] ?? transaction.category}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                    <TableCell className="text-muted-foreground">—</TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transaction.type === "REVENUE" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "REVENUE" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(transaction)}>Éditer</Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteExpense(transaction.id)} disabled={loading}>Supprimer</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Budget Analysis */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Analyse Budgétaire</CardTitle>
              <CardDescription>Comparaison avec les objectifs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Objectif revenus mensuel</span>
                  <span className="font-medium">1,500,000 FCFA</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${Math.min((totalRevenue / 1500000) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((totalRevenue / 1500000) * 100)}% de l'objectif atteint
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget dépenses mensuel</span>
                  <span className="font-medium">800,000 FCFA</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${totalExpenses > 800000 ? "bg-red-600" : "bg-yellow-600"}`}
                    style={{ width: `${Math.min((totalExpenses / 800000) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((totalExpenses / 800000) * 100)}% du budget utilisé
                  {totalExpenses > 800000 && " (dépassement)"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
              <CardDescription>Conseils pour optimiser vos finances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {netProfit > 0 ? (
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Excellente performance financière
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-200">
                      Votre ferme génère un bénéfice positif. Considérez investir dans l'expansion.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">Attention aux dépenses</p>
                    <p className="text-xs text-red-700 dark:text-red-200">
                      Vos dépenses dépassent vos revenus. Révisez votre budget.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Calculator className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Planification saisonnière</p>
                  <p className="text-xs text-blue-700 dark:text-blue-200">
                    Préparez votre budget pour la prochaine saison de plantation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#0B1623] border border-[#D4AF37]/30">
          <DialogHeader>
            <DialogTitle className="text-[#D4AF37]">Modifier la Transaction</DialogTitle>
            <DialogDescription className="text-[#F5F5DC]/80">Modifiez les détails de la transaction.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-category" className="text-[#F5F5DC]">Catégorie</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-[#0B1623] border border-[#D4AF37]/30">
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category} className="text-[#F5F5DC] hover:bg-[#006633]/20">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-amount" className="text-[#F5F5DC]">Montant (FCFA)</Label>
                <Input id="edit-amount" type="number" placeholder="0" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-date" className="text-[#F5F5DC]">Date</Label>
                <Input id="edit-date" type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description" className="text-[#F5F5DC]">Description</Label>
              <Textarea id="edit-description" placeholder="Détails de la transaction..." value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="bg-[#1A2332] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)} className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
              Annuler
            </Button>
            <Button type="button" onClick={handleUpdateExpense} disabled={loading} className="bg-[#006633] hover:bg-[#C1440E] text-white">
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
