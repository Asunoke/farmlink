"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"

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

  if (loading) return (
    <div className="min-h-screen bg-[#0D1B2A]">
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006633] mx-auto mb-4"></div>
          <p className="text-[#F5F5DC]/70">Chargement…</p>
        </div>
      </div>
    </div>
  )
  if (error) return (
    <div className="min-h-screen bg-[#0D1B2A]">
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-[#C1440E]">{error}</div>
      </div>
    </div>
  )

  return ( 
    <div className="min-h-screen bg-[#0D1B2A]">
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#D4AF37]">Mes négociations</h1>
          <Link href="/marketplace">
            <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">Retour au marché</Button>
          </Link>
        </div>

        <div className="grid gap-3">
          {items.length === 0 && (
            <Card className="bg-[#0B1623] border border-[#D4AF37]/20">
              <CardContent className="p-6 text-sm text-[#F5F5DC]/70">Aucune négociation.</CardContent>
            </Card>
          )}
          {items.map((n) => (
            <Card key={n.id} className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-medium text-[#D4AF37]">
                  {n.offer ? `Offre: ${n.offer.title}` : n.demand ? `Demande: ${n.demand.title}` : n.id}
                </CardTitle>
                <Badge className="bg-[#006633] text-white">{n.status}</Badge>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-xs text-[#F5F5DC]/70">MAJ: {new Date(n.updatedAt).toLocaleString()}</div>
                <Link href={`/marketplace/negotiation/${n.id}`}>
                  <Button size="sm" variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">Ouvrir</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}


