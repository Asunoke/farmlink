import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Nom et email requis" }, { status: 400 })
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        id: { not: session.user.id }
      }
    })

    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé par un autre compte" }, { status: 400 })
    }

    // Mettre à jour le profil
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        name: name.trim(),
        email: email.trim().toLowerCase()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscription: true
      }
    })

    return NextResponse.json({ 
      message: "Profil mis à jour avec succès",
      user: updatedUser
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
