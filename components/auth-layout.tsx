"use client"

import { ReactNode } from "react"
import { Leaf, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  showIllustration?: boolean
}

export function AuthLayout({ children, title, subtitle, showIllustration = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #16a34a 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            FarmLink
          </span>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Glassmorphic Card */}
            <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {subtitle}
                </p>
              </div>

              {/* Form Content */}
              {children}
            </div>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p>
                En continuant, vous acceptez nos{" "}
                <a href="/terms" className="text-green-600 hover:text-green-700 dark:text-green-400 font-medium">
                  Conditions d'utilisation
                </a>{" "}
                et{" "}
                <a href="/privacy" className="text-green-600 hover:text-green-700 dark:text-green-400 font-medium">
                  Politique de confidentialité
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Illustration */}
        {showIllustration && (
          <div className="hidden lg:flex lg:flex-1 items-center justify-center p-12">
            <div className="relative">
              {/* Main Illustration */}
              <div className="w-96 h-96 relative">
                {/* Background Circles */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl" />
                <div className="absolute inset-4 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-2xl" />
                
                {/* Central Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full border border-green-200/30 dark:border-green-700/30 flex items-center justify-center">
                    <div className="w-48 h-48 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full border border-green-300/40 dark:border-green-600/40 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center">
                        <Leaf className="h-16 w-16 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-8 left-8 w-8 h-8 bg-amber-400/30 rounded-full animate-pulse" />
                <div className="absolute top-16 right-12 w-6 h-6 bg-green-400/30 rounded-full animate-pulse delay-1000" />
                <div className="absolute bottom-12 left-12 w-4 h-4 bg-emerald-400/30 rounded-full animate-pulse delay-500" />
                <div className="absolute bottom-8 right-8 w-10 h-10 bg-orange-400/30 rounded-full animate-pulse delay-700" />
              </div>

              {/* Inspirational Text */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cultivons l'avenir ensemble 🌱
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Connectons les esprits et les terres 🌍
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
