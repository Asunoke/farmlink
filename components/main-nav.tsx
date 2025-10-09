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
              <Button variant="ghost" size="sm" className="md:hidden text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-[#0B1623] border-l border-[#D4AF37]/20">
              <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-[#006633] to-[#D4AF37] flex items-center justify-center">
                      <Leaf className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-[#D4AF37]">FarmLink</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <nav className="flex-1 space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "block text-sm font-medium transition-colors hover:text-[#D4AF37]",
                        pathname === item.href
                          ? "text-[#D4AF37]"
                          : "text-[#F5F5DC]"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                
                <div className="space-y-3 pt-4 border-t border-[#D4AF37]/20">
                  {session?.user ? (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-[#0D1B2A] rounded-lg border border-[#D4AF37]/20">
                        <div className="w-8 h-8 bg-[#006633] rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {session.user.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#F5F5DC] truncate">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-[#F5F5DC]/70 truncate">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full justify-start text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10" asChild>
                        <Link href="/dashboard">Tableau de Bord</Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10" asChild>
                        <Link href="/dashboard/profile">Mon Profil</Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10" asChild>
                        <Link href="/marketplace">Marché Agricole</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full justify-start text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10" asChild>
                        <Link href="/auth/signin">Se connecter</Link>
                      </Button>
                      <Button className="w-full bg-[#006633] hover:bg-[#C1440E] text-white" asChild>
                        <Link href="/auth/signup">Commencer</Link>
                      </Button>
                    </>
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
