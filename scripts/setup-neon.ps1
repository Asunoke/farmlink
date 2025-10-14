# Script PowerShell pour configurer Neon Database

Write-Host "🚀 Configuration Neon Database pour FarmLink..." -ForegroundColor Green

# Vérifier si Prisma CLI est installé
try {
    npx prisma --version | Out-Null
    Write-Host "✅ Prisma CLI configuré" -ForegroundColor Green
} catch {
    Write-Host "❌ Prisma CLI n'est pas installé" -ForegroundColor Red
    Write-Host "Installer avec: npm install prisma @prisma/client" -ForegroundColor Yellow
    exit 1
}

Write-Host "📝 Configuration de la base de données..." -ForegroundColor Cyan

# Demander l'URL de connexion Neon
$databaseUrl = Read-Host "Entrez l'URL de connexion Neon (postgresql://username:password@hostname/database?sslmode=require)"

if ([string]::IsNullOrEmpty($databaseUrl)) {
    Write-Host "❌ URL de base de données requise" -ForegroundColor Red
    exit 1
}

# Créer le fichier .env.local
$envContent = @"
DATABASE_URL="$databaseUrl"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "✅ Fichier .env.local créé" -ForegroundColor Green

# Générer le client Prisma
Write-Host "🔄 Génération du client Prisma..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Client Prisma généré" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de la génération du client Prisma" -ForegroundColor Red
    exit 1
}

# Appliquer le schéma à la base de données
Write-Host "🔄 Application du schéma à la base de données..." -ForegroundColor Yellow
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Schéma appliqué avec succès" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de l'application du schéma" -ForegroundColor Red
    Write-Host "Vérifiez votre URL de connexion Neon" -ForegroundColor Yellow
    exit 1
}

# Vérifier la connexion
Write-Host "🔄 Vérification de la connexion..." -ForegroundColor Yellow
npx prisma db pull

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Connexion à la base de données réussie" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur de connexion à la base de données" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Configuration Neon terminée avec succès!" -ForegroundColor Green
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Configurer les variables d'environnement dans Vercel" -ForegroundColor White
Write-Host "2. Déployer l'application" -ForegroundColor White
Write-Host "3. Vérifier le fonctionnement" -ForegroundColor White
