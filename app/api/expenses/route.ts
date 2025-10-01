import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { checkSubscriptionLimit } from "@/lib/subscription-middleware"

const expenseSchema = z.object({
  description: z.string().min(1, "La description est requise"),
  amount: z.number().positive("Le montant doit être positif"),
  category: z.enum(["SEEDS", "FERTILIZER", "EQUIPMENT", "LABOR", "FUEL", "MAINTENANCE", "OTHER"]),
  date: z.string().datetime(),
  type: z.enum(["EXPENSE", "REVENUE"]).default("EXPENSE"),
  plotId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const farmId = searchParams.get("farmId")
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: any = { userId: session.user.id }
    if (category) where.category = category
    if (type) where.type = type
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: { plot: { select: { id: true, name: true } } },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error("Expenses fetch error:", error)
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
    const validatedData = expenseSchema.parse(body)

    const limitCheck = await checkSubscriptionLimit("expenses", session.user.id)
    if (!limitCheck.allowed) {
      return NextResponse.json({ error: limitCheck.message }, { status: 403 })
    }

    // Note: pas de relation Farm sur Expense dans le schéma actuel

    const expense = await prisma.expense.create({
      data: {
        description: validatedData.description,
        amount: validatedData.amount,
        category: validatedData.category,
        type: validatedData.type ?? "EXPENSE",
        plotId: validatedData.plotId,
        userId: session.user.id,
        date: new Date(validatedData.date),
      },
      include: { plot: { select: { id: true, name: true } } },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Expense creation error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
