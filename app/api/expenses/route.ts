import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // "EXPENSE", "REVENUE", or null for all
    const userId = session.user.id

    const where: any = { userId }
    
    // Si un type est spécifié, filtrer par type, sinon récupérer tous les types
    if (type && (type === "EXPENSE" || type === "REVENUE")) {
      where.type = type
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        user: true,
        plot: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Erreur lors de la récupération des dépenses:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { amount, description, category, plotId, date, type = "EXPENSE" } = await request.json()

    if (!amount || !description || !category) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    // Validation du type de transaction
    if (type !== "EXPENSE" && type !== "REVENUE") {
      return NextResponse.json({ error: "Type de transaction invalide. Utilisez 'EXPENSE' ou 'REVENUE'" }, { status: 400 })
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

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        description,
        category,
        date: date ? new Date(date) : new Date(),
        userId: session.user.id,
        plotId: plotId || null,
        type: type as any // Use the provided type (EXPENSE or REVENUE)
      },
      include: {
        user: true,
        plot: true
      }
    })

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Erreur lors de la création de la dépense:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}