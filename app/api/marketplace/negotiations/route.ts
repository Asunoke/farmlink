import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NegotiationStatus } from "@prisma/client"

// GET /api/marketplace/negotiations - Récupérer les négociations de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const isAdmin = (session.user as any).role === "ADMIN"

    const where: any = isAdmin
      ? {}
      : {
          OR: [
            { userId: (session.user as any).id },
            { offer: { userId: (session.user as any).id } },
            { demand: { userId: (session.user as any).id } }
          ]
        }

    if (status && status !== "all") {
      where.status = status as NegotiationStatus
    }

    const [negotiations, total] = await Promise.all([
      prisma.marketplaceNegotiation.findMany({
        where,
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
          },
        },
        orderBy: {
          updatedAt: "desc"
        },
        skip: offset,
        take: limit
      }),
      prisma.marketplaceNegotiation.count({ where })
    ])

    return NextResponse.json({
      negotiations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching negotiations:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des négociations" },
      { status: 500 }
    )
  }
}

// POST /api/marketplace/negotiations - Créer une nouvelle négociation
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { offerId, demandId, price, quantity, message } = body

    // Validation
    if (!offerId && !demandId) {
      return NextResponse.json(
        { error: "Une offre ou une demande doit être spécifiée" },
        { status: 400 }
      )
    }

    if (offerId && demandId) {
      return NextResponse.json(
        { error: "Une seule offre ou demande peut être spécifiée" },
        { status: 400 }
      )
    }

    // Pour une négociation initiale, on peut accepter price=0 et quantity=0
    if (price === undefined || quantity === undefined) {
      return NextResponse.json(
        { error: "Le prix et la quantité sont requis" },
        { status: 400 }
      )
    }

    if (price < 0 || quantity < 0) {
      return NextResponse.json(
        { error: "Le prix et la quantité ne peuvent pas être négatifs" },
        { status: 400 }
      )
    }

    // Vérifier que l'offre ou la demande existe
    if (offerId) {
      const offer = await prisma.marketplaceOffer.findUnique({
        where: { id: offerId }
      })
      if (!offer) {
        return NextResponse.json(
          { error: "Offre non trouvée" },
          { status: 404 }
        )
      }
      if (offer.userId === (session.user as any).id) {
        return NextResponse.json(
          { error: "Vous ne pouvez pas négocier avec vous-même" },
          { status: 400 }
        )
      }
    }

    if (demandId) {
      const demand = await prisma.marketplaceDemand.findUnique({
        where: { id: demandId }
      })
      if (!demand) {
        return NextResponse.json(
          { error: "Demande non trouvée" },
          { status: 404 }
        )
      }
      if (demand.userId === (session.user as any).id) {
        return NextResponse.json(
          { error: "Vous ne pouvez pas négocier avec vous-même" },
          { status: 400 }
        )
      }
    }

    const negotiation = await prisma.marketplaceNegotiation.create({
      data: {
        offerId: offerId || null,
        demandId: demandId || null,
        price: parseFloat(price),
        quantity: parseFloat(quantity),
        message: message || null,
        status: "PENDING",
        userId: (session.user as any).id
      },
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

    // Note: Les messages seront gérés par l'API des messages une fois la migration appliquée

    return NextResponse.json(negotiation, { status: 201 })
  } catch (error) {
    console.error("Error creating negotiation:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la négociation" },
      { status: 500 }
    )
  }
}
