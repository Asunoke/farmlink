import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { checkSubscriptionLimit } from "@/lib/subscription-middleware"

const farmSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  area: z.number().positive("La surface doit être positive"),
  location: z.string().min(1, "La localisation est requise"),
  crop: z.string().optional(),
  plantingDate: z.string().datetime().optional(),
  harvestDate: z.string().datetime().optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const farms = await prisma.farm.findMany({
      where: { userId: session.user.id },
      include: {
        plots: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(farms)
  } catch (error) {
    console.error("Farms fetch error:", error)
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
    const validatedData = farmSchema.parse(body)

    const limitCheck = await checkSubscriptionLimit("farms", session.user.id)
    if (!limitCheck.allowed) {
      return NextResponse.json({ error: limitCheck.message }, { status: 403 })
    }

    const farm = await prisma.farm.create({
      data: {
        name: validatedData.name,
        totalArea: validatedData.area,
        location: validatedData.location,
        crop: validatedData.crop,
        plantingDate: validatedData.plantingDate ? new Date(validatedData.plantingDate) : null,
        harvestDate: validatedData.harvestDate ? new Date(validatedData.harvestDate) : null,
        notes: validatedData.notes,
        userId: session.user.id,
      },
      include: { plots: true },
    })

    return NextResponse.json(farm, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Farm creation error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
