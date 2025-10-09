import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canCreateResource, getSubscriptionLimits } from "@/lib/subscription-limits"

export async function checkSubscriptionLimit(
  resourceType: "farms" | "parcels" | "teamMembers" | "expenses" | "tasks",
  userId?: string,
): Promise<{ allowed: boolean; message?: string; currentCount?: number; limit?: number }> {
  const session = await auth()
  const targetUserId = userId || session?.user?.id

  if (!targetUserId) {
    return { allowed: false, message: "Utilisateur non authentifié" }
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: {
      _count: {
        select: {
          farms: true,
          teamMembers: true,
          expenses: true,
        },
      },
    },
  })

  if (!user) {
    return { allowed: false, message: "Utilisateur non trouvé" }
  }

  let currentCount = 0
  switch (resourceType) {
    case "farms":
      currentCount = user._count.farms
      break
    case "teamMembers":
      currentCount = user._count.teamMembers
      break
    case "expenses":
      // Only count actual expenses, not revenue or other transaction types
      currentCount = await prisma.expense.count({
        where: {
          userId: targetUserId,
          type: "EXPENSE"
        }
      })
      break
    case "tasks":
      // Tasks are linked to team members, not directly to users
      currentCount = await prisma.task.count({
        where: {
          teamMember: {
            userId: targetUserId,
          },
        },
      })
      break
    case "parcels":
      // For parcels, we need to count across all farms
      const parcelCount = await prisma.farm.count({
        where: { userId: targetUserId },
      })
      currentCount = parcelCount
      break
  }

  const allowed = canCreateResource(user.subscription, resourceType, currentCount)

  if (!allowed) {
    const limits = getSubscriptionLimits(user.subscription)
    const limit = limits[resourceType]

    return {
      allowed: false,
      message: `Limite de ${limit === Number.POSITIVE_INFINITY ? "illimité" : limit} ${resourceType} atteinte pour votre abonnement ${user.subscription}`,
      currentCount,
      limit: limit === Number.POSITIVE_INFINITY ? undefined : limit,
    }
  }

  return { allowed: true, currentCount }
}
