import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/revenue/[id] - Récupérer un revenu spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params

    const revenue = await prisma.expense.findFirst({
      where: { 
        id,
        userId: session.user.id,
        type: "REVENUE"
      },
      include: {
        user: true,
        plot: true
      }
    })

    if (!revenue) {
      return NextResponse.json({ error: "Revenu non trouvé" }, { status: 404 })
    }

    return NextResponse.json(revenue)
  } catch (error) {
    console.error('Erreur lors de la récupération du revenu:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// PUT /api/revenue/[id] - Mettre à jour un revenu
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const { amount, description, category, plotId, date } = await request.json()

    // Vérifier que le revenu existe et appartient à l'utilisateur
    const existingRevenue = await prisma.expense.findFirst({
      where: { 
        id,
        userId: session.user.id,
        type: "REVENUE"
      }
    })

    if (!existingRevenue) {
      return NextResponse.json({ error: "Revenu non trouvé" }, { status: 404 })
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

    const updatedRevenue = await prisma.expense.update({
      where: { id },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        description: description || undefined,
        category: category || undefined,
        date: date ? new Date(date) : undefined,
        plotId: plotId || null
      },
      include: {
        user: true,
        plot: true
      }
    })

    return NextResponse.json(updatedRevenue)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du revenu:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// DELETE /api/revenue/[id] - Supprimer un revenu
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params

    // Vérifier que le revenu existe et appartient à l'utilisateur
    const existingRevenue = await prisma.expense.findFirst({
      where: { 
        id,
        userId: session.user.id,
        type: "REVENUE"
      }
    })

    if (!existingRevenue) {
      return NextResponse.json({ error: "Revenu non trouvé" }, { status: 404 })
    }

    await prisma.expense.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Revenu supprimé" })
  } catch (error) {
    console.error('Erreur lors de la suppression du revenu:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
