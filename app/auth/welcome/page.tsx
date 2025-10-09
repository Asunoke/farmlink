"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Leaf, Users, Calculator, TrendingUp } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)
  
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

  return (
    <AuthLayout>
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-green-600">
              Bienvenue sur FarmLink ! 🎉
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Votre compte a été créé avec succès
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Message de bienvenue personnalisé */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Salut {name} ! 👋
              </h2>
              <p className="text-muted-foreground mb-4">
                Nous sommes ravis de vous accueillir dans la communauté FarmLink.
              </p>
              <p className="text-sm text-muted-foreground">
                Votre compte est prêt à être utilisé. Vous allez être redirigé vers la page de connexion dans{" "}
                <span className="font-semibold text-primary">{countdown}</span> seconde{countdown > 1 ? "s" : ""}.
              </p>
            </div>

            {/* Fonctionnalités principales */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">
                Découvrez ce que vous pouvez faire avec FarmLink
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push("/auth/signin")}
                className="flex items-center gap-2"
              >
                Se connecter maintenant
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/")}
              >
                Découvrir FarmLink
              </Button>
            </div>

            {/* Informations supplémentaires */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Si vous avez des questions, n'hésitez pas à consulter notre{" "}
                <a href="/docs" className="text-primary hover:underline">
                  documentation
                </a>{" "}
                ou à nous{" "}
                <a href="/contact" className="text-primary hover:underline">
                  contacter
                </a>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  )
}
