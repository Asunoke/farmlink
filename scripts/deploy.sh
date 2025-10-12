#!/bin/bash

# Script de déploiement optimisé pour Vercel

echo "🚀 Démarrage du déploiement FarmLink..."

# Vérifier les variables d'environnement
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL n'est pas définie"
    exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ NEXTAUTH_SECRET n'est pas définie"
    exit 1
fi

echo "✅ Variables d'environnement vérifiées"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm ci --only=production

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Vérifier la connexion à la base de données
echo "🗄️ Vérification de la base de données..."
npx prisma db push --accept-data-loss

# Build de l'application
echo "🏗️ Build de l'application..."
npm run build

echo "✅ Déploiement terminé avec succès!"
