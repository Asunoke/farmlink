import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/notifications/unread-count - Récupérer le nombre de notifications non lues
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const unreadCount = await prisma.notification.count({
      where: { 
        userId: session.user.id,
        isRead: false
      }
    })

    return NextResponse.json({ unreadCount })
  } catch (error) {
    console.error('Erreur lors du comptage des notifications non lues:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
