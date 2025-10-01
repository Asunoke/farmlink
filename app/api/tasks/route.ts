import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { checkSubscriptionLimit } from "@/lib/subscription-middleware"

const taskSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("PENDING"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().datetime().optional(),
  teamMemberId: z.string().min(1, "L'assignation est requise"),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teamMemberId = searchParams.get("teamMemberId")
    const status = searchParams.get("status")

    const where: any = {
      teamMember: {
        userId: session.user.id,
      },
    }

    if (teamMemberId) where.teamMemberId = teamMemberId
    if (status) where.status = status

    const tasks = await prisma.task.findMany({
      where,
      include: {
        teamMember: {
          select: { name: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Tasks fetch error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = taskSchema.parse(body)

    const limitCheck = await checkSubscriptionLimit("tasks", session.user.id)
    if (!limitCheck.allowed) {
      return NextResponse.json({ error: limitCheck.message }, { status: 403 })
    }

    // Verify team member ownership
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: validatedData.teamMemberId,
        userId: session.user.id,
      },
    })

    if (!teamMember) {
      return NextResponse.json({ error: "Membre d'équipe non trouvé" }, { status: 404 })
    }

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      },
      include: {
        teamMember: {
          select: { name: true, role: true },
        },
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Task creation error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
