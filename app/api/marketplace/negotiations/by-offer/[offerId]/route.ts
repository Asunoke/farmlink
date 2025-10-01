import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/marketplace/negotiations/by-offer/[offerId] - Récupérer les négociations d'une offre
export async function GET(
  request: NextRequest,
  { params }: { params: { offerId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const negotiations = await prisma.marketplaceNegotiation.findMany({
      where: {
        offerId: params.offerId
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
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(negotiations)
  } catch (error) {
    console.error("Error fetching negotiations by offer:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des négociations" },
      { status: 500 }
    )
  }
}
