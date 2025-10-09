import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/revenue - Récupérer les revenus de l'utilisateur
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const userId = session.user.id

    const revenues = await prisma.expense.findMany({
      where: { 
        userId,
        type: "REVENUE" // Only get revenue transactions
      },
      include: {
        user: true,
        plot: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(revenues)
  } catch (error) {
    console.error('Erreur lors de la récupération des revenus:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// POST /api/revenue - Créer un nouveau revenu
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { amount, description, category, plotId, date } = await request.json()

    if (!amount || !description || !category) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    // Vérifier que la parcelle appartient à l'utilisateur (si plotId est fourni)
    if (plotId) {
      const plot = await prisma.plot.findFirst({
        where: {
          id: plotId,
          farm: { userId: session.user.id }
        }
      })

      if (!plot) {
        return NextResponse.json({ error: "Parcelle non trouvée" }, { status: 404 })
      }
    }

    const revenue = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        description,
        category,
        date: date ? new Date(date) : new Date(),
        userId: session.user.id,
        plotId: plotId || null,
        type: "REVENUE" // Explicitly set as revenue
      },
      include: {
        user: true,
        plot: true
      }
    })

    return NextResponse.json(revenue)
  } catch (error) {
    console.error('Erreur lors de la création du revenu:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
