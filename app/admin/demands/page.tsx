"use client"

import { useEffect, useState } from "react"
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDemandsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/marketplace/demands?limit=100&status=all`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erreur")
      setItems(json.demands || [])
    } catch (e: any) {
      setError(e.message || "Erreur")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette demande ?")) return
    const res = await fetch(`/api/marketplace/demands/${id}`, { method: "DELETE" })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return alert(json.error || "Erreur de suppression")
    load()
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Toutes les Demandes</h1>
        {loading ? (
          <div>Chargement…</div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : items.length === 0 ? (
          <Card><CardContent className="p-6 text-sm text-muted-foreground">Aucune demande.</CardContent></Card>
        ) : (
          <div className="grid gap-3">
            {items.map((d) => (
              <Card key={d.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{d.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => location.assign(`/marketplace/negotiation?demand=${d.id}`)}>Propositions</Button>
                    <Button size="sm" onClick={() => location.assign(`/marketplace/demands/create?edit=${d.id}`)}>Modifier</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(d.id)}>Supprimer</Button>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Max {d.maxPrice.toLocaleString()} fcfa • {d.quantity} {d.unit} • {d.location}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  )
}


