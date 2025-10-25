"use client"

import { useEffect, useState } from "react"
import { AnimatedCard } from "@/components/animated-section"

interface StatsData {
  totalUsers: number
  totalFarms: number
  totalTransactions: number
  totalOffers: number
  totalDemands: number
  yieldIncrease: string
  costReduction: string
  support: string
}

export function StatsSection() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-[#F5F5DC] border-y border-[#D4AF37]/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0D1B2A] mb-4">
              {"Rejoignez plus de 500 agriculteurs maliens"}
            </h2>
            <p className="text-lg text-[#0D1B2A]/80">
              {"Qui ont déjà transformé leur agriculture avec FarmLink"}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="text-center group hover:shadow-lg p-4 rounded-lg animate-pulse">
                <div className="h-8 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-[#F5F5DC] border-y border-[#D4AF37]/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#0D1B2A] mb-4">
            {stats ? `Rejoignez plus de ${stats.totalUsers} agriculteurs maliens` : "Rejoignez plus de 500 agriculteurs maliens"}
          </h2>
          <p className="text-lg text-[#0D1B2A]/80">
            {"Qui ont déjà transformé leur agriculture avec FarmLink"}
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatedCard delay={0.1} className="text-center group hover:shadow-lg p-4 rounded-lg">
            <div className="text-3xl font-bold text-[#006633] mb-2 group-hover:text-[#C1440E] transition-colors">
              {stats ? `${stats.totalFarms}+` : "500+"}
            </div>
            <div className="text-[#0D1B2A] font-medium">Fermes connectées</div>
          </AnimatedCard>
          <AnimatedCard delay={0.2} className="text-center group hover:shadow-lg p-4 rounded-lg">
            <div className="text-3xl font-bold text-[#006633] mb-2 group-hover:text-[#C1440E] transition-colors">
              {stats?.yieldIncrease || "40%"}
            </div>
            <div className="text-[#0D1B2A] font-medium">{"Augmentation des rendements"}</div>
          </AnimatedCard>
          <AnimatedCard delay={0.3} className="text-center group hover:shadow-lg p-4 rounded-lg">
            <div className="text-3xl font-bold text-[#006633] mb-2 group-hover:text-[#C1440E] transition-colors">
              {stats?.costReduction || "30%"}
            </div>
            <div className="text-[#0D1B2A] font-medium">{"Réduction des coûts"}</div>
          </AnimatedCard>
          <AnimatedCard delay={0.4} className="text-center group hover:shadow-lg p-4 rounded-lg">
            <div className="text-3xl font-bold text-[#006633] mb-2 group-hover:text-[#C1440E] transition-colors">
              {stats?.support || "24/7"}
            </div>
            <div className="text-[#0D1B2A] font-medium">Support technique</div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  )
}
