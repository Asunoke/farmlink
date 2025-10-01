import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const expenseUpdateSchema = z.object({
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  category: z.enum(["SEEDS", "FERTILIZER", "EQUIPMENT", "LABOR", "FUEL", "MAINTENANCE", "OTHER"]).optional(),
  date: z.string().datetime().optional(),
  type: z.enum(["EXPENSE", "REVENUE"]).optional(),
  plotId: z.string().nullable().optional(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const expense = await prisma.expense.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!expense) {
      return NextResponse.json({ error: "Dépense non trouvée" }, { status: 404 })
    }

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Expense fetch error:", error)
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
    const validated = expenseUpdateSchema.parse(body)

    const existing = await prisma.expense.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!existing) {
      return NextResponse.json({ error: "Dépense non trouvée" }, { status: 404 })
    }

    const updated = await prisma.expense.update({
      where: { id },
      data: {
        ...validated,
        date: validated.date ? new Date(validated.date) : undefined,
        plotId: validated.plotId === null ? null : validated.plotId,
      },
      include: { plot: { select: { id: true, name: true } } },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Expense update error:", error)
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
    const existing = await prisma.expense.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!existing) {
      return NextResponse.json({ error: "Dépense non trouvée" }, { status: 404 })
    }

    await prisma.expense.delete({ where: { id } })
    return NextResponse.json({ message: "Dépense supprimée" })
  } catch (error) {
    console.error("Expense deletion error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}