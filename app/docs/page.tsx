"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const sections = [
  { id: "getting-started", title: "Prise en main" },
  { id: "marketplace", title: "Marché (Offres & Demandes)" },
  { id: "negotiations", title: "Négociations" },
  { id: "account", title: "Compte & Équipe" },
  { id: "faq", title: "FAQ" },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold tracking-tight">Documentation FarmLink</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Tout ce que vous devez savoir pour utiliser FarmLink efficacement.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base">Sommaire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {sections.map((s) => (
                <div key={s.id}>
                  <Link href={`#${s.id}`} className="text-foreground hover:text-primary">
                    {s.title}
                  </Link>
                </div>
              ))}
              <Separator className="my-3" />
              <div>
                Besoin d'aide ? {" "}
                <Link href="/contact" className="text-primary underline">Contactez-nous</Link>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-9 space-y-8">
          <Card id="getting-started">
            <CardHeader>
              <CardTitle>Prise en main</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6">
              <p>
                Créez un compte, complétez votre profil et commencez à publier des offres ou des demandes.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Publiez une offre pour vendre vos produits</li>
                <li>Publiez une demande pour trouver des fournisseurs</li>
                <li>Gérez vos annonces depuis "Mes annonces"</li>
              </ul>
            </CardContent>
          </Card>

          <Card id="marketplace">
            <CardHeader>
              <CardTitle>Marché (Offres & Demandes)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6">
              <p>
                Filtrez par catégorie, prix, localisation et entrez en contact via les négociations.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Offres: prix unitaire, quantité, unité et localisation</li>
                <li>Demandes: prix max, quantité, unité et localisation</li>
                <li>Suivez le statut de vos annonces (ACTIVE, SOLD, etc.)</li>
              </ul>
            </CardContent>
          </Card>

          <Card id="negotiations">
            <CardHeader>
              <CardTitle>Négociations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6">
              <p>
                Échangez des messages et des contre‑offres. Le statut passe en ACCEPTED/REJECTED/COUNTER_OFFER selon vos actions.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Historique des messages affiché en bulles</li>
                <li>Contre‑offres: prix et quantité proposés</li>
                <li>Actions rapides: accepter ou rejeter</li>
              </ul>
            </CardContent>
          </Card>

          <Card id="account">
            <CardHeader>
              <CardTitle>Compte & Équipe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6">
              <p>
                Gérez votre profil, votre équipe et vos préférences.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Profil: nom, email, mot de passe</li>
                <li>Équipe: membres et rôles</li>
                <li>Notifications par email</li>
              </ul>
            </CardContent>
          </Card>

          <Card id="faq">
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <details className="group">
                <summary className="cursor-pointer font-medium">Comment démarrer une négociation ?</summary>
                <div className="mt-2 text-muted-foreground">
                  Ouvrez une offre ou une demande et cliquez sur "Négocier".
                </div>
              </details>
              <details className="group">
                <summary className="cursor-pointer font-medium">Puis‑je modifier une annonce ?</summary>
                <div className="mt-2 text-muted-foreground">
                  Oui, depuis la page "Mes annonces" via le menu d'actions.
                </div>
              </details>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
