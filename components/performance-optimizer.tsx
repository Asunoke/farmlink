"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// Lazy loading component
export function LazySection({ 
  children, 
  className = "",
  threshold = 0.1 
}: { 
  children: React.ReactNode
  className?: string
  threshold?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(ref)

    return () => observer.disconnect()
  }, [ref, threshold])

  return (
    <div ref={setRef} className={className}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

// Image preloader
export function ImagePreloader({ 
  src, 
  onLoad 
}: { 
  src: string
  onLoad: () => void 
}) {
  useEffect(() => {
    const img = new Image()
    img.onload = onLoad
    img.src = src
  }, [src, onLoad])

  return null
}

// Performance monitor
export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            setMetrics(prev => ({
              ...prev,
              loadTime: entry.duration
            }))
          }
        })
      })

      observer.observe({ entryTypes: ['navigation', 'measure'] })

      // Monitor memory usage if available
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
        }))
      }

      return () => observer.disconnect()
    }
  }, [])

  return null
}

// Critical CSS loader
export function CriticalCSSLoader() {
  useEffect(() => {
    // Preload critical CSS
    const criticalCSS = `
      .hero-section { 
        background: linear-gradient(135deg, #0D1B2A 0%, #1a2a3a 50%, #0D1B2A 100%);
      }
      .feature-card {
        transition: all 0.3s ease;
      }
      .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      }
    `

    const style = document.createElement('style')
    style.textContent = criticalCSS
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}

// Resource hints
export function ResourceHints() {
  useEffect(() => {
    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })

    // Preload critical resources (only if they exist)
    const criticalResources = [
      '/hero-bg.jpg',
      '/african-farmer-man.jpg',
      '/african-farmer-woman.jpg'
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource
      link.as = 'image'
      document.head.appendChild(link)
    })
  }, [])

  return null
}

// Bundle analyzer (development only)
export function BundleAnalyzer() {
  const [bundleSize, setBundleSize] = useState(0)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Simulate bundle size monitoring
      const scripts = document.querySelectorAll('script[src]')
      let totalSize = 0

      scripts.forEach(script => {
        const src = script.getAttribute('src')
        if (src) {
          // This is a simplified version - in reality you'd fetch the actual file size
          totalSize += 50 // KB per script estimate
        }
      })

      setBundleSize(totalSize)
    }
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
      Bundle: {bundleSize}KB
    </div>
  )
}
