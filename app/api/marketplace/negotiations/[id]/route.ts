import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NegotiationStatus } from "@prisma/client"

// GET /api/marketplace/negotiations/[id] - Récupérer une négociation spécifique
export async function GET(
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

    const { id } = await params

    const negotiation = await prisma.marketplaceNegotiation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        offer: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        demand: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    if (!negotiation) {
      return NextResponse.json(
        { error: "Négociation non trouvée" },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur a accès à cette négociation
    const hasAccess = 
      negotiation.userId === (session.user as any).id ||
      negotiation.offer?.userId === (session.user as any).id ||
      negotiation.demand?.userId === (session.user as any).id

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Non autorisé à voir cette négociation" },
        { status: 403 }
      )
    }

    // Build a synthesized messages array from current negotiation data (no history persisted yet)
    const messages = negotiation.message
      ? [
          {
            id: negotiation.id,
            content: negotiation.message,
            price: negotiation.price,
            quantity: negotiation.quantity,
            type: negotiation.status === "COUNTER_OFFER" ? "counter_offer" : "message",
            userId: negotiation.userId,
            userName: negotiation.user?.name ?? "",
            timestamp: negotiation.updatedAt,
          },
        ]
      : []

    return NextResponse.json({ ...negotiation, messages })
  } catch (error) {
    console.error("Error fetching negotiation:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la négociation" },
      { status: 500 }
    )
  }
}

// PUT /api/marketplace/negotiations/[id] - Mettre à jour une négociation
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
    const { status, price, quantity, message } = body

    // Vérifier que la négociation existe
    const { id } = await params

    const existingNegotiation = await prisma.marketplaceNegotiation.findUnique({
      where: { id },
      include: {
        offer: true,
        demand: true
      }
    })

    if (!existingNegotiation) {
      return NextResponse.json(
        { error: "Négociation non trouvée" },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur peut modifier cette négociation
    const canModify = 
      existingNegotiation.userId === (session.user as any).id ||
      existingNegotiation.offer?.userId === (session.user as any).id ||
      existingNegotiation.demand?.userId === (session.user as any).id

    if (!canModify) {
      return NextResponse.json(
        { error: "Non autorisé à modifier cette négociation" },
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
    if (status) updateData.status = status as NegotiationStatus
    if (price) updateData.price = parseFloat(price)
    if (quantity) updateData.quantity = parseFloat(quantity)
    if (message !== undefined) updateData.message = message

    const negotiation = await prisma.marketplaceNegotiation.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        offer: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        demand: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    const messages = negotiation.message
      ? [
          {
            id: negotiation.id,
            content: negotiation.message,
            price: negotiation.price,
            quantity: negotiation.quantity,
            type: negotiation.status === "COUNTER_OFFER" ? "counter_offer" : "message",
            userId: negotiation.userId,
            userName: negotiation.user?.name ?? "",
            timestamp: negotiation.updatedAt,
          },
        ]
      : []

    return NextResponse.json({ ...negotiation, messages })
  } catch (error) {
    console.error("Error updating negotiation:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la négociation" },
      { status: 500 }
    )
  }
}

// DELETE /api/marketplace/negotiations/[id] - Supprimer une négociation
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

    // Vérifier que la négociation existe
    const { id } = await params

    const existingNegotiation = await prisma.marketplaceNegotiation.findUnique({
      where: { id }
    })

    if (!existingNegotiation) {
      return NextResponse.json(
        { error: "Négociation non trouvée" },
        { status: 404 }
      )
    }

    // Admin peut tout supprimer, sinon seulement le créateur
    const isAdmin = (session.user as any).role === "ADMIN"
    if (!isAdmin && existingNegotiation.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Non autorisé à supprimer cette négociation" },
        { status: 403 }
      )
    }

    await prisma.marketplaceNegotiation.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Négociation supprimée avec succès" })
  } catch (error) {
    console.error("Error deleting negotiation:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la négociation" },
      { status: 500 }
    )
  }
}
