"use client"

import type React from "react"
import { useState } from "react"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { AuthLayout } from "@/components/auth-layout"
import { AuthInput } from "@/components/auth-input"
import { AuthButton } from "@/components/auth-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Redirection vers WhatsApp avec message pré-rempli
      const message = `Bonjour, j'ai oublié mon mot de passe pour l'email: ${email}. Pouvez-vous m'aider à le réinitialiser ?`
      const whatsappUrl = `https://wa.me/223851234567?text=${encodeURIComponent(message)}`
      
      // Ouvrir WhatsApp dans un nouvel onglet
      window.open(whatsappUrl, '_blank')
      
      setSuccess(true)
    } catch (error) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout
        title="WhatsApp ouvert"
        subtitle="Contactez notre support via WhatsApp"
        showIllustration={false}
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              WhatsApp ouvert
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Une conversation WhatsApp a été ouverte avec notre support pour l'email{" "}
              <span className="font-medium text-gray-900 dark:text-white">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Notre équipe vous répondra rapidement pour vous aider à réinitialiser votre mot de passe.
            </p>
            
            <div className="flex flex-col space-y-2">
              <AuthButton
                variant="outline"
                onClick={() => {
                  setSuccess(false)
                  setEmail("")
                }}
              >
                Demander à nouveau
              </AuthButton>
              
              <Link href="/auth/signin">
                <AuthButton variant="outline" fullWidth={true}>
                  <ArrowLeft className="h-4 w-4" />
                  Retour à la connexion
                </AuthButton>
              </Link>
            </div>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Mot de passe oublié"
      subtitle="Entrez votre email pour recevoir un lien de réinitialisation"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
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
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.
          </p>
        </div>

        <AuthButton type="submit" loading={loading}>
          Envoyer le lien de réinitialisation
        </AuthButton>

        {/* Back to Sign In */}
        <div className="text-center">
          <Link 
            href="/auth/signin" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour à la connexion
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
