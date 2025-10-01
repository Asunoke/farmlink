import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const [totalUsers, totalFarms, totalExpenses, totalTeamMembers, usersBySubscription, recentUsers, monthlyGrowth] =
      await Promise.all([
        prisma.user.count(),
        prisma.farm.count(),
        prisma.expense.count(),
        prisma.teamMember.count(),
        prisma.user.groupBy({
          by: ["subscription"],
          _count: { subscription: true },
        }),
        prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            subscription: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        prisma.user.groupBy({
          by: ["createdAt"],
          _count: { id: true },
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1),
            },
          },
        }),
      ])

    // Calculate total revenue (mock calculation based on subscriptions)
    const revenueByPlan = {
      FREE: 15000,
      BASIC: 35000, // 29€ * 650 FCFA
      PREMIUM: 75000, // 99€ * 650 FCFA
    }

    const totalRevenue = usersBySubscription.reduce((sum, group) => {
      return sum + group._count.subscription * revenueByPlan[group.subscription as keyof typeof revenueByPlan]
    }, 0)

    // Process monthly growth data
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(new Date().getFullYear(), new Date().getMonth() - 11 + i, 1)
      const monthName = date.toLocaleDateString("fr-FR", { month: "short" })
      const count = monthlyGrowth
        .filter((item) => {
          const itemDate = new Date(item.createdAt)
          return itemDate.getMonth() === date.getMonth() && itemDate.getFullYear() === date.getFullYear()
        })
        .reduce((sum, item) => sum + item._count.id, 0)

      return { month: monthName, users: count }
    })

    return NextResponse.json({
      overview: {
        totalUsers,
        totalFarms,
        totalExpenses,
        totalTeamMembers,
        totalRevenue,
      },
      usersBySubscription: usersBySubscription.map((group) => ({
        subscription: group.subscription,
        count: group._count.subscription,
      })),
      recentUsers,
      monthlyGrowth: monthlyData,
    })
  } catch (error) {
    console.error("Admin stats fetch error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
