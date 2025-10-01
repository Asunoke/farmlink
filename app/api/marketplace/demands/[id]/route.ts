import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { MarketplaceCategory, MarketplaceStatus } from "@prisma/client"

// GET /api/marketplace/demands/[id] - Récupérer une demande spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const demand = await prisma.marketplaceDemand.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        negotiations: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })

    if (!demand) {
      return NextResponse.json(
        { error: "Demande non trouvée" },
        { status: 404 }
      )
    }

    return NextResponse.json(demand)
  } catch (error) {
    console.error("Error fetching demand:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la demande" },
      { status: 500 }
    )
  }
}

// PUT /api/marketplace/demands/[id] - Mettre à jour une demande
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, category, maxPrice, quantity, unit, location, status } = body

    // Vérifier que la demande existe et appartient à l'utilisateur
    const { id } = await params
    const existingDemand = await prisma.marketplaceDemand.findUnique({
      where: { id }
    })

    if (!existingDemand) {
      return NextResponse.json(
        { error: "Demande non trouvée" },
        { status: 404 }
      )
    }

    if (existingDemand.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Non autorisé à modifier cette demande" },
        { status: 403 }
      )
    }

    // Validation
    if (maxPrice && maxPrice <= 0) {
      return NextResponse.json(
        { error: "Le prix maximum doit être positif" },
        { status: 400 }
      )
    }

    if (quantity && quantity <= 0) {
      return NextResponse.json(
        { error: "La quantité doit être positive" },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (category) updateData.category = category as MarketplaceCategory
    if (maxPrice) updateData.maxPrice = parseFloat(maxPrice)
    if (quantity) updateData.quantity = parseFloat(quantity)
    if (unit) updateData.unit = unit
    if (location) updateData.location = location
    if (status) updateData.status = status as MarketplaceStatus

    const demand = await prisma.marketplaceDemand.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(demand)
  } catch (error) {
    console.error("Error updating demand:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la demande" },
      { status: 500 }
    )
  }
}

// DELETE /api/marketplace/demands/[id] - Supprimer une demande
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    // Vérifier que la demande existe et appartient à l'utilisateur
    const { id } = await params
    const existingDemand = await prisma.marketplaceDemand.findUnique({
      where: { id }
    })

    if (!existingDemand) {
      return NextResponse.json(
        { error: "Demande non trouvée" },
        { status: 404 }
      )
    }

    if (existingDemand.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Non autorisé à supprimer cette demande" },
        { status: 403 }
      )
    }

    await prisma.marketplaceDemand.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Demande supprimée avec succès" })
  } catch (error) {
    console.error("Error deleting demand:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la demande" },
      { status: 500 }
    )
  }
}
