import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { MarketplaceCategory, MarketplaceStatus } from "@prisma/client"

// GET /api/marketplace/offers - Récupérer toutes les offres
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const location = searchParams.get("location")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const where: any = {
      status: "ACTIVE"
    }

    if (category && category !== "all") {
      where.category = category as MarketplaceCategory
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" }
    }

    const [offers, total] = await Promise.all([
      prisma.marketplaceOffer.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          negotiations: {
            select: {
              id: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: offset,
        take: limit
      }),
      prisma.marketplaceOffer.count({ where })
    ])

    return NextResponse.json({
      offers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching offers:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des offres" },
      { status: 500 }
    )
  }
}

// POST /api/marketplace/offers - Créer une nouvelle offre
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
    const { title, description, category, price, quantity, unit, location } = body

    // Validation
    if (!title || !description || !category || !price || !quantity || !unit || !location) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      )
    }

    if (price <= 0 || quantity <= 0) {
      return NextResponse.json(
        { error: "Le prix et la quantité doivent être positifs" },
        { status: 400 }
      )
    }

    const offer = await prisma.marketplaceOffer.create({
      data: {
        title,
        description,
        category: category as MarketplaceCategory,
        price: parseFloat(price),
        quantity: parseFloat(quantity),
        unit,
        location,
        status: "ACTIVE",
        userId: (session.user as any).id
      },
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

    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error("Error creating offer:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de l'offre" },
      { status: 500 }
    )
  }
}
