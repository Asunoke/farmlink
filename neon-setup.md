# Configuration Neon Database pour Vercel

## Problème résolu
```
Error validating datasource `db`: the URL must start with the protocol `prisma://` or `prisma+postgres://`
```

## Solution

### 1. Configuration Neon Database

#### **Étapes :**
1. **Créer un compte Neon** : https://neon.tech
2. **Créer un projet** : Choisir la région la plus proche
3. **Récupérer la connection string** : Format PostgreSQL standard

#### **Format de l'URL Neon :**
```
postgresql://username:password@hostname/database?sslmode=require
```

### 2. Configuration Vercel

#### **Variables d'environnement requises :**
```
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
```

#### **Configuration via Vercel Dashboard :**
1. Aller sur https://vercel.com/dashboard
2. Sélectionner le projet FarmLink
3. Settings → Environment Variables
4. Ajouter `DATABASE_URL` avec l'URL Neon

### 3. Migration de la base de données

#### **Commandes à exécuter :**
```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# Ou utiliser les migrations
npx prisma migrate deploy
```

### 4. Configuration locale

#### **Fichier .env.local :**
```env
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Vérification

#### **Tester la connexion :**
```bash
# Tester la connexion Prisma
npx prisma db pull

# Vérifier les tables
npx prisma studio
```

## Avantages Neon

- ✅ **Gratuit** : Jusqu'à 3GB
- ✅ **PostgreSQL** : Compatible Prisma
- ✅ **Serverless** : Auto-scaling
- ✅ **Régions** : Multiples options
- ✅ **Backup** : Automatique

## Dépannage

### Erreur de connexion :
- Vérifier l'URL de connexion
- S'assurer que SSL est activé
- Vérifier les permissions

### Erreur de migration :
- Vérifier que la base est vide
- Utiliser `npx prisma db push` pour le développement
- Utiliser `npx prisma migrate deploy` pour la production
