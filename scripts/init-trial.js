// Script pour initialiser l'essai gratuit pour les utilisateurs existants
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function initTrialForExistingUsers() {
  try {
    console.log('🔄 Initialisation de l\'essai gratuit pour les utilisateurs existants...')
    
    // Mettre à jour tous les utilisateurs FREE qui n'ont pas de trialStartDate
    const result = await prisma.user.updateMany({
      where: {
        subscription: 'FREE',
        trialStartDate: null
      },
      data: {
        trialStartDate: new Date()
      }
    })
    
    console.log(`✅ ${result.count} utilisateurs mis à jour avec l'essai gratuit`)
    
    // Afficher les utilisateurs concernés
    const users = await prisma.user.findMany({
      where: {
        subscription: 'FREE',
        trialStartDate: { not: null }
      },
      select: {
        id: true,
        name: true,
        email: true,
        trialStartDate: true,
        createdAt: true
      }
    })
    
    console.log('\n📊 Utilisateurs avec essai gratuit:')
    users.forEach(user => {
      const trialEnd = new Date(user.trialStartDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      console.log(`- ${user.name || user.email} (${user.email})`)
      console.log(`  Essai jusqu'au: ${trialEnd.toLocaleDateString('fr-FR')}`)
    })
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le script
initTrialForExistingUsers()
