// Mobile optimization utilities
export const mobileOptimizations = {
  // Viewport configuration
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true
  },

  // Touch optimizations
  touch: {
    // Minimum touch target size (44px recommended by Apple)
    minTouchTarget: '44px',
    // Touch action for better scrolling
    touchAction: 'manipulation'
  },

  // Performance optimizations for mobile
  performance: {
    // Lazy loading threshold
    lazyLoadThreshold: 0.1,
    // Image optimization
    imageQuality: 80,
    imageFormats: ['webp', 'avif', 'jpeg'],
    // Critical CSS inline
    inlineCriticalCSS: true,
    // Preload critical resources
    preloadCritical: true
  },

  // Mobile-specific breakpoints
  breakpoints: {
    xs: '320px',
    sm: '640px', 
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },

  // Mobile navigation
  navigation: {
    // Hamburger menu
    hamburgerSize: '24px',
    // Mobile menu overlay
    overlayOpacity: 0.95,
    // Touch-friendly spacing
    touchSpacing: '16px'
  },

  // Mobile forms
  forms: {
    // Input sizing
    inputHeight: '48px',
    // Touch-friendly buttons
    buttonMinHeight: '48px',
    // Form validation
    validationDelay: 300
  },

  // Mobile images
  images: {
    // Responsive image sizes
    sizes: {
      hero: '(max-width: 768px) 100vw, 50vw',
      feature: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
      testimonial: '(max-width: 768px) 100vw, 50vw'
    },
    // Placeholder generation
    placeholder: 'blur',
    // Loading optimization
    loading: 'lazy'
  }
}

// Mobile-specific CSS utilities
export const mobileCSS = `
  /* Mobile-first responsive design */
  @media (max-width: 768px) {
    .mobile-optimized {
      padding: 1rem;
      font-size: 16px; /* Prevent zoom on iOS */
    }
    
    .mobile-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
    }
    
    .mobile-hero {
      padding: 2rem 1rem;
      text-align: center;
    }
    
    .mobile-hero h1 {
      font-size: 2rem;
      line-height: 1.2;
    }
    
    .mobile-hero p {
      font-size: 1.1rem;
      margin: 1rem 0;
    }
    
    .mobile-cta {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }
    
    .mobile-cta button {
      width: 100%;
      padding: 1rem;
      font-size: 1.1rem;
    }
    
    .mobile-features {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .mobile-feature-card {
      padding: 1.5rem;
      margin: 0.5rem 0;
    }
    
    .mobile-testimonials {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .mobile-pricing {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .mobile-pricing-card {
      margin: 1rem 0;
    }
    
    /* Touch optimizations */
    .touch-target {
      min-height: 44px;
      min-width: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }
    
    /* Prevent horizontal scroll */
    body {
      overflow-x: hidden;
    }
    
    /* Mobile typography */
    .mobile-text {
      line-height: 1.6;
      letter-spacing: 0.01em;
    }
    
    /* Mobile animations */
    .mobile-animate {
      animation-duration: 0.3s;
      animation-timing-function: ease-out;
    }
  }
  
  /* Tablet optimizations */
  @media (min-width: 768px) and (max-width: 1024px) {
    .tablet-optimized {
      padding: 2rem;
    }
    
    .tablet-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
  }
  
  /* High DPI displays */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .high-dpi-optimized {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }
  }
`

// Mobile performance monitoring
export function monitorMobilePerformance() {
  if (typeof window === 'undefined') return

  // Monitor mobile-specific metrics
  const metrics = {
    // Connection type
    connectionType: (navigator as any).connection?.effectiveType || 'unknown',
    // Device memory
    deviceMemory: (navigator as any).deviceMemory || 'unknown',
    // Hardware concurrency
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    // Touch support
    touchSupport: 'ontouchstart' in window,
    // Screen dimensions
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    // Viewport dimensions
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight
  }

  // Send metrics to analytics
  if (window.gtag) {
    window.gtag('event', 'mobile_performance', {
      event_category: 'performance',
      custom_map: metrics
    })
  }

  return metrics
}

// Mobile-specific optimizations
export function applyMobileOptimizations() {
  if (typeof window === 'undefined') return

  // Add mobile-specific classes
  document.body.classList.add('mobile-optimized')
  
  // Optimize images for mobile
  const images = document.querySelectorAll('img')
  images.forEach(img => {
    img.loading = 'lazy'
    img.decoding = 'async'
  })
  
  // Optimize touch interactions
  const touchElements = document.querySelectorAll('button, a, [role="button"]')
  touchElements.forEach(element => {
    element.classList.add('touch-target')
  })
  
  // Monitor performance
  monitorMobilePerformance()
}
