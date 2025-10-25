"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Leaf, LayoutDashboard, Users, Calculator, TrendingUp, Cloud, Settings, Menu, Bell, ShoppingCart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserNav } from "@/components/user-nav"
import { NotificationsBadge } from "@/components/notifications-badge"

// Navigation principale - éléments essentiels
const mainNavigation = [
  {
    name: "Tableau de Bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Fermes",
    href: "/dashboard/farms",
    icon: Leaf,
  },
  {
    name: "Finances",
    href: "/dashboard/budget",
    icon: Calculator,
  },
  {
    name: "Équipe",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    name: "Marché",
    href: "/marketplace",
    icon: ShoppingCart,
  },
]

// Navigation secondaire - éléments moins fréquents
const secondaryNavigation = [
  {
    name: "Météo",
    href: "/dashboard/weather",
    icon: Cloud,
  },
  {
    name: "Rapports",
    href: "/dashboard/reports",
    icon: TrendingUp,
  },
  {
    name: "Profil",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSecondary, setShowSecondary] = useState(false)

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-[#0B1623] border-r border-[#D4AF37]/20">
          <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b border-[#D4AF37]/20 px-6">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-[#D4AF37]" />
                <span className="text-xl font-bold text-[#D4AF37]">FarmLink</span>
              </Link>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {/* Navigation principale */}
              <div className="space-y-1">
                {mainNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg",
                        isActive
                          ? "bg-[#006633] text-white shadow-lg"
                          : "text-[#F5F5DC] hover:bg-[#D4AF37] hover:text-[#0D1B2A]",
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>

              {/* Séparateur */}
              <div className="border-t border-[#D4AF37]/20 my-4" />

              {/* Navigation secondaire */}
              <div className="space-y-1">
                {secondaryNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg",
                        isActive
                          ? "bg-[#006633] text-white shadow-lg"
                          : "text-[#F5F5DC] hover:bg-[#D4AF37] hover:text-[#0D1B2A]",
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-[#D4AF37]/20 bg-[#0B1623] px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-[#D4AF37]" />
              <span className="text-xl font-bold text-[#D4AF37]">FarmLink</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {/* Navigation principale */}
                  {mainNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg",
                            isActive
                              ? "bg-[#006633] text-white shadow-lg"
                              : "text-[#F5F5DC] hover:bg-[#D4AF37] hover:text-[#0D1B2A]",
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              
              {/* Séparateur */}
              <li>
                <div className="border-t border-[#D4AF37]/20" />
              </li>
              
              {/* Navigation secondaire avec bouton de toggle */}
              <li>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#D4AF37]/70 uppercase tracking-wider">
                    Plus
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSecondary(!showSecondary)}
                    className="text-[#D4AF37]/70 hover:text-[#D4AF37] p-1"
                  >
                    <span className="sr-only">Toggle secondary navigation</span>
                    <span className={`transform transition-transform ${showSecondary ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </Button>
                </div>
                {showSecondary && (
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {secondaryNavigation.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={cn(
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg",
                              isActive
                                ? "bg-[#006633] text-white shadow-lg"
                                : "text-[#F5F5DC] hover:bg-[#D4AF37] hover:text-[#0D1B2A]",
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {item.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation - version allégée */}
        <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 border-b border-[#D4AF37]/20 bg-[#0D1B2A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0D1B2A]/60 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden text-[#F5F5DC] hover:bg-[#D4AF37] hover:text-[#0D1B2A]" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Ouvrir la sidebar</span>
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications - seulement si nécessaire */}
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="sm" className="relative text-[#F5F5DC] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
                  <Bell className="h-4 w-4" />
                  <NotificationsBadge />
                  <span className="sr-only">Notifications</span>
                </Button>
              </Link>

              <UserNav />
            </div>
          </div>
        </div>

        {/* Page content - version allégée */}
        <main className="py-4">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
