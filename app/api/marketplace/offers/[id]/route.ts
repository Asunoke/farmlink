import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { MarketplaceCategory, MarketplaceStatus } from "@prisma/client"

// GET /api/marketplace/offers/[id] - Récupérer une offre spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const offer = await prisma.marketplaceOffer.findUnique({
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

    if (!offer) {
      return NextResponse.json(
        { error: "Offre non trouvée" },
        { status: 404 }
      )
    }

    return NextResponse.json(offer)
  } catch (error) {
    console.error("Error fetching offer:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'offre" },
      { status: 500 }
    )
  }
}

// PUT /api/marketplace/offers/[id] - Mettre à jour une offre
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
    const { title, description, category, price, quantity, unit, location, status } = body

    // Vérifier que l'offre existe et appartient à l'utilisateur
    const { id } = await params
    const existingOffer = await prisma.marketplaceOffer.findUnique({
      where: { id }
    })

    if (!existingOffer) {
      return NextResponse.json(
        { error: "Offre non trouvée" },
        { status: 404 }
      )
    }

    if (existingOffer.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Non autorisé à modifier cette offre" },
        { status: 403 }
      )
    }

    // Validation
    if (price && price <= 0) {
      return NextResponse.json(
        { error: "Le prix doit être positif" },
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
    if (price) updateData.price = parseFloat(price)
    if (quantity) updateData.quantity = parseFloat(quantity)
    if (unit) updateData.unit = unit
    if (location) updateData.location = location
    if (status) updateData.status = status as MarketplaceStatus

    const offer = await prisma.marketplaceOffer.update({
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

    return NextResponse.json(offer)
  } catch (error) {
    console.error("Error updating offer:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'offre" },
      { status: 500 }
    )
  }
}

// DELETE /api/marketplace/offers/[id] - Supprimer une offre
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

    // Vérifier que l'offre existe et appartient à l'utilisateur
    const { id } = await params
    const existingOffer = await prisma.marketplaceOffer.findUnique({
      where: { id }
    })

    if (!existingOffer) {
      return NextResponse.json(
        { error: "Offre non trouvée" },
        { status: 404 }
      )
    }

    if (existingOffer.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Non autorisé à supprimer cette offre" },
        { status: 403 }
      )
    }

    await prisma.marketplaceOffer.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Offre supprimée avec succès" })
  } catch (error) {
    console.error("Error deleting offer:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'offre" },
      { status: 500 }
    )
  }
}
