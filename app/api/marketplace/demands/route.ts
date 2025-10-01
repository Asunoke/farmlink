import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { MarketplaceCategory, MarketplaceStatus } from "@prisma/client"

// GET /api/marketplace/demands - Récupérer toutes les demandes
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

    const [demands, total] = await Promise.all([
      prisma.marketplaceDemand.findMany({
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
      prisma.marketplaceDemand.count({ where })
    ])

    return NextResponse.json({
      demands,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching demands:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des demandes" },
      { status: 500 }
    )
  }
}

// POST /api/marketplace/demands - Créer une nouvelle demande
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
    const { title, description, category, maxPrice, quantity, unit, location } = body

    // Validation
    if (!title || !description || !category || !maxPrice || !quantity || !unit || !location) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      )
    }

    if (maxPrice <= 0 || quantity <= 0) {
      return NextResponse.json(
        { error: "Le prix maximum et la quantité doivent être positifs" },
        { status: 400 }
      )
    }

    const demand = await prisma.marketplaceDemand.create({
      data: {
        title,
        description,
        category: category as MarketplaceCategory,
        maxPrice: parseFloat(maxPrice),
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

    return NextResponse.json(demand, { status: 201 })
  } catch (error) {
    console.error("Error creating demand:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la demande" },
      { status: 500 }
    )
  }
}
