"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { UserNav } from "@/components/user-nav"
import { useState } from "react"
import { LayoutDashboard, Settings, Menu, Bell, ShoppingCart, Users, TrendingUp, CreditCard, Package, ShoppingBag } from "lucide-react"

const adminNav = [
  { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Utilisateurs", href: "/admin/users", icon: Users },
  { name: "Paiements", href: "/admin/payments", icon: CreditCard },
  { name: "Négociations", href: "/admin/negotiations", icon: TrendingUp },
  { name: "Offres", href: "/admin/offers", icon: Package },
  { name: "Demandes", href: "/admin/demands", icon: ShoppingBag },
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
]

export function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-[#0B1623] border-r border-[#D4AF37]/20">
          <SheetTitle className="sr-only">Menu admin</SheetTitle>
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b border-[#D4AF37]/20 px-6">
              <Link href="/admin" className="text-xl font-bold text-[#D4AF37]">Admin</Link>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {adminNav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}
                    className={cn("flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-[#006633] text-white" : "text-[#F5F5DC] hover:bg-[#D4AF37] hover:text-[#0D1B2A]")}
                    onClick={() => setSidebarOpen(false)}>
                    <item.icon className="mr-3 h-4 w-4" />{item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-[#D4AF37]/20 bg-[#0B1623] px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/admin" className="text-xl font-bold text-[#D4AF37]">Admin</Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {adminNav.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link href={item.href} className={cn("group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                          isActive ? "bg-[#006633] text-white" : "text-[#F5F5DC] hover:bg-[#D4AF37] hover:text-[#0D1B2A]")}> 
                          <item.icon className="h-4 w-4 shrink-0" />{item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-[#D4AF37]/20 bg-[#0D1B2A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0D1B2A]/60 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden text-[#F5F5DC] hover:bg-[#D4AF37] hover:text-[#0D1B2A]" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Ouvrir la sidebar</span>
          </Button>
          <div className="flex flex-1" />
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <Button variant="ghost" size="sm" className="relative text-[#F5F5DC] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-[#C1440E] text-white">3</Badge>
              <span className="sr-only">Voir les notifications</span>
            </Button>
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-[#D4AF37]/20" />
            <UserNav />
          </div>
        </div>

        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}


