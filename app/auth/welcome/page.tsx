"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Leaf, Users, Calculator, TrendingUp, Play } from "lucide-react"
import { useOnboarding } from "@/hooks/use-onboarding"

export default function WelcomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)
  const { setShowOnboarding } = useOnboarding()
  
  const name = searchParams.get("name") || "Nouvel utilisateur"
  const email = searchParams.get("email") || ""

  // Timer pour le countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Redirection quand le countdown atteint 0
  useEffect(() => {
    if (countdown === 0) {
      router.push("/auth/signin")
    }
  }, [countdown, router])

  const features = [
    {
      icon: Leaf,
      title: "Gestion des Fermes",
      description: "Organisez vos fermes et parcelles facilement"
    },
    {
      icon: Calculator,
      title: "Budget & Dépenses",
      description: "Suivez vos finances agricoles en temps réel"
    },
    {
      icon: Users,
      title: "Équipe",
      description: "Gérez votre équipe et assignez des tâches"
    },
    {
      icon: TrendingUp,
      title: "Marché Agricole",
      description: "Vendez et achetez vos produits agricoles"
    }
  ]

  const handleStartTutorial = () => {
    setShowOnboarding(true)
    // Ne pas rediriger vers signin, laisser l'onboarding se lancer
  }

  return (
    <AuthLayout 
      title="Bienvenue sur FarmLink"
      subtitle="Votre compte a été créé avec succès"
      showIllustration={false}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#006633] to-[#C1440E]">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-4xl font-bold text-[#0D1B2A] mb-2">
                Bienvenue sur FarmLink ! 🎉
              </CardTitle>
              <CardDescription className="text-xl text-[#0D1B2A]/70">
                Votre compte a été créé avec succès
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 text-center">
              {/* Message de bienvenue personnalisé */}
              <div>
                <h2 className="text-3xl font-semibold mb-4 text-[#0D1B2A]">
                  Salut {name} ! 👋
                </h2>
                <p className="text-lg text-[#0D1B2A]/80 mb-6">
                  Nous sommes ravis de vous accueillir dans la communauté FarmLink.
                </p>
                <p className="text-sm text-[#0D1B2A]/60">
                  Votre compte est prêt à être utilisé. Vous allez être redirigé vers la page de connexion dans{" "}
                  <span className="font-semibold text-[#006633]">{countdown}</span> seconde{countdown > 1 ? "s" : ""}.
                </p>
              </div>

              {/* Fonctionnalités principales */}
              <div>
                <h3 className="text-2xl font-semibold mb-8 text-[#0D1B2A]">
                  Découvrez ce que vous pouvez faire avec FarmLink
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl border border-[#D4AF37]/20 bg-[#F5F5DC]/30">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#006633]/10 mb-4">
                        <feature.icon className="h-6 w-6 text-[#006633]" />
                      </div>
                      <h4 className="font-semibold text-lg text-[#0D1B2A] mb-2">{feature.title}</h4>
                      <p className="text-sm text-[#0D1B2A]/70">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleStartTutorial}
                    size="lg"
                    className="flex items-center gap-2 bg-[#006633] hover:bg-[#C1440E] text-white px-8 py-4 text-lg font-semibold"
                  >
                    <Play className="h-5 w-5" />
                    Commencer le tutoriel
                  </Button>
                  <Button 
                    onClick={() => router.push("/auth/signin")}
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white px-8 py-4 text-lg font-semibold"
                  >
                    Se connecter maintenant
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={() => router.push("/")}
                  className="text-[#0D1B2A]/70 hover:text-[#0D1B2A]"
                >
                  Découvrir FarmLink
                </Button>
              </div>

              {/* Informations supplémentaires */}
              <div className="text-sm text-[#0D1B2A]/60">
                <p>
                  Si vous avez des questions, n'hésitez pas à consulter notre{" "}
                  <a href="/docs" className="text-[#006633] hover:underline font-medium">
                    documentation
                  </a>{" "}
                  ou à nous{" "}
                  <a href="/contact" className="text-[#006633] hover:underline font-medium">
                    contacter
                  </a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthLayout>
  )
}
