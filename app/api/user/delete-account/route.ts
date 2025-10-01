import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const userId = session.user.id

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Supprimer toutes les données associées à l'utilisateur
    // Les relations sont configurées avec onDelete: Cascade dans Prisma
    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ 
      message: "Compte supprimé avec succès",
      success: true 
    })
  } catch (error) {
    console.error("Account deletion error:", error)
    return NextResponse.json({ 
      error: "Erreur lors de la suppression du compte" 
    }, { status: 500 })
  }
}
