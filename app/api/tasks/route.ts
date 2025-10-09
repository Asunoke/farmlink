import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const userId = session.user.id

    const tasks = await prisma.task.findMany({
      where: { 
        teamMember: { userId }
      },
      include: {
        teamMember: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { title, description, teamMemberId, priority, dueDate } = await request.json()

    if (!title || !description || !teamMemberId || !priority) {
      return NextResponse.json({ error: "Tous les champs requis sont manquants" }, { status: 400 })
    }

    // Vérifier que le membre d'équipe appartient à l'utilisateur
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: teamMemberId,
        userId: session.user.id
      }
    })

    if (!teamMember) {
      return NextResponse.json({ error: "Membre d'équipe non trouvé" }, { status: 404 })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        teamMemberId,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'PENDING'
      },
      include: {
        teamMember: true
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}