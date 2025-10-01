"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useFarms } from "@/hooks/use-farms"
import { useExpenses } from "@/hooks/use-expenses"
import { useTeam } from "@/hooks/use-team"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ReportsPage() {
  const { farms } = useFarms()
  const primaryFarmId = farms?.[0]?.id as string | undefined
  const { expenses } = useExpenses(primaryFarmId)
  const { teamMembers } = useTeam()

  const summary = useMemo(() => {
    const totalArea = farms?.reduce((sum: number, f: any) => sum + (f.totalArea || 0), 0) || 0
    const expenseByCat: Record<string, number> = {}
    for (const e of expenses || []) {
      const cat = e.category || "OTHER"
      expenseByCat[cat] = (expenseByCat[cat] || 0) + (e.amount || 0)
    }
    const topCat = Object.entries(expenseByCat).sort((a, b) => b[1] - a[1])[0]
    const staffCount = (teamMembers || []).length

    const recommendations: string[] = []
    if (topCat && topCat[1] > 0) {
      recommendations.push(`Optimisez la dépense dominante (${topCat[0]}) en négociant vos achats ou en groupant les commandes.`)
    }
    if (totalArea > 0 && staffCount > 0) {
      const areaPerStaff = totalArea / staffCount
      if (areaPerStaff > 10) {
        recommendations.push("Le ratio hectares/membre est élevé. Envisagez de renforcer l'équipe ou de mécaniser.")
      } else if (areaPerStaff < 3) {
        recommendations.push("Le ratio hectares/membre est faible. Réaffectez des tâches ou élargissez les surfaces cultivées.")
      }
    }
    if ((expenses || []).length === 0) {
      recommendations.push("Aucune dépense enregistrée: commencez à saisir vos coûts pour un suivi précis.")
    }
    if ((farms || []).length === 0) {
      recommendations.push("Aucune ferme: créez votre première ferme pour débloquer des recommandations personnalisées.")
    }

    return { totalArea, expenseByCat, topCat, staffCount, recommendations }
  }, [farms, expenses, teamMembers])

  return (
    <DashboardLayout>
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-6">Rapports et recommandations</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Surfaces totales</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{summary.totalArea.toLocaleString()} ha</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Membres de l'équipe</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{summary.staffCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Catégorie de dépense principale</CardTitle>
          </CardHeader>
          <CardContent className="text-xl">{summary.topCat ? `${summary.topCat[0]} (${summary.topCat[1].toLocaleString()} fcfa)` : "N/A"}</CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dépenses par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(summary.expenseByCat).length === 0 ? (
              <div className="text-sm text-muted-foreground">Aucune dépense.</div>
            ) : (
              <div className="space-y-2">
                {Object.entries(summary.expenseByCat).map(([cat, amt]) => (
                  <div key={cat} className="flex items-center justify-between text-sm">
                    <span>{cat}</span>
                    <span className="font-medium">{amt.toLocaleString()} fcfa</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.recommendations.length === 0 ? (
              <div className="text-sm text-muted-foreground">Aucune recommandation pour le moment.</div>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {summary.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            )}
            <Separator className="my-4" />
            <div className="text-xs text-muted-foreground">Basé sur vos fermes, dépenses et équipe.</div>
          </CardContent>
        </Card>
      </div>
      </div>
    </DashboardLayout>
  )
}


