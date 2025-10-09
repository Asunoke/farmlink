import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/crops/[id] - Récupérer une culture spécifique (parcelle)
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

    const plot = await prisma.plot.findFirst({
      where: { 
        id,
        farm: { userId: session.user.id }
      },
      include: {
        farm: true
      }
    })

    if (!plot) {
      return NextResponse.json({ error: "Culture non trouvée" }, { status: 404 })
    }

    return NextResponse.json(plot)
  } catch (error) {
    console.error('Erreur lors de la récupération de la culture:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// PUT /api/crops/[id] - Mettre à jour une culture (parcelle)
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
    const { cropType, plantedDate, harvestDate, status } = await request.json()

    // Vérifier que la parcelle existe et appartient à l'utilisateur
    const existingPlot = await prisma.plot.findFirst({
      where: { 
        id,
        farm: { userId: session.user.id }
      }
    })

    if (!existingPlot) {
      return NextResponse.json({ error: "Culture non trouvée" }, { status: 404 })
    }

    const updatedPlot = await prisma.plot.update({
      where: { id },
      data: {
        cropType: cropType || undefined,
        plantedDate: plantedDate ? new Date(plantedDate) : undefined,
        harvestDate: harvestDate ? new Date(harvestDate) : undefined,
        status: status || undefined
      },
      include: {
        farm: true
      }
    })

    return NextResponse.json(updatedPlot)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la culture:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// DELETE /api/crops/[id] - Supprimer une culture (réinitialiser la parcelle)
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

    // Vérifier que la parcelle existe et appartient à l'utilisateur
    const existingPlot = await prisma.plot.findFirst({
      where: { 
        id,
        farm: { userId: session.user.id }
      }
    })

    if (!existingPlot) {
      return NextResponse.json({ error: "Culture non trouvée" }, { status: 404 })
    }

    // Réinitialiser la parcelle (supprimer les informations de culture)
    const updatedPlot = await prisma.plot.update({
      where: { id },
      data: {
        cropType: "",
        plantedDate: null,
        harvestDate: null,
        status: 'PREPARATION'
      },
      include: {
        farm: true
      }
    })

    return NextResponse.json(updatedPlot)
  } catch (error) {
    console.error('Erreur lors de la suppression de la culture:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
