"use client"

import { forwardRef } from "react"
import { LucideIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: LucideIcon
  error?: string
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon: Icon, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={props.id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            ref={ref}
            className={cn(
              "pl-10 h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200",
              error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

AuthInput.displayName = "AuthInput"
