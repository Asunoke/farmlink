import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT /api/notifications/mark-all-read - Marquer toutes les notifications comme lues
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    await prisma.notification.updateMany({
      where: { 
        userId: session.user.id,
        isRead: false
      },
      data: { isRead: true }
    })

    return NextResponse.json({ message: "Toutes les notifications ont été marquées comme lues" })
  } catch (error) {
    console.error('Erreur lors du marquage des notifications:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
