"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { AuthLayout } from "@/components/auth-layout"
import { AuthInput } from "@/components/auth-input"
import { AuthButton } from "@/components/auth-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou mot de passe incorrect")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Bienvenue de retour"
      subtitle="Connectez-vous à votre compte FarmLink"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AuthInput
          id="email"
          label="Adresse email"
          icon={Mail}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
        />

        <div className="space-y-2">
          <AuthInput
            id="password"
            label="Mot de passe"
            icon={Lock}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showPassword ? "Masquer" : "Afficher"}</span>
            </button>
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 font-medium"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <AuthButton type="submit" loading={loading}>
          Se connecter
        </AuthButton>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pas encore de compte ?{" "}
            <Link 
              href="/auth/signup" 
              className="text-green-600 hover:text-green-700 dark:text-green-400 font-medium"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
