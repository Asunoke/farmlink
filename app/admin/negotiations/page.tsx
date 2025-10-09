"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import Link from "next/link"

type Negotiation = {
  id: string
  price: number
  quantity: number
  message?: string | null
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COUNTER_OFFER" | "COMPLETED"
  user: { id: string; name: string | null; email: string | null }
  offer?: { id: string; title: string; user: { id: string; name: string | null } } | null
  demand?: { id: string; title: string; user: { id: string; name: string | null } } | null
  updatedAt: string
}

export default function AdminNegotiationsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [isLoading, setIsLoading] = useState(false)
  const [negotiations, setNegotiations] = useState<Negotiation[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const isAdmin = (session?.user as any)?.role === "ADMIN"

  const fetchNegotiations = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", String(limit))
      params.set("status", statusFilter)
      const res = await fetch(`/api/marketplace/negotiations?${params.toString()}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erreur de chargement")
      setNegotiations(json.negotiations || [])
      setTotalPages(json.pagination?.pages || 1)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNegotiations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page])

  const filtered = useMemo(() => {
    if (!query.trim()) return negotiations
    const q = query.toLowerCase()
    return negotiations.filter((n) => {
      const parts = [
        n.id,
        n.status,
        n.user?.name || "",
        n.user?.email || "",
        n.offer?.title || "",
        n.demand?.title || "",
        n.message || "",
      ]
      return parts.some((p) => p?.toLowerCase().includes(q))
    })
  }, [negotiations, query])

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette négociation ?")) return
    try {
      const res = await fetch(`/api/marketplace/negotiations/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erreur lors de la suppression")
      await fetchNegotiations()
    } catch (e) {
      console.error(e)
      alert("Suppression impossible")
    }
  }

  if (session && !isAdmin) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card>
            <CardHeader>
              <CardTitle>Accès refusé</CardTitle>
            </CardHeader>
            <CardContent>Vous devez être administrateur pour accéder à cette page.</CardContent>
          </Card>
        </div>
      </AdminDashboardLayout>
    )
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Toutes les négociations</h1>
        <Link href="/admin">
          <Button variant="outline">Retour Admin</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="PENDING">En cours</SelectItem>
                  <SelectItem value="COUNTER_OFFER">Contre-offre</SelectItem>
                  <SelectItem value="ACCEPTED">Accepté</SelectItem>
                  <SelectItem value="REJECTED">Rejeté</SelectItem>
                  <SelectItem value="COMPLETED">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Rechercher (titre, utilisateur, message)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Liste</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <div className="min-w-[900px] w-full">
                <div className="grid grid-cols-12 px-2 py-2 text-xs text-muted-foreground">
                  <div className="col-span-3">Offre/Demande</div>
                  <div className="col-span-2">Utilisateur</div>
                  <div className="col-span-2">Prix / Qté</div>
                  <div className="col-span-2">Statut</div>
                  <div className="col-span-2">MAJ</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <Separator />
                {isLoading ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">Chargement…</div>
                ) : filtered.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">Aucune négociation</div>
                ) : (
                  filtered.map((n) => (
                    <div key={n.id} className="grid grid-cols-12 items-center px-2 py-3">
                      <div className="col-span-3">
                        <div className="font-medium truncate">
                          {n.offer ? `Offre: ${n.offer.title}` : n.demand ? `Demande: ${n.demand.title}` : n.id}
                        </div>
                        {n.message ? (
                          <div className="text-xs text-muted-foreground truncate">{n.message}</div>
                        ) : null}
                      </div>
                      <div className="col-span-2 text-sm truncate">
                        {n.user?.name || n.user?.email || n.user?.id}
                      </div>
                      <div className="col-span-2 text-sm">
                        {n.price.toLocaleString()} fcfa • {n.quantity}
                      </div>
                      <div className="col-span-2">
                        <Badge
                          variant={
                            n.status === "ACCEPTED"
                              ? "default"
                              : n.status === "REJECTED"
                              ? "destructive"
                              : n.status === "COUNTER_OFFER"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {n.status}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-xs text-muted-foreground">
                        {new Date(n.updatedAt).toLocaleString()}
                      </div>
                      <div className="col-span-1 flex justify-end gap-2">
                        <Link href={`/marketplace/negotiation/${n.id}`}>
                          <Button variant="outline" size="sm">Voir</Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(n.id)}>Suppr.</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page} / {totalPages}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Précédent
                </Button>
                <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  Suivant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </AdminDashboardLayout>
  )
}
