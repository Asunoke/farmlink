// Optimisations de performance pour le déploiement

export const performanceConfig = {
  // Configuration des images
  images: {
    domains: ['localhost', 'vercel.app'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Configuration du cache
  cache: {
    maxAge: 3600, // 1 heure
    staleWhileRevalidate: 86400, // 24 heures
  },
  
  // Configuration des API routes
  api: {
    maxDuration: 30, // 30 secondes max
    memory: 1024, // 1GB de mémoire
  },
  
  // Configuration de la base de données
  database: {
    connectionLimit: 10,
    acquireTimeoutMillis: 30000,
    timeout: 20000,
  },
  
  // Configuration du monitoring
  monitoring: {
    enableMetrics: true,
    enableLogging: true,
    logLevel: 'info',
  }
}

// Fonction pour optimiser les requêtes
export const optimizeQuery = (query: string) => {
  // Ajouter des index hints si nécessaire
  return query
}

// Fonction pour gérer le cache
export const getCacheKey = (prefix: string, params: Record<string, any>) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|')
  
  return `${prefix}:${sortedParams}`
}

// Fonction pour optimiser les images
export const optimizeImage = (src: string, width?: number, height?: number) => {
  const params = new URLSearchParams()
  
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('q', '75') // Qualité
  
  return `${src}?${params.toString()}`
}

// Fonction pour gérer les erreurs de performance
export const handlePerformanceError = (error: Error, context: string) => {
  console.error(`Performance error in ${context}:`, error)
  
  // En production, envoyer vers un service de monitoring
  if (process.env.NODE_ENV === 'production') {
    // Envoyer vers DataDog, New Relic, etc.
  }
}

// Configuration des timeouts
export const timeouts = {
  database: 10000, // 10 secondes
  api: 30000, // 30 secondes
  external: 5000, // 5 secondes
}

// Fonction pour gérer les timeouts
export const withTimeout = <T>(
  promise: Promise<T>,
  timeout: number,
  context: string
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout in ${context}`)), timeout)
    )
  ])
}
