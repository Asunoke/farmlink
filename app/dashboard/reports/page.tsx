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
        <h1 className="text-2xl font-bold mb-6 text-[#D4AF37]">Rapports et recommandations</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle className="text-[#D4AF37]">Surfaces totales</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-[#F5F5DC]">{summary.totalArea.toLocaleString()} ha</CardContent>
        </Card>
        <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle className="text-[#D4AF37]">Membres de l'équipe</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-[#F5F5DC]">{summary.staffCount}</CardContent>
        </Card>
        <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle className="text-[#D4AF37]">Catégorie de dépense principale</CardTitle>
          </CardHeader>
          <CardContent className="text-xl text-[#F5F5DC]">{summary.topCat ? `${summary.topCat[0]} (${summary.topCat[1].toLocaleString()} fcfa)` : "N/A"}</CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-[#D4AF37]">Dépenses par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(summary.expenseByCat).length === 0 ? (
              <div className="text-sm text-[#F5F5DC]/70">Aucune dépense.</div>
            ) : (
              <div className="space-y-2">
                {Object.entries(summary.expenseByCat).map(([cat, amt]) => (
                  <div key={cat} className="flex items-center justify-between text-sm">
                    <span className="text-[#F5F5DC]">{cat}</span>
                    <span className="font-medium text-[#D4AF37]">{amt.toLocaleString()} fcfa</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#0B1623] border border-[#D4AF37]/20 hover:border-[#006633] hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-[#D4AF37]">Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.recommendations.length === 0 ? (
              <div className="text-sm text-[#F5F5DC]/70">Aucune recommandation pour le moment.</div>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {summary.recommendations.map((rec, i) => (
                  <li key={i} className="text-[#F5F5DC]">{rec}</li>
                ))}
              </ul>
            )}
            <Separator className="my-4 bg-[#D4AF37]/20" />
            <div className="text-xs text-[#F5F5DC]/70">Basé sur vos fermes, dépenses et équipe.</div>
          </CardContent>
        </Card>
      </div>
      </div>
    </DashboardLayout>
  )
}


