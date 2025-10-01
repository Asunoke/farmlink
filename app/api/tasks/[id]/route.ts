import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const taskUpdateSchema = z.object({
  title: z.string().min(1, "Le titre est requis").optional(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().datetime().optional(),
  teamMemberId: z.string().min(1, "L'assignation est requise").optional(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const task = await prisma.task.findFirst({
      where: {
        id,
        teamMember: {
          userId: session.user.id,
        },
      },
      include: {
        teamMember: {
          select: { name: true, role: true },
        },
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Task fetch error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validated = taskUpdateSchema.parse(body)

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        teamMember: {
          userId: session.user.id,
        },
      },
    })

    if (!existingTask) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }

    // If teamMemberId is being updated, verify the new team member belongs to user
    if (validated.teamMemberId) {
      const teamMember = await prisma.teamMember.findFirst({
        where: {
          id: validated.teamMemberId,
          userId: session.user.id,
        },
      })

      if (!teamMember) {
        return NextResponse.json({ error: "Membre d'équipe non trouvé" }, { status: 404 })
      }
    }

    const updateData: any = { ...validated }
    if (validated.dueDate) {
      updateData.dueDate = new Date(validated.dueDate)
    }

    const updated = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        teamMember: {
          select: { name: true, role: true },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Task update error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        teamMember: {
          userId: session.user.id,
        },
      },
    })

    if (!existingTask) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }

    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ message: "Tâche supprimée avec succès" })
  } catch (error) {
    console.error("Task deletion error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
