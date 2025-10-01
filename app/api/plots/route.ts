import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { checkSubscriptionLimit } from "@/lib/subscription-middleware"

const plotSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  area: z.number().positive("La surface doit être positive"),
  cropType: z.string().min(1, "Le type de culture est requis"),
  plantedDate: z.string().datetime().optional(),
  harvestDate: z.string().datetime().optional(),
  status: z.enum(["PREPARATION", "PLANTED", "GROWING", "HARVESTED", "FALLOW"]).default("PREPARATION"),
  farmId: z.string().min(1, "La ferme est requise"),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const farmId = searchParams.get("farmId")

    const where: any = {
      farm: {
        userId: session.user.id,
      },
    }

    if (farmId) where.farmId = farmId

    const plots = await prisma.plot.findMany({
      where,
      include: {
        farm: {
          select: { name: true, location: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(plots)
  } catch (error) {
    console.error("Plots fetch error:", error)
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
    const validatedData = plotSchema.parse(body)

    const limitCheck = await checkSubscriptionLimit("parcels", session.user.id)
    if (!limitCheck.allowed) {
      return NextResponse.json({ error: limitCheck.message }, { status: 403 })
    }

    // Verify farm ownership
    const farm = await prisma.farm.findFirst({
      where: {
        id: validatedData.farmId,
        userId: session.user.id,
      },
    })

    if (!farm) {
      return NextResponse.json({ error: "Ferme non trouvée" }, { status: 404 })
    }

    const plot = await prisma.plot.create({
      data: {
        ...validatedData,
        plantedDate: validatedData.plantedDate ? new Date(validatedData.plantedDate) : null,
        harvestDate: validatedData.harvestDate ? new Date(validatedData.harvestDate) : null,
      },
      include: {
        farm: {
          select: { name: true, location: true },
        },
      },
    })

    return NextResponse.json(plot, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Plot creation error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
