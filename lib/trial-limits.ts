import { prisma } from "./prisma"

export const TRIAL_DAYS = 7

export async function checkTrialExpired(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      subscription: true, 
      trialStartDate: true,
      createdAt: true 
    }
  })

  if (!user) return true

  // Si l'utilisateur n'est pas sur le plan FREE, il n'y a pas de limitation
  if (user.subscription !== 'FREE') return false

  // Si pas de date de début d'essai, utiliser la date de création
  const trialStart = user.trialStartDate || user.createdAt
  const trialEnd = new Date(trialStart.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000)
  
  return new Date() > trialEnd
}

export async function getTrialDaysLeft(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      subscription: true, 
      trialStartDate: true,
      createdAt: true 
    }
  })

  if (!user || user.subscription !== 'FREE') return 0

  const trialStart = user.trialStartDate || user.createdAt
  const trialEnd = new Date(trialStart.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000)
  const now = new Date()
  
  if (now > trialEnd) return 0
  
  const diffTime = trialEnd.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export async function startTrial(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { 
      trialStartDate: new Date(),
      subscription: 'FREE'
    }
  })
}
