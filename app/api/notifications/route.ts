import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserNotifications, markAllNotificationsAsRead, getUnreadNotificationCount } from "@/lib/notifications"

// GET /api/notifications - Récupérer les notifications de l'utilisateur
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
    const limit = parseInt(searchParams.get("limit") || "20")
    const unreadOnly = searchParams.get("unread") === "true"

    const notifications = await getUserNotifications((session.user as any).id, limit)
    
    const filteredNotifications = unreadOnly 
      ? notifications.filter(n => !n.isRead)
      : notifications

    const unreadCount = await getUnreadNotificationCount((session.user as any).id)

    return NextResponse.json({
      notifications: filteredNotifications,
      unreadCount
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des notifications" },
      { status: 500 }
    )
  }
}

// PUT /api/notifications - Marquer toutes les notifications comme lues
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    await markAllNotificationsAsRead((session.user as any).id)

    return NextResponse.json({ message: "Toutes les notifications ont été marquées comme lues" })
  } catch (error) {
    console.error("Error marking notifications as read:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des notifications" },
      { status: 500 }
    )
  }
}
