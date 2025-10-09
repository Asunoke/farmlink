"use client"

import { forwardRef } from "react"
import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "social"
  icon?: LucideIcon
  loading?: boolean
  fullWidth?: boolean
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ variant = "default", icon: Icon, loading, fullWidth = true, className, children, ...props }, ref) => {
    const baseClasses = "h-12 rounded-2xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
    
    const variantClasses = {
      default: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl",
      outline: "border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300",
      social: "border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-slate-600/50 text-gray-700 dark:text-gray-300"
    }

    return (
      <Button
        ref={ref}
        disabled={loading}
        className={cn(
          baseClasses,
          variantClasses[variant],
          fullWidth && "w-full",
          loading && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Chargement...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            {Icon && <Icon className="h-4 w-4" />}
            <span>{children}</span>
          </div>
        )}
      </Button>
    )
  }
)

AuthButton.displayName = "AuthButton"
