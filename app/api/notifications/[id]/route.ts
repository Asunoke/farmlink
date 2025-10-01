import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { markNotificationAsRead } from "@/lib/notifications"

// PUT /api/notifications/[id] - Marquer une notification comme lue
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    await markNotificationAsRead(params.id, (session.user as any).id)

    return NextResponse.json({ message: "Notification marquée comme lue" })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la notification" },
      { status: 500 }
    )
  }
}
