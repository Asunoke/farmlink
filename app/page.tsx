import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Leaf, Users, TrendingUp, Cloud, Calculator, Shield, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { AnimatedSection, AnimatedCard, AnimatedButton } from "@/components/animated-section"
import { FeatureShowcase } from "@/components/feature-showcase"
import { SocialProof } from "@/components/social-proof"
import { StatsSection } from "@/components/stats-section"
import { LazySection, PerformanceMonitor, CriticalCSSLoader, ResourceHints } from "@/components/performance-optimizer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PerformanceMonitor />
      <CriticalCSSLoader />
      <ResourceHints />
      <MainNav />

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-[#0D1B2A] via-[#1a2a3a] to-[#0D1B2A]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-[#C1440E]/5" />
        <div className="container mx-auto px-4 relative">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-[#D4AF37] text-[#0D1B2A] hover:bg-[#C1440E] transition-colors">
              <span className="w-2 h-2 bg-[#006633] rounded-full mr-2" />
              {"Nouveau : Intégration météo en temps réel"}
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6 text-[#D4AF37]">
              {"Augmentez vos rendements de 40%"}
              <span className="text-[#F5F5DC]"> {"avec FarmLink"}</span>
            </h1>
            <p className="text-xl text-[#F5F5DC] text-pretty mb-8 max-w-2xl mx-auto">
              {
                "La plateforme intelligente qui transforme votre agriculture au Mali. Gérez vos fermes, optimisez vos coûts et maximisez vos profits avec des outils adaptés à votre contexte local."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton>
                <Button size="lg" asChild className="bg-[#006633] hover:bg-[#C1440E] text-white border-0 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Link href="/auth/signup">
                    {"Essai gratuit"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </AnimatedButton>
              <AnimatedButton>
                <Button variant="outline" size="lg" asChild className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A] transition-all duration-300">
                  <Link href="/features">
                    {"Voir les fonctionnalitées"}
                  </Link>
                </Button>
              </AnimatedButton>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#F5F5DC]">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4 text-[#0D1B2A]">{"Nos fonctionnalités principales"}</h2>
            <p className="text-xl text-[#0D1B2A]/80 text-pretty max-w-2xl mx-auto mb-8">
              {"Tout ce dont vous avez besoin pour gérer efficacement votre exploitation agricole au Mali."}
            </p>
            <Button asChild variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A] transition-all duration-300">
              <Link href="/features">
                Voir toutes les fonctionnalités
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedCard delay={0.1}>
              <Card className="bg-white border-[#D4AF37]/30 hover:border-[#006633] hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#006633]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#C1440E]/10 transition-colors">
                    <Leaf className="h-6 w-6 text-[#006633] group-hover:text-[#C1440E] transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#0D1B2A]">{"Gestion des Cultures"}</h3>
                  <p className="text-[#0D1B2A]/70">
                    {"Suivez vos plantations, planifiez les récoltes et optimisez vos cycles de production."}
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <Card className="bg-white border-[#D4AF37]/30 hover:border-[#006633] hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#C1440E]/10 transition-colors">
                    <Calculator className="h-6 w-6 text-[#D4AF37] group-hover:text-[#C1440E] transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#0D1B2A]">{"Suivi Budgétaire"}</h3>
                  <p className="text-[#0D1B2A]/70">
                    {"Gérez vos dépenses, suivez vos revenus et analysez la rentabilité de vos activités."}
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>

            <Card className="bg-white border-[#D4AF37]/30 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-102 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#006633]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#C1440E]/10 transition-colors">
                  <Users className="h-6 w-6 text-[#006633] group-hover:text-[#C1440E] transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#0D1B2A]">{"Gestion d'Équipe"}</h3>
                <p className="text-[#0D1B2A]/70">
                  {"Organisez vos équipes, planifiez les tâches et suivez la productivité de vos employés."}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#D4AF37]/30 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-102 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#C1440E]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#006633]/10 transition-colors">
                  <Cloud className="h-6 w-6 text-[#C1440E] group-hover:text-[#006633] transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#0D1B2A]">{"Météo en Temps Réel"}</h3>
                <p className="text-[#0D1B2A]/70">
                  {"Accédez aux prévisions météorologiques précises pour planifier vos activités agricoles."}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#D4AF37]/30 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-102 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#C1440E]/10 transition-colors">
                  <TrendingUp className="h-6 w-6 text-[#D4AF37] group-hover:text-[#C1440E] transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#0D1B2A]">{"Analyses Avancées"}</h3>
                <p className="text-[#0D1B2A]/70">
                  {"Obtenez des insights détaillés sur vos performances et identifiez les opportunités d'amélioration."}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#D4AF37]/30 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-102 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#C1440E]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#006633]/10 transition-colors">
                  <ShoppingCart className="h-6 w-6 text-[#C1440E] group-hover:text-[#006633] transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#0D1B2A]">{"Marché Agricole"}</h3>
                <p className="text-[#0D1B2A]/70">
                  {"Connectez-vous avec d'autres agriculteurs pour acheter, vendre et négocier vos produits."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* Social Proof Section */}
      <SocialProof />

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#0D1B2A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4 text-[#D4AF37]">{"Tarifs transparents"}</h2>
            <p className="text-xl text-[#F5F5DC] text-pretty max-w-2xl mx-auto">
              {"Choisissez le plan qui correspond à la taille de votre exploitation."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-[#F5F5DC] border-[#D4AF37]/30 hover:border-[#006633] hover:shadow-lg transition-all duration-300 hover:scale-102">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-[#0D1B2A]">Starter</h3>
                  <div className="text-3xl font-bold mb-1 text-[#006633]">
                    15,000 <span className="text-sm font-normal text-[#0D1B2A]">FCFA/mois</span>
                  </div>
                  <p className="text-[#0D1B2A]/70">{"Pour les petites exploitations"}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-[#0D1B2A]">
                    <div className="w-2 h-2 bg-[#006633] rounded-full mr-3" />
                    {"Jusqu'à 1 ferme"}
                  </li>
                  <li className="flex items-center text-[#0D1B2A]">
                    <div className="w-2 h-2 bg-[#006633] rounded-full mr-3" />
                    {"Suivi budgétaire de base"}
                  </li>
                  <li className="flex items-center text-[#0D1B2A]">
                    <div className="w-2 h-2 bg-[#006633] rounded-full mr-3" />
                    {"météo en temps réel"}
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-[#006633] text-[#006633] hover:bg-[#006633] hover:text-white transition-all duration-300" asChild>
                  <Link href="/pricing">
                    {"Commencer"}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#D4AF37] to-[#C1440E] border-[#D4AF37] relative hover:shadow-xl transition-all duration-300 hover:scale-102">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#006633] text-white">{"Populaire"}</Badge>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-[#0D1B2A]">Professional</h3>
                  <div className="text-3xl font-bold mb-1 text-[#0D1B2A]">
                    35,000 <span className="text-sm font-normal text-[#0D1B2A]/70">FCFA/mois</span>
                  </div>
                  <p className="text-[#0D1B2A]/70">{"Pour les exploitations moyennes"}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-[#0D1B2A]">
                    <div className="w-2 h-2 bg-[#0D1B2A] rounded-full mr-3" />
                    {"Jusqu'à 3 fermes"}
                  </li>
                  <li className="flex items-center text-[#0D1B2A]">
                    <div className="w-2 h-2 bg-[#0D1B2A] rounded-full mr-3" />
                    {"Gestion d'équipe complète"}
                  </li>
                  <li className="flex items-center text-[#0D1B2A]">
                    <div className="w-2 h-2 bg-[#0D1B2A] rounded-full mr-3" />
                    {"Analyses avancées"}
                  </li>
                  <li className="flex items-center text-[#0D1B2A]">
                    <div className="w-2 h-2 bg-[#0D1B2A] rounded-full mr-3" />
                    {"Support prioritaire"}
                  </li>
                </ul>
                <Button className="w-full bg-[#006633] hover:bg-[#0D1B2A] text-white transition-all duration-300" asChild>
                  <Link href="/pricing">
                    {"Commencer"}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#F5F5DC] border-[#D4AF37]/30 hover:border-[#C1440E] hover:shadow-lg transition-all duration-300 hover:scale-102">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-[#0D1B2A]">Enterprise</h3>
                  <div className="text-3xl font-bold mb-1 text-[#C1440E]">
                    75,000 <span className="text-sm font-normal text-[#0D1B2A]">FCFA/mois</span>
                  </div>
                  <p className="text-[#0D1B2A]/70">{"Pour les grandes exploitations"}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-[#0D1B2A]">
                    <div className="w-2 h-2 bg-[#C1440E] rounded-full mr-3" />
                    {"jusqu'a 5 fermes"}
                  </li>
                  <li className="flex items-center text-[#0D1B2A]">
                    <div className="w-2 h-2 bg-[#C1440E] rounded-full mr-3" />
                    {"API personnalisée"}
                  </li>
                  <li className="flex items-center text-[#0D1B2A]">
                    <div className="w-2 h-2 bg-[#C1440E] rounded-full mr-3" />
                    {"Formation sur site"}
                  </li>
                  <li className="flex items-center text-[#0D1B2A]">
                    <div className="w-2 h-2 bg-[#C1440E] rounded-full mr-3" />
                    {"Support dédié 24/7"}
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-[#C1440E] text-[#C1440E] hover:bg-[#C1440E] hover:text-white transition-all duration-300" asChild>
                  <Link href="/pricing">
                    {"Nous contacter"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#F5F5DC]">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4 text-[#0D1B2A]">
              {"Questions fréquentes"}
            </h2>
            <p className="text-xl text-[#0D1B2A]/80 text-pretty max-w-2xl mx-auto">
              {"Tout ce que vous devez savoir sur FarmLink"}
            </p>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <AnimatedCard delay={0.1}>
                <Card className="bg-white border-[#D4AF37]/30 hover:border-[#006633] hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-[#0D1B2A]">
                      {"Comment FarmLink s'adapte-t-il au contexte malien ?"}
                    </h3>
                    <p className="text-[#0D1B2A]/70">
                      FarmLink est spécialement conçu pour l'agriculture malienne avec des fonctionnalités 
                      adaptées aux cultures locales (riz, mil, sorgho), aux saisons et aux défis climatiques du Mali.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>

              <AnimatedCard delay={0.2}>
                <Card className="bg-white border-[#D4AF37]/30 hover:border-[#006633] hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-[#0D1B2A]">
                      {"Puis-je utiliser FarmLink sans connexion internet ?"}
                    </h3>
                    <p className="text-[#0D1B2A]/70">
                      Oui ! FarmLink fonctionne en mode hors-ligne pour la saisie des données. 
                      La synchronisation se fait automatiquement dès que vous retrouvez une connexion.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>

              <AnimatedCard delay={0.3}>
                <Card className="bg-white border-[#D4AF37]/30 hover:border-[#006633] hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-[#0D1B2A]">
                      {"Y a-t-il une formation pour apprendre à utiliser FarmLink ?"}
                    </h3>
                    <p className="text-[#0D1B2A]/70">
                      Absolument ! Nous proposons des formations gratuites en français et en langues locales, 
                      ainsi qu'un support technique 24/7 pour vous accompagner.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>

              <AnimatedCard delay={0.4}>
                <Card className="bg-white border-[#D4AF37]/30 hover:border-[#006633] hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-[#0D1B2A]">
                      {"Comment puis-je commencer avec FarmLink ?"}
                    </h3>
                    <p className="text-[#0D1B2A]/70">
                      C'est très simple ! Créez votre compte gratuit, ajoutez vos fermes et parcelles, 
                      et commencez à suivre vos activités. L'essai gratuit dure 30 jours.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#006633] to-[#0D1B2A]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-6 text-[#D4AF37]">
              {"Prêt à révolutionner votre agriculture ?"}
            </h2>
            <p className="text-xl text-[#F5F5DC] text-pretty mb-8">
              {
                "Rejoignez des centaines d'agriculteurs maliens qui ont déjà transformé leur façon de gérer leurs exploitations."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-[#D4AF37] hover:bg-[#C1440E] text-[#0D1B2A] transition-all duration-300 hover:scale-102 shadow-lg hover:shadow-xl">
                <Link href="/auth/signup">
                  {"Essai gratuit"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A] transition-all duration-300">
                {"Voir la démo"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D4AF37]/20 py-12 bg-[#0D1B2A]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="animate-fade-in">
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-[#D4AF37]" />
                <span className="text-xl font-bold text-[#D4AF37]">FarmLink</span>
              </div>
              <p className="text-[#F5F5DC]/80">{"La solution de gestion agricole adaptée au contexte malien."}</p>
            </div>
            <div className="animate-fade-in">
              <h4 className="font-semibold mb-4 text-[#D4AF37]">Produit</h4>
              <ul className="space-y-2 text-[#F5F5DC]/80">
                <li>
                  <Link href="/features" className="hover:text-[#D4AF37] transition-colors hover:scale-102 inline-block">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-[#D4AF37] transition-colors hover:scale-102 inline-block">
                    Tarifs
                  </Link>
                </li>
                <li>
                 
                </li>
              </ul>
            </div>
            <div className="animate-fade-in">
              <h4 className="font-semibold mb-4 text-[#D4AF37]">Support</h4>
              <ul className="space-y-2 text-[#F5F5DC]/80">
                <li>
                  <Link href="/docs" className="hover:text-[#D4AF37] transition-colors hover:scale-102 inline-block">
                    Documentation
                  </Link>
                </li>
              
                <li>
                  <Link href="/contact" className="hover:text-[#D4AF37] transition-colors hover:scale-102 inline-block">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="animate-fade-in">
              <h4 className="font-semibold mb-4 text-[#D4AF37]">Entreprise</h4>
              <ul className="space-y-2 text-[#F5F5DC]/80">
                <li>
                  <Link href="/about" className="hover:text-[#D4AF37] transition-colors hover:scale-102 inline-block">
                    À propos
                  </Link>
                </li>
             
              </ul>
            </div>
          </div>
          <div className="border-t border-[#D4AF37]/20 mt-8 pt-8 text-center text-[#F5F5DC]/60">
            <p>&copy; 2025 Florynx labs. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
