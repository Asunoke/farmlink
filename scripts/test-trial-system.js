// Script de test pour vérifier le système d'essai gratuit
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testTrialSystem() {
  try {
    console.log('🧪 Test du système d\'essai gratuit...')
    
    // 1. Vérifier les utilisateurs avec essai gratuit
    const usersWithTrial = await prisma.user.findMany({
      where: {
        subscription: 'FREE',
        trialStartDate: { not: null }
      },
      select: {
        id: true,
        name: true,
        email: true,
        subscription: true,
        trialStartDate: true,
        createdAt: true
      }
    })
    
    console.log(`\n📊 ${usersWithTrial.length} utilisateur(s) avec essai gratuit:`)
    
    usersWithTrial.forEach(user => {
      const trialStart = user.trialStartDate || user.createdAt
      const trialEnd = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      const now = new Date()
      const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const isExpired = now > trialEnd
      
      console.log(`\n👤 ${user.name || user.email} (${user.email})`)
      console.log(`   Plan: ${user.subscription}`)
      console.log(`   Date de création: ${user.createdAt.toLocaleDateString('fr-FR')}`)
      console.log(`   Début d'essai: ${trialStart.toLocaleDateString('fr-FR')}`)
      console.log(`   Fin d'essai: ${trialEnd.toLocaleDateString('fr-FR')}`)
      console.log(`   Jours restants: ${daysLeft}`)
      console.log(`   Statut: ${isExpired ? '❌ Expiré' : '✅ Actif'}`)
    })
    
    // 2. Vérifier les utilisateurs sans essai
    const usersWithoutTrial = await prisma.user.findMany({
      where: {
        subscription: 'FREE',
        trialStartDate: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        subscription: true,
        createdAt: true
      }
    })
    
    if (usersWithoutTrial.length > 0) {
      console.log(`\n⚠️  ${usersWithoutTrial.length} utilisateur(s) sans essai gratuit:`)
      usersWithoutTrial.forEach(user => {
        console.log(`   - ${user.name || user.email} (${user.email}) - Créé le ${user.createdAt.toLocaleDateString('fr-FR')}`)
      })
    }
    
    // 3. Statistiques globales
    const totalUsers = await prisma.user.count()
    const freeUsers = await prisma.user.count({
      where: { subscription: 'FREE' }
    })
    const usersWithTrialCount = usersWithTrial.length
    const usersWithoutTrialCount = usersWithoutTrial.length
    
    console.log(`\n📈 Statistiques:`)
    console.log(`   Total utilisateurs: ${totalUsers}`)
    console.log(`   Utilisateurs FREE: ${freeUsers}`)
    console.log(`   Avec essai gratuit: ${usersWithTrialCount}`)
    console.log(`   Sans essai gratuit: ${usersWithoutTrialCount}`)
    
    // 4. Recommandations
    console.log(`\n💡 Recommandations:`)
    if (usersWithoutTrialCount > 0) {
      console.log(`   - ${usersWithoutTrialCount} utilisateur(s) ont besoin d'un essai gratuit`)
      console.log(`   - Exécutez: node scripts/init-trial.js`)
    } else {
      console.log(`   - ✅ Tous les utilisateurs FREE ont un essai gratuit`)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le test
testTrialSystem()
