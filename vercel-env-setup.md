# Configuration des variables d'environnement Vercel

## Problème
```
Environment Variable "DATABASE_URL" references Secret "database_url", which does not exist.
```

## Solution

### 1. Configuration via Vercel Dashboard

1. **Aller sur le dashboard Vercel** : https://vercel.com/dashboard
2. **Sélectionner le projet** FarmLink
3. **Aller dans Settings** → **Environment Variables**
4. **Ajouter les variables suivantes** :

#### Variables requises :
```
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 2. Configuration via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Configurer les variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

### 3. Configuration via fichier .env.local

Créer un fichier `.env.local` (ne pas commiter) :

```env
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configuration pour différents environnements

#### Production :
```
DATABASE_URL=postgresql://prod_user:prod_pass@prod_host:5432/farmlink_prod
NEXTAUTH_SECRET=production-secret-key
NEXTAUTH_URL=https://farmlink.vercel.app
```

#### Preview :
```
DATABASE_URL=postgresql://preview_user:preview_pass@preview_host:5432/farmlink_preview
NEXTAUTH_SECRET=preview-secret-key
NEXTAUTH_URL=https://farmlink-git-branch.vercel.app
```

#### Development :
```
DATABASE_URL=postgresql://dev_user:dev_pass@localhost:5432/farmlink_dev
NEXTAUTH_SECRET=development-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## Étapes de résolution

1. **Vérifier la base de données** : S'assurer qu'elle est accessible
2. **Configurer les variables** : Dans Vercel Dashboard
3. **Redéployer** : `vercel deploy`
4. **Vérifier les logs** : Dans Vercel Dashboard → Functions

## Base de données recommandée

### Option 1 : Vercel Postgres
- **Avantage** : Intégré à Vercel
- **Configuration** : Automatique
- **Prix** : Payant

### Option 2 : Supabase
- **Avantage** : Gratuit jusqu'à 500MB
- **Configuration** : Manuel
- **Prix** : Gratuit pour commencer

### Option 3 : PlanetScale
- **Avantage** : MySQL compatible
- **Configuration** : Manuel
- **Prix** : Gratuit pour commencer

## Commandes utiles

```bash
# Vérifier les variables d'environnement
vercel env ls

# Ajouter une variable
vercel env add VARIABLE_NAME

# Supprimer une variable
vercel env rm VARIABLE_NAME

# Redéployer
vercel deploy
```
