import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const userId = session.user.id

    // Récupérer les données en parallèle
    const [farms, plots, teamMembers, expenses, tasks, weatherLimits] = await Promise.all([
      // Fermes
      prisma.farm.findMany({
        where: { userId },
        include: {
          plots: true,
          _count: {
            select: {
              plots: true
            }
          }
        }
      }),

      // Parcelles
      prisma.plot.findMany({
        where: { 
          farm: { userId }
        },
        include: {
          farm: true
        }
      }),

      // Membres d'équipe
      prisma.teamMember.findMany({
        where: { 
          userId
        },
        include: {
          user: true
        }
      }),

      // Dépenses du mois en cours
      prisma.expense.findMany({
        where: { 
          userId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        include: {
          user: true,
          plot: true
        }
      }),

      // Tâches
      prisma.task.findMany({
        where: { 
          teamMember: { userId }
        },
        include: {
          teamMember: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),

      // Limites météo
      fetch('/api/user/weather-limits').then(res => res.json()).catch(() => null)
    ])

    return NextResponse.json({
      farms,
      plots,
      teamMembers,
      expenses,
      tasks,
      weatherLimits
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des données du dashboard:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
