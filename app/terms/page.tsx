"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const sections = [
  { id: "object", title: "1. Objet" },
  { id: "accounts", title: "2. Comptes" },
  { id: "content", title: "3. Contenu" },
  { id: "market", title: "4. Marché et Négociations" },
  { id: "liability", title: "5. Limitation de responsabilité" },
  { id: "termination", title: "6. Résiliation" },
  { id: "privacy", title: "7. Données personnelles" },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold tracking-tight">Conditions Générales d'Utilisation</h1>
          <p className="mt-2 text-muted-foreground">Dernière mise à jour: {new Date().toLocaleDateString()}</p>
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
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-9 space-y-8">
          <Card id="object">
            <CardHeader>
              <CardTitle>1. Objet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p>Ces conditions régissent l'utilisation de la plateforme FarmLink.</p>
            </CardContent>
          </Card>

          <Card id="accounts">
            <CardHeader>
              <CardTitle>2. Comptes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p>Vous êtes responsable de la sécurité de votre compte et de l'exactitude des informations fournies.</p>
            </CardContent>
          </Card>

          <Card id="content">
            <CardHeader>
              <CardTitle>3. Contenu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p>Vous êtes responsable du contenu publié. FarmLink peut retirer tout contenu illicite.</p>
            </CardContent>
          </Card>

          <Card id="market">
            <CardHeader>
              <CardTitle>4. Marché et Négociations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p>Les offres, demandes et négociations sont effectuées sous votre responsabilité.</p>
            </CardContent>
          </Card>

          <Card id="liability">
            <CardHeader>
              <CardTitle>5. Limitation de responsabilité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p>La plateforme est fournie "en l'état" sans garantie. La responsabilité de FarmLink est limitée au maximum permis.</p>
            </CardContent>
          </Card>

          <Card id="termination">
            <CardHeader>
              <CardTitle>6. Résiliation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p>Nous pouvons suspendre ou résilier l'accès en cas de violation des présentes conditions.</p>
            </CardContent>
          </Card>

          <Card id="privacy">
            <CardHeader>
              <CardTitle>7. Données personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p>Le traitement des données est réalisé conformément aux lois applicables. Consultez aussi notre politique de confidentialité si disponible.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
