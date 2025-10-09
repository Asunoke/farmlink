import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Mot de passe actuel et nouveau mot de passe requis" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Le nouveau mot de passe doit contenir au moins 6 caractères" }, { status: 400 })
    }

    // Récupérer l'utilisateur avec son mot de passe hashé
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 })
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({ message: "Mot de passe modifié avec succès" })
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
