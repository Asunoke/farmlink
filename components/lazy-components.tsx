"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Composants lourds chargés de manière paresseuse
export const LazyFarmsClient = dynamic(
  () => import('@/app/dashboard/farms/farms-client').then(mod => ({ default: mod.FarmsClient })),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: false
  }
)

export const LazyBudgetClient = dynamic(
  () => import('@/app/dashboard/budget/budget-client').then(mod => ({ default: mod.BudgetClient })),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: false
  }
)

export const LazyTeamClient = dynamic(
  () => import('@/app/dashboard/team/team-client').then(mod => ({ default: mod.TeamClient })),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: false
  }
)

export const LazyMarketplaceClient = dynamic(
  () => import('@/app/marketplace/marketplace-client').then(mod => ({ default: mod.MarketplaceClient })),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: false
  }
)

// Wrapper avec Suspense pour les composants
export function withSuspense<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function SuspenseWrapper(props: T) {
    return (
      <Suspense fallback={fallback || <div className="animate-pulse bg-muted h-32 rounded" />}>
        <Component {...props} />
      </Suspense>
    )
  }
}
