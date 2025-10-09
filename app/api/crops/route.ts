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

    const crops = await prisma.plot.findMany({
      where: { 
        farm: { userId }
      },
      include: {
        farm: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(crops)
  } catch (error) {
    console.error('Erreur lors de la récupération des cultures:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { plotId, cropType, plantedDate, harvestDate, status } = await request.json()

    if (!plotId || !cropType) {
      return NextResponse.json({ error: "Parcelle et type de culture sont requis" }, { status: 400 })
    }

    // Vérifier que la parcelle appartient à l'utilisateur
    const existingPlot = await prisma.plot.findFirst({
      where: {
        id: plotId,
        farm: {
          userId: session.user.id
        }
      }
    })

    if (!existingPlot) {
      return NextResponse.json({ error: "Parcelle non trouvée" }, { status: 404 })
    }

    const updatedPlot = await prisma.plot.update({
      where: { id: plotId },
      data: {
        cropType,
        plantedDate: plantedDate ? new Date(plantedDate) : null,
        harvestDate: harvestDate ? new Date(harvestDate) : null,
        status: status || 'PLANTED'
      },
      include: {
        farm: true
      }
    })

    return NextResponse.json(updatedPlot)
  } catch (error) {
    console.error('Erreur lors de la création de la culture:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
