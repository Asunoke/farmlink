import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT /api/notifications/[id] - Marquer une notification comme lue
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params

    const notification = await prisma.notification.findUnique({
      where: { id }
    })

    if (!notification) {
      return NextResponse.json({ error: "Notification non trouvée" }, { status: 404 })
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    })

    return NextResponse.json(updatedNotification)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// DELETE /api/notifications/[id] - Supprimer une notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params

    const notification = await prisma.notification.findUnique({
      where: { id }
    })

    if (!notification) {
      return NextResponse.json({ error: "Notification non trouvée" }, { status: 404 })
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    await prisma.notification.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Notification supprimée" })
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}