"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface NegotiationListItem {
  id: string
  status: string
  offer?: { id: string; title: string } | null
  demand?: { id: string; title: string } | null
  updatedAt: string
}

export default function NegotiationsIndexPage() {
  const [items, setItems] = useState<NegotiationListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/marketplace/negotiations?limit=50`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Erreur")
        setItems(json.negotiations || [])
      } catch (e: any) {
        setError(e.message || "Erreur")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="container mx-auto px-4 py-8">Chargement…</div>
  if (error) return <div className="container mx-auto px-4 py-8">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes négociations</h1>
        <Link href="/marketplace">
          <Button variant="outline">Retour au marché</Button>
        </Link>
      </div>

      <div className="grid gap-3">
        {items.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">Aucune négociation.</CardContent>
          </Card>
        )}
        {items.map((n) => (
          <Card key={n.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-medium">
                {n.offer ? `Offre: ${n.offer.title}` : n.demand ? `Demande: ${n.demand.title}` : n.id}
              </CardTitle>
              <Badge>{n.status}</Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">MAJ: {new Date(n.updatedAt).toLocaleString()}</div>
              <Link href={`/marketplace/negotiation/${n.id}`}>
                <Button size="sm" variant="outline">Ouvrir</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


