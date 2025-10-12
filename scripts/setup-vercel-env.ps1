# Script PowerShell pour configurer les variables d'environnement Vercel

Write-Host "🚀 Configuration des variables d'environnement Vercel..." -ForegroundColor Green

# Vérifier si Vercel CLI est installé
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI configuré" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI n'est pas installé" -ForegroundColor Red
    Write-Host "Installer avec: npm i -g vercel" -ForegroundColor Yellow
    exit 1
}

# Vérifier si l'utilisateur est connecté
try {
    vercel whoami | Out-Null
    Write-Host "✅ Connecté à Vercel" -ForegroundColor Green
} catch {
    Write-Host "❌ Vous n'êtes pas connecté à Vercel" -ForegroundColor Red
    Write-Host "Se connecter avec: vercel login" -ForegroundColor Yellow
    exit 1
}

# Variables d'environnement requises
$envVars = @{
    "DATABASE_URL" = "postgresql://username:password@host:port/database"
    "NEXTAUTH_SECRET" = "your-secret-key-here"
    "NEXTAUTH_URL" = "https://your-domain.vercel.app"
}

# Fonction pour ajouter une variable
function Add-EnvVar {
    param(
        [string]$VarName,
        [string]$DefaultValue
    )
    
    Write-Host "📝 Configuration de $VarName" -ForegroundColor Cyan
    Write-Host "Valeur par défaut: $DefaultValue" -ForegroundColor Yellow
    $value = Read-Host "Entrez la valeur (ou appuyez sur Entrée pour utiliser la valeur par défaut)"
    
    if ([string]::IsNullOrEmpty($value)) {
        $value = $DefaultValue
    }
    
    Write-Host "Ajout de $VarName=$value" -ForegroundColor Green
    
    # Ajouter pour tous les environnements
    vercel env add $VarName production
    vercel env add $VarName preview  
    vercel env add $VarName development
}

# Ajouter chaque variable
foreach ($varName in $envVars.Keys) {
    Add-EnvVar $varName $envVars[$varName]
}

Write-Host "✅ Variables d'environnement configurées" -ForegroundColor Green
Write-Host "🔄 Redéploiement en cours..." -ForegroundColor Yellow

# Redéployer
vercel deploy

Write-Host "✅ Déploiement terminé!" -ForegroundColor Green
Write-Host "🌐 Vérifiez votre application sur Vercel" -ForegroundColor Cyan
