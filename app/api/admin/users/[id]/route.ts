import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const { name, email, role, subscription, password } = await request.json()

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Préparer les données de mise à jour (filtrer les valeurs undefined)
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (role !== undefined) updateData.role = role
    if (subscription !== undefined) updateData.subscription = subscription

    // Si un nouveau mot de passe est fourni, le hasher
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 12)
      updateData.password = hashedPassword
    }

    // Vérifier qu'il y a des données à mettre à jour
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Aucune donnée à mettre à jour" }, { status: 400 })
    }

    console.log('Données de mise à jour:', updateData)

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscription: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Empêcher la suppression de son propre compte
    if (existingUser.id === session.user.id) {
      return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 400 })
    }

    // Supprimer l'utilisateur (cascade supprimera les données liées)
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}