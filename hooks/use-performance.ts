"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

// Hook pour détecter la connexion lente
export function useNetworkStatus() {
  const [isSlowConnection, setIsSlowConnection] = useState(false)
  const [connectionType, setConnectionType] = useState<string>('unknown')

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection
      
      setConnectionType(connection.effectiveType || 'unknown')
      setIsSlowConnection(
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g' ||
        connection.downlink < 1.5
      )

      const handleChange = () => {
        setConnectionType(connection.effectiveType || 'unknown')
        setIsSlowConnection(
          connection.effectiveType === 'slow-2g' || 
          connection.effectiveType === '2g' ||
          connection.downlink < 1.5
        )
      }

      connection.addEventListener('change', handleChange)
      return () => connection.removeEventListener('change', handleChange)
    }
  }, [])

  return { isSlowConnection, connectionType }
}

// Hook pour le lazy loading avec intersection observer
export function useIntersectionObserver(
  threshold: number = 0.1,
  rootMargin: string = '0px'
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, hasIntersected])

  return { ref, isIntersecting, hasIntersected }
}

// Hook pour le debouncing
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook pour la mise en cache des données
export function useDataCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes par défaut
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Vérifier le cache local
      const cached = localStorage.getItem(`cache_${key}`)
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < ttl) {
          setData(cachedData)
          setLoading(false)
          return
        }
      }

      // Récupérer les données
      const result = await fetcher()
      setData(result)
      
      // Mettre en cache
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data: result,
        timestamp: Date.now()
      }))
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, ttl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Hook pour les performances de rendu
export function useRenderPerformance(componentName: string) {
  const renderStart = useRef<number>(0)
  const [renderTime, setRenderTime] = useState<number>(0)

  useEffect(() => {
    renderStart.current = performance.now()
    
    return () => {
      const renderEnd = performance.now()
      const time = renderEnd - renderStart.current
      setRenderTime(time)
      
      if (time > 16) { // Plus de 16ms (60fps)
        console.warn(`${componentName} took ${time.toFixed(2)}ms to render`)
      }
    }
  }, [componentName])

  return renderTime
}
