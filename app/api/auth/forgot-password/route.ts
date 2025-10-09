import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
      return NextResponse.json({ 
        message: "Si cet email existe dans notre système, vous recevrez un lien de réinitialisation." 
      })
    }

    // Ici, vous pourriez intégrer un service d'email comme SendGrid, Resend, ou Nodemailer
    // Pour l'instant, on simule l'envoi d'email
    console.log(`Email de réinitialisation envoyé à: ${email}`)
    
    // En production, vous devriez :
    // 1. Générer un token de réinitialisation
    // 2. Sauvegarder le token en base avec une expiration
    // 3. Envoyer un email avec le lien de réinitialisation

    return NextResponse.json({ 
      message: "Si cet email existe dans notre système, vous recevrez un lien de réinitialisation." 
    })
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
