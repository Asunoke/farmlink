# Configuration des variables d'environnement

## Variables requises pour Vercel

### 1. DATABASE_URL
```
Format: postgresql://username:password@host:port/database
Exemple: postgresql://user:pass@localhost:5432/farmlink
```

### 2. NEXTAUTH_SECRET
```
Générer avec: openssl rand -base64 32
Exemple: abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### 3. NEXTAUTH_URL
```
Production: https://your-domain.vercel.app
Preview: https://your-project-git-branch.vercel.app
Development: http://localhost:3000
```

## Configuration rapide

### Via Vercel Dashboard :
1. Aller sur https://vercel.com/dashboard
2. Sélectionner le projet
3. Settings → Environment Variables
4. Ajouter les 3 variables ci-dessus

### Via CLI :
```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET  
vercel env add NEXTAUTH_URL
```

## Base de données recommandée

### Vercel Postgres (recommandé)
- Intégré à Vercel
- Configuration automatique
- Payant mais optimisé

### Supabase (gratuit)
- PostgreSQL gratuit
- Interface web
- Jusqu'à 500MB gratuit

### PlanetScale (MySQL)
- MySQL compatible
- Branching
- Gratuit pour commencer
