#!/bin/bash

# Script pour configurer les variables d'environnement Vercel

echo "🚀 Configuration des variables d'environnement Vercel..."

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé"
    echo "Installer avec: npm i -g vercel"
    exit 1
fi

# Vérifier si l'utilisateur est connecté
if ! vercel whoami &> /dev/null; then
    echo "❌ Vous n'êtes pas connecté à Vercel"
    echo "Se connecter avec: vercel login"
    exit 1
fi

echo "✅ Vercel CLI configuré"

# Variables d'environnement requises
declare -A env_vars=(
    ["DATABASE_URL"]="postgresql://username:password@host:port/database"
    ["NEXTAUTH_SECRET"]="your-secret-key-here"
    ["NEXTAUTH_URL"]="https://your-domain.vercel.app"
)

# Fonction pour ajouter une variable
add_env_var() {
    local var_name=$1
    local default_value=$2
    
    echo "📝 Configuration de $var_name"
    echo "Valeur par défaut: $default_value"
    echo "Entrez la valeur (ou appuyez sur Entrée pour utiliser la valeur par défaut):"
    read -r value
    
    if [ -z "$value" ]; then
        value="$default_value"
    fi
    
    echo "Ajout de $var_name=$value"
    vercel env add "$var_name" production
    vercel env add "$var_name" preview
    vercel env add "$var_name" development
}

# Ajouter chaque variable
for var_name in "${!env_vars[@]}"; do
    add_env_var "$var_name" "${env_vars[$var_name]}"
done

echo "✅ Variables d'environnement configurées"
echo "🔄 Redéploiement en cours..."

# Redéployer
vercel deploy

echo "✅ Déploiement terminé!"
echo "🌐 Vérifiez votre application sur Vercel"
