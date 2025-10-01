import { prisma } from "@/lib/prisma"
import { NotificationType } from "@prisma/client"

interface CreateNotificationData {
  title: string
  message: string
  type: NotificationType
  userId: string
  data?: any
}

export async function createNotification(data: CreateNotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        userId: data.userId,
        data: data.data || null
      }
    })

    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

export async function getUserNotifications(userId: string, limit = 20) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit
    })

    return notifications
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }
}

export async function markNotificationAsRead(notificationId: string, userId: string) {
  try {
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId
      },
      data: {
        isRead: true
      }
    })

    return notification
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    return result
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}

export async function getUnreadNotificationCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    })

    return count
  } catch (error) {
    console.error("Error getting unread notification count:", error)
    throw error
  }
}

// Fonctions utilitaires pour créer des notifications spécifiques
export async function createNegotiationMessageNotification(
  negotiationId: string,
  senderId: string,
  receiverId: string,
  message: string
) {
  return createNotification({
    title: "Nouveau message de négociation",
    message: `Vous avez reçu un nouveau message: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`,
    type: "NEGOTIATION_MESSAGE",
    userId: receiverId,
    data: { negotiationId, senderId }
  })
}

export async function createNegotiationUpdateNotification(
  negotiationId: string,
  senderId: string,
  receiverId: string,
  status: string
) {
  const statusMessages = {
    ACCEPTED: "votre offre a été acceptée",
    REJECTED: "votre offre a été rejetée",
    COUNTER_OFFER: "une contre-offre a été faite",
    COMPLETED: "la négociation est terminée"
  }

  return createNotification({
    title: "Mise à jour de négociation",
    message: statusMessages[status as keyof typeof statusMessages] || "La négociation a été mise à jour",
    type: "NEGOTIATION_UPDATE",
    userId: receiverId,
    data: { negotiationId, senderId, status }
  })
}

export async function createOfferInterestNotification(
  offerId: string,
  offerTitle: string,
  interestedUserId: string,
  offerOwnerId: string
) {
  return createNotification({
    title: "Intérêt pour votre offre",
    message: `Quelqu'un s'intéresse à votre offre "${offerTitle}"`,
    type: "OFFER_INTEREST",
    userId: offerOwnerId,
    data: { offerId, interestedUserId }
  })
}

export async function createDemandMatchNotification(
  demandId: string,
  demandTitle: string,
  matchingUserId: string,
  demandOwnerId: string
) {
  return createNotification({
    title: "Correspondance trouvée",
    message: `Une offre correspond à votre demande "${demandTitle}"`,
    type: "DEMAND_MATCH",
    userId: demandOwnerId,
    data: { demandId, matchingUserId }
  })
}
