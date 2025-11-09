"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, Eye, EyeOff, Check } from "lucide-react"
import { AuthLayout } from "@/components/auth-layout"
import { AuthInput } from "@/components/auth-input"
import { AuthButton } from "@/components/auth-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Rediriger vers la page de bienvenue avec les informations de l'utilisateur
        router.push(`/auth/welcome?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`)
      } else {
        const data = await response.json()
        setError(data.error || "Une erreur est survenue")
      }
    } catch (error) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(password)
  const isPasswordValid = passwordStrength >= 3

  return (
    <AuthLayout
      title="Rejoignez FarmLink"
      subtitle="Créez votre compte et commencez votre aventure agricole"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AuthInput
          id="name"
          label="Nom complet"
          icon={User}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jean Dupont"
          required
        />

        <AuthInput
          id="email"
          label="Adresse email"
          icon={Mail}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jean@exemple.com"
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
          </div>
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full ${
                      level <= passwordStrength
                        ? passwordStrength < 3
                          ? "bg-red-500"
                          : passwordStrength < 4
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Check className={`h-3 w-3 ${password.length >= 8 ? "text-green-500" : "text-gray-400"}`} />
                <span className={password.length >= 8 ? "text-green-600" : "text-gray-500"}>
                  Au moins 8 caractères
                </span>
                <Check className={`h-3 w-3 ${/[A-Z]/.test(password) ? "text-green-500" : "text-gray-400"}`} />
                <span className={/[A-Z]/.test(password) ? "text-green-600" : "text-gray-500"}>
                  Majuscule
                </span>
                <Check className={`h-3 w-3 ${/[0-9]/.test(password) ? "text-green-500" : "text-gray-400"}`} />
                <span className={/[0-9]/.test(password) ? "text-green-600" : "text-gray-500"}>
                  Chiffre
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <AuthInput
            id="confirmPassword"
            label="Confirmer le mot de passe"
            icon={Lock}
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showConfirmPassword ? "Masquer" : "Afficher"}</span>
            </button>
            {confirmPassword && password !== confirmPassword && (
              <span className="text-sm text-red-500">Les mots de passe ne correspondent pas</span>
            )}
            {confirmPassword && password === confirmPassword && (
              <span className="text-sm text-green-500 flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Correspond
              </span>
            )}
          </div>
        </div>

        <AuthButton 
          type="submit" 
          loading={loading}
          disabled={!isPasswordValid || password !== confirmPassword}
        >
          Créer mon compte
        </AuthButton>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Déjà un compte ?{" "}
            <Link 
              href="/auth/signin" 
              className="text-green-600 hover:text-green-700 dark:text-green-400 font-medium"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
