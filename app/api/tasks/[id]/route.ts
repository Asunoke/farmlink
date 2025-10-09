import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/tasks/[id] - Récupérer une tâche spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params

    const task = await prisma.task.findFirst({
      where: { 
        id,
        teamMember: { userId: session.user.id }
      },
      include: {
        teamMember: true
      }
    })

    if (!task) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Erreur lors de la récupération de la tâche:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// PUT /api/tasks/[id] - Mettre à jour une tâche
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const { title, description, status, priority, dueDate, teamMemberId } = await request.json()

    // Vérifier que la tâche existe et appartient à l'utilisateur
    const existingTask = await prisma.task.findFirst({
      where: { 
        id,
        teamMember: { userId: session.user.id }
      }
    })

    if (!existingTask) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }

    // Si teamMemberId est fourni, vérifier qu'il appartient à l'utilisateur
    if (teamMemberId) {
      const teamMember = await prisma.teamMember.findFirst({
        where: {
          id: teamMemberId,
          userId: session.user.id
        }
      })

      if (!teamMember) {
        return NextResponse.json({ error: "Membre d'équipe non trouvé" }, { status: 404 })
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description || undefined,
        status: status || undefined,
        priority: priority || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        teamMemberId: teamMemberId || undefined
      },
      include: {
        teamMember: true
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// DELETE /api/tasks/[id] - Supprimer une tâche
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params

    // Vérifier que la tâche existe et appartient à l'utilisateur
    const existingTask = await prisma.task.findFirst({
      where: { 
        id,
        teamMember: { userId: session.user.id }
      }
    })

    if (!existingTask) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Tâche supprimée" })
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}