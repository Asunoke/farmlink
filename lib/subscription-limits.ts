export interface SubscriptionLimits {
  farms: number
  parcels: number
  teamMembers: number
  expenses: number
  tasks: number
  weatherApiCalls: number
  features: {
    advancedAnalytics: boolean
    exportData: boolean
    prioritySupport: boolean
    customReports: boolean
    apiAccess: boolean
  }
}

export const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  FREE: {
    farms: 3,
    parcels: 4,
    teamMembers: 10,
    expenses: 500,
    tasks: 100,
    weatherApiCalls: 200,
    features: {
      advancedAnalytics: true,
      exportData: true,
      prioritySupport: false,
      customReports: false,
      apiAccess: false,
    },
  },
  BASIC: {
    farms: 3,
    parcels: 4,
    teamMembers: 10,
    expenses: 500,
    tasks: 100,
    weatherApiCalls: 200,
    features: {
      advancedAnalytics: true,
      exportData: true,
      prioritySupport: false,
      customReports: false,
      apiAccess: false,
    },
  },
  BUSINESS: {
    farms: 5,
    parcels: 10,
    teamMembers: 20,
    expenses: 700,
    tasks: Number.POSITIVE_INFINITY,
    weatherApiCalls: 500,
    features: {
      advancedAnalytics: true,
      exportData: true,
      prioritySupport: true,
      customReports: true,
      apiAccess: true,
    },
  },
  ENTERPRISE: {
    farms: 5,
    parcels: 10,
    teamMembers: 20,
    expenses: 700,
    tasks: Number.POSITIVE_INFINITY,
    weatherApiCalls: 500,
    features: {
      advancedAnalytics: true,
      exportData: true,
      prioritySupport: true,
      customReports: true,
      apiAccess: true,
    },
  },
}

export function getSubscriptionLimits(subscription: string): SubscriptionLimits {
  return SUBSCRIPTION_LIMITS[subscription] || SUBSCRIPTION_LIMITS.FREE
}

export function hasFeatureAccess(subscription: string, feature: keyof SubscriptionLimits["features"]): boolean {
  const limits = getSubscriptionLimits(subscription)
  return limits.features[feature]
}

export function canCreateResource(
  subscription: string,
  resourceType: keyof Omit<SubscriptionLimits, "features">,
  currentCount: number,
): boolean {
  const limits = getSubscriptionLimits(subscription)
  const limit = limits[resourceType]
  return limit === Number.POSITIVE_INFINITY || currentCount < limit
}

export function getUsagePercentage(
  subscription: string,
  resourceType: keyof Omit<SubscriptionLimits, "features">,
  currentCount: number,
): number {
  const limits = getSubscriptionLimits(subscription)
  const limit = limits[resourceType]

  if (limit === Number.POSITIVE_INFINITY) return 0
  return Math.min((currentCount / limit) * 100, 100)
}
