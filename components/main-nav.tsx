"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, X, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { UserNav } from "@/components/user-nav"

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "À propos", href: "/about" },
  { name: "Fonctionnalités", href: "/features" },
  { name: "Tarifs", href: "/pricing" },
  { name: "Contact", href: "/contact" },
]

export function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D4AF37]/20 bg-[#0D1B2A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0D1B2A]/60">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#006633] to-[#D4AF37] flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#D4AF37]">FarmLink</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#D4AF37]",
                  pathname === item.href
                    ? "text-[#D4AF37]"
                    : "text-[#F5F5DC]"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {session?.user ? (
              <UserNav />
            ) : (
              <>
                <Button variant="ghost" asChild className="text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10">
                  <Link href="/auth/signin">Se connecter</Link>
                </Button>
                <Button asChild className="bg-[#006633] hover:bg-[#C1440E] text-white">
                  <Link href="/auth/signup">Commencer</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 p-2"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-gradient-to-b from-[#0D1B2A] to-[#1a2a3a] border-l border-[#D4AF37]/30">
              <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D4AF37]/20">
                  <Link href="/" className="flex items-center space-x-3" onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#006633] to-[#D4AF37] flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-[#D4AF37]">FarmLink</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "block px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg hover:bg-[#D4AF37]/10",
                        pathname === item.href
                          ? "text-[#D4AF37] bg-[#D4AF37]/10 border-l-4 border-[#D4AF37]"
                          : "text-[#F5F5DC] hover:text-[#D4AF37]"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                
                {/* User Section */}
                <div className="space-y-4 pt-6 border-t border-[#D4AF37]/20">
                  {session?.user ? (
                    <>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-[#006633]/20 to-[#D4AF37]/20 rounded-xl border border-[#D4AF37]/30">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#006633] to-[#D4AF37] rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {session.user.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#F5F5DC] truncate">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-[#F5F5DC]/70 truncate">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 py-3 px-4" 
                          asChild
                        >
                          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                            📊 Tableau de Bord
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 py-3 px-4" 
                          asChild
                        >
                          <Link href="/dashboard/profile" onClick={() => setMobileMenuOpen(false)}>
                            👤 Mon Profil
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 py-3 px-4" 
                          asChild
                        >
                          <Link href="/marketplace" onClick={() => setMobileMenuOpen(false)}>
                            🛒 Marché Agricole
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 py-3 px-4" 
                        asChild
                      >
                        <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                          🔐 Se connecter
                        </Link>
                      </Button>
                      <Button 
                        className="w-full bg-gradient-to-r from-[#006633] to-[#C1440E] hover:from-[#C1440E] hover:to-[#006633] text-white py-3 px-4 font-semibold" 
                        asChild
                      >
                        <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                          🚀 Commencer
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
