"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Leaf, 
  Globe, 
  Lightbulb, 
  Users, 
  Target, 
  Heart, 
  Shield, 
  Zap,
  TrendingUp,
  Award,
  ArrowRight,
  Play,
  Star,
  MapPin,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"

// Composants réutilisables
const SectionTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.h2 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className={`text-3xl md:text-4xl font-bold text-center mb-4 ${className}`}
  >
    {children}
  </motion.h2>
)

const ValueCard = ({ icon: Icon, title, description, delay = 0 }: { 
  icon: any, 
  title: string, 
  description: string, 
  delay?: number 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="group"
  >
    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
)

const StatCard = ({ number, label, icon: Icon, delay = 0 }: { 
  number: string, 
  label: string, 
  icon: any, 
  delay?: number 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
      <Icon className="w-10 h-10 text-white" />
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1, delay: delay + 0.3 }}
      viewport={{ once: true }}
      className="text-4xl font-bold text-gray-900 mb-2"
    >
      {number}
    </motion.div>
    <p className="text-gray-600 font-medium">{label}</p>
  </motion.div>
)

const TimelineItem = ({ year, title, description, icon: Icon, delay = 0 }: {
  year: string,
  title: string,
  description: string,
  icon: any,
  delay?: number
}) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="relative flex items-start space-x-4 pb-8"
  >
    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1">
      <div className="flex items-center space-x-2 mb-2">
        <Badge variant="outline" className="text-green-600 border-green-200">
          {year}
        </Badge>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </motion.div>
)

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <MainNav />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-amber-400/20 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Nous construisons l'avenir de l'
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                agriculture africaine
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-green-100 leading-relaxed"
            >
              Chez Farmlink, nous croyons au pouvoir de la technologie pour libérer le potentiel des agriculteurs africains et construire une Afrique durable et prospère.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-700 font-semibold">
                <Play className="mr-2 w-5 h-5" />
                se joindre a nous 
              </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle className="text-green-700 mb-16">
            Notre Histoire
          </SectionTitle>
          
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-xl text-gray-600 leading-relaxed">
                Née de la passion pour l'innovation et l'impact social, Farmlink est le fruit d'une vision audacieuse : 
                transformer l'agriculture Malienne grâce à la technologie.
              </p>
            </motion.div>

            <div className="space-y-8">
              <TimelineItem
                year="2023"
                title="La Vision"
                description="L'idée de Farmlink naît de l'observation des défis auxquels font face les agriculteurs maliens : manque d'accès aux données, aux marchés et aux technologies modernes."
                icon={Lightbulb}
                delay={0.1}
              />
              <TimelineItem
                year="2025"
                title="Le Lancement"
                description="Farmlink voit le jour avec une mission claire : connecter les agriculteurs maliens à la technologie pour améliorer leur productivité et leurs revenus."
                icon={Zap}
                delay={0.2}
              />
              <TimelineItem
                year="2027"
                title="L'Expansion"
                description="Notre plateforme s'étend à travers l'Afrique, touchant des milliers d'agriculteurs et créant un écosystème technologique agricole durable."
                icon={Globe}
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-6">
          <SectionTitle className="text-green-700 mb-16">
            Notre Mission & Vision
          </SectionTitle>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-white to-green-50/50">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Connecter les agriculteurs maliens à la donnée, l'énergie et le marché pour créer 
                    un écosystème agricole durable, prospère et technologiquement avancé.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-white to-amber-50/50">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Vision</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Construire une Afrique durable et autosuffisante grâce à la technologie, 
                    où chaque agriculteur a accès aux outils et connaissances nécessaires pour prospérer.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle className="text-green-700 mb-16">
            Nos Valeurs
          </SectionTitle>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <ValueCard
              icon={Lightbulb}
              title="Innovation"
              description="Nous repoussons les limites de la technologie agricole pour créer des solutions innovantes et adaptées au contexte africain."
              delay={0.1}
            />
            <ValueCard
              icon={Heart}
              title="Impact"
              description="Chaque solution que nous développons vise à créer un impact positif et mesurable sur la vie des agriculteurs africains."
              delay={0.2}
            />
            <ValueCard
              icon={Users}
              title="Communauté"
              description="Nous construisons ensemble un écosystème où agriculteurs, technologues et partenaires collaborent pour le bien commun."
              delay={0.3}
            />
            <ValueCard
              icon={Shield}
              title="Transparence"
              description="Nous croyons en la transparence totale dans nos relations avec nos utilisateurs, partenaires et investisseurs."
              delay={0.4}
            />
          </div>
        </div>
      </section>

     

      {/* Nos Partenaires & Impact */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle className="text-green-700 mb-16">
            Notre Impact
          </SectionTitle>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <StatCard
              number="10+"
              label="Agriculteurs connectés"
              icon={Users}
              delay={0.1}
            />
            <StatCard
              number="1"
              label="Pays couverts"
              icon={MapPin}
              delay={0.2}
            />
            <StatCard
              number="99%"
              label="Satisfaction client"
              icon={Star}
              delay={0.3}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Nos Partenaires</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">Atlas capital Holding SA</span>
              </div>
              <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">Florynx labs SARL</span>
              </div>
              <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">Evotech mali SARL</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call-to-Action final */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-amber-400/20 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à bâtir le futur avec nous ?
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Rejoignez notre mission de transformation de l'agriculture africaine. 
              Ensemble, créons un avenir durable et prospère.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-semibold">
                Nous contacter
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
