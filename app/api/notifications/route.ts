import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/notifications - Récupérer les notifications de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.notification.count({ where: { userId: session.user.id } })
    ])

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// POST /api/notifications - Créer une nouvelle notification
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { title, message, type, data } = await request.json()

    if (!title || !message || !type) {
      return NextResponse.json({ error: "Titre, message et type sont requis" }, { status: 400 })
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        data: data || null,
        userId: session.user.id
      }
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}