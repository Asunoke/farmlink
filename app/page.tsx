import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Leaf, Users, TrendingUp, Cloud, Calculator, Shield, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">FarmLink</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Fonctionnalités
              </Link>
              <Link href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
                Marché
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Tarifs
              </Link>
              <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
            <Button asChild>
              <Link href="/dashboard">Commencer</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2" />
              {"Nouveau : Intégration météo en temps réel"}
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6">
              {"La plateforme complète pour"}
              <span className="text-primary"> {"gérer votre ferme"}</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              {
                "Optimisez vos rendements agricoles avec FarmLink. Gérez vos équipes, suivez vos budgets et prenez des décisions éclairées grâce aux prévisions météo."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  {"Essai gratuit"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                {"Voir la démo"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Fermes connectées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">25%</div>
              <div className="text-muted-foreground">{"Augmentation des rendements"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">30%</div>
              <div className="text-muted-foreground">{"Réduction des coûts"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support technique</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">{"Nos fonctionnalités principales"}</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              {"Tout ce dont vous avez besoin pour gérer efficacement votre exploitation agricole au Mali."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{"Gestion des Cultures"}</h3>
                <p className="text-muted-foreground">
                  {"Suivez vos plantations, planifiez les récoltes et optimisez vos cycles de production."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{"Suivi Budgétaire"}</h3>
                <p className="text-muted-foreground">
                  {"Gérez vos dépenses, suivez vos revenus et analysez la rentabilité de vos activités."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-chart-2" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{"Gestion d'Équipe"}</h3>
                <p className="text-muted-foreground">
                  {"Organisez vos équipes, planifiez les tâches et suivez la productivité de vos employés."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mb-4">
                  <Cloud className="h-6 w-6 text-chart-3" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{"Météo en Temps Réel"}</h3>
                <p className="text-muted-foreground">
                  {"Accédez aux prévisions météorologiques précises pour planifier vos activités agricoles."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{"Analyses Avancées"}</h3>
                <p className="text-muted-foreground">
                  {"Obtenez des insights détaillés sur vos performances et identifiez les opportunités d'amélioration."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="h-6 w-6 text-chart-5" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{"Marché Agricole"}</h3>
                <p className="text-muted-foreground">
                  {"Connectez-vous avec d'autres agriculteurs pour acheter, vendre et négocier vos produits."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">{"Tarifs transparents"}</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              {"Choisissez le plan qui correspond à la taille de votre exploitation."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Starter</h3>
                  <div className="text-3xl font-bold mb-1">
                    15,000 <span className="text-sm font-normal">FCFA/mois</span>
                  </div>
                  <p className="text-muted-foreground">{"Pour les petites exploitations"}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {"Jusqu'à 5 hectares"}
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {"Suivi budgétaire de base"}
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {"Prévisions météo"}
                  </li>
                </ul>
                <Button variant="outline" className="w-full bg-transparent">
                  {"Commencer"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/50 relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{"Populaire"}</Badge>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Professional</h3>
                  <div className="text-3xl font-bold mb-1">
                    35,000 <span className="text-sm font-normal">FCFA/mois</span>
                  </div>
                  <p className="text-muted-foreground">{"Pour les exploitations moyennes"}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {"Jusqu'à 50 hectares"}
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {"Gestion d'équipe complète"}
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {"Analyses avancées"}
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {"Support prioritaire"}
                  </li>
                </ul>
                <Button className="w-full">{"Commencer"}</Button>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold mb-1">
                    75,000 <span className="text-sm font-normal">FCFA/mois</span>
                  </div>
                  <p className="text-muted-foreground">{"Pour les grandes exploitations"}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {"Superficie illimitée"}
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {"API personnalisée"}
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {"Formation sur site"}
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {"Support dédié 24/7"}
                  </li>
                </ul>
                <Button variant="outline" className="w-full bg-transparent">
                  {"Nous contacter"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-6">
              {"Prêt à révolutionner votre agriculture ?"}
            </h2>
            <p className="text-xl text-muted-foreground text-pretty mb-8">
              {
                "Rejoignez des centaines d'agriculteurs maliens qui ont déjà transformé leur façon de gérer leurs exploitations."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  {"Commencer gratuitement"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                {"Planifier une démo"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">FarmLink</span>
              </div>
              <p className="text-muted-foreground">{"La solution de gestion agricole adaptée au contexte malien."}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Formation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Carrières
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 FarmLink. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
