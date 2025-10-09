import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Récupérer les paramètres depuis la base de données
    // Pour l'instant, on retourne des paramètres par défaut
    const settings = {
      siteName: "FarmLink",
      siteDescription: "Plateforme SaaS de gestion agricole pour le Mali",
      maintenanceMode: false,
      registrationEnabled: true,
      emailNotifications: true,
      smsNotifications: false,
      autoBackup: true,
      maxFileSize: "10",
      sessionTimeout: "30"
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const settings = await request.json()

    // Ici, vous pourriez sauvegarder les paramètres dans une table dédiée
    // Pour l'instant, on simule la sauvegarde
    console.log('Paramètres sauvegardés:', settings)

    return NextResponse.json({ message: "Paramètres sauvegardés avec succès" })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
