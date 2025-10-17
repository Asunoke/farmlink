import { unstable_cache } from 'next/cache'

// Cache pour les données des fermes
export const getCachedFarms = unstable_cache(
  async (userId: string) => {
    const { prisma } = await import('@/lib/prisma')
    return prisma.farm.findMany({
      where: { userId },
      include: {
        plots: true,
        _count: {
          select: { plots: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  },
  ['farms'],
  {
    tags: ['farms'],
    revalidate: 300 // 5 minutes
  }
)

// Cache pour les données de budget
export const getCachedExpenses = unstable_cache(
  async (userId: string) => {
    const { prisma } = await import('@/lib/prisma')
    return prisma.expense.findMany({
      where: { userId },
      include: {
        plot: {
          select: {
            name: true,
            farm: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    })
  },
  ['expenses'],
  {
    tags: ['expenses'],
    revalidate: 300
  }
)

// Cache pour les données de l'équipe
export const getCachedTeamMembers = unstable_cache(
  async (userId: string) => {
    const { prisma } = await import('@/lib/prisma')
    return prisma.teamMember.findMany({
      where: { userId },
      include: {
        tasks: true
      },
      orderBy: { createdAt: 'desc' }
    })
  },
  ['team-members'],
  {
    tags: ['team-members'],
    revalidate: 300
  }
)

// Cache pour les données du marketplace
export const getCachedOffers = unstable_cache(
  async () => {
    const { prisma } = await import('@/lib/prisma')
    return prisma.marketplaceOffer.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
  },
  ['marketplace-offers'],
  {
    tags: ['marketplace-offers'],
    revalidate: 600 // 10 minutes
  }
)

// Fonction pour invalider le cache
export async function revalidateCache(tags: string[]) {
  const { revalidateTag } = await import('next/cache')
  tags.forEach(tag => revalidateTag(tag))
}
