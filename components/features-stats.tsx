"use client"

import { useEffect, useState } from "react"
import { Users, ShoppingCart, TrendingUp, Globe } from "lucide-react"

interface FeaturesStatsData {
  totalUsers: number
  totalFarms: number
  totalTransactions: number
  totalOffers: number
  totalDemands: number
  countries: number
}

export function FeaturesStats() {
  const [stats, setStats] = useState<FeaturesStatsData | null>(null)
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

  const statsData = [
    { 
      label: "Agriculteurs connectés", 
      value: stats ? `${stats.totalUsers}+` : "10+", 
      icon: Users 
    },
    { 
      label: "Fermes gérées", 
      value: stats ? `${stats.totalFarms}+` : "50+", 
      icon: TrendingUp 
    },
    { 
      label: "Transactions réalisées", 
      value: stats ? `${stats.totalTransactions}+` : "100+", 
      icon: ShoppingCart 
    },
    { 
      label: "Pays couverts", 
      value: "1+", 
      icon: Globe 
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16 md:mb-20">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="text-center p-4 bg-white/50 rounded-xl border border-[#D4AF37]/20 animate-pulse">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-full mb-3 md:mb-4"></div>
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16 md:mb-20">
      {statsData.map((stat, index) => (
        <div key={index} className="text-center p-4 bg-white/50 rounded-xl border border-[#D4AF37]/20">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-[#D4AF37] to-[#C1440E] rounded-full mb-3 md:mb-4">
            <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-[#0D1B2A] mb-2">{stat.value}</div>
          <div className="text-sm md:text-base text-[#0D1B2A]/70">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
