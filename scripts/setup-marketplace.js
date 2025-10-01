#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configuration du marketplace FarmLink...\n');

try {
  // 1. Générer le client Prisma
  console.log('📦 Génération du client Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // 2. Créer la migration
  console.log('🗄️  Création de la migration...');
  execSync('npx prisma migrate dev --name add_marketplace_features', { stdio: 'inherit' });
  
  // 3. Vérifier que les fichiers sont créés
  console.log('✅ Vérification des fichiers...');
  
  const requiredFiles = [
    'app/api/marketplace/offers/route.ts',
    'app/api/marketplace/offers/[id]/route.ts',
    'app/api/marketplace/demands/route.ts',
    'app/api/marketplace/demands/[id]/route.ts',
    'app/api/marketplace/negotiations/route.ts',
    'app/api/marketplace/negotiations/[id]/route.ts',
    'app/api/notifications/route.ts',
    'app/api/notifications/[id]/route.ts',
    'lib/websocket.ts',
    'lib/notifications.ts',
    'lib/geolocation.ts',
    'hooks/useWebSocket.ts',
    'components/notifications.tsx',
    'components/location-picker.tsx',
    'components/marketplace-map.tsx'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.log('❌ Fichiers manquants:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
    process.exit(1);
  }
  
  console.log('✅ Tous les fichiers sont présents');
  
  // 4. Instructions finales
  console.log('\n🎉 Marketplace configuré avec succès !\n');
  console.log('📋 Prochaines étapes:');
  console.log('   1. Redémarrer le serveur de développement');
  console.log('   2. Tester les fonctionnalités du marketplace');
  console.log('   3. Configurer WebSocket (optionnel)');
  console.log('   4. Ajouter des données de test\n');
  
  console.log('🔗 URLs importantes:');
  console.log('   - Marketplace: /marketplace');
  console.log('   - Créer une offre: /marketplace/offers/create');
  console.log('   - Créer une demande: /marketplace/demands/create');
  console.log('   - Mes annonces: /marketplace/my-listings\n');
  
} catch (error) {
  console.error('❌ Erreur lors de la configuration:', error.message);
  process.exit(1);
}
