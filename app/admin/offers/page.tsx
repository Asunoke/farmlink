"use client"

import { useEffect, useState } from "react"
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminOffersPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/marketplace/offers?limit=100&status=all`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erreur")
      setItems(json.offers || [])
    } catch (e: any) {
      setError(e.message || "Erreur")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette offre ?")) return
    const res = await fetch(`/api/marketplace/offers/${id}`, { method: "DELETE" })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return alert(json.error || "Erreur de suppression")
    load()
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Toutes les Offres</h1>
        {loading ? (
          <div>Chargement…</div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : items.length === 0 ? (
          <Card><CardContent className="p-6 text-sm text-muted-foreground">Aucune offre.</CardContent></Card>
        ) : (
          <div className="grid gap-3">
            {items.map((o) => (
              <Card key={o.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{o.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => location.assign(`/marketplace/negotiation?offer=${o.id}`)}>Négociations</Button>
                    <Button size="sm" onClick={() => location.assign(`/marketplace/offers/create?edit=${o.id}`)}>Modifier</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(o.id)}>Supprimer</Button>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {o.price.toLocaleString()} fcfa • {o.quantity} {o.unit} • {o.location}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  )
}


