import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")
    const subscription = searchParams.get("subscription")
    const offset = (page - 1) * limit

    // Construire les conditions de filtrage
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    if (subscription && subscription !== 'all' && subscription !== 'ALL') {
      where.subscription = subscription
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          subscription: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              farms: true,
              teamMembers: true,
              expenses: true,
              offers: true,
              demands: true,
              negotiations: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}