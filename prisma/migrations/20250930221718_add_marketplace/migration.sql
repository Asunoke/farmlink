-- CreateEnum
CREATE TYPE "public"."MarketplaceCategory" AS ENUM ('CROPS', 'SEEDS', 'FERTILIZER', 'EQUIPMENT', 'LIVESTOCK', 'SERVICES', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."MarketplaceStatus" AS ENUM ('ACTIVE', 'SOLD', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."NegotiationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTER_OFFER', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."marketplace_offers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."MarketplaceCategory" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "public"."MarketplaceStatus" NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."marketplace_demands" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."MarketplaceCategory" NOT NULL,
    "maxPrice" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "public"."MarketplaceStatus" NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_demands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."marketplace_negotiations" (
    "id" TEXT NOT NULL,
    "offerId" TEXT,
    "demandId" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "message" TEXT,
    "status" "public"."NegotiationStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_negotiations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."marketplace_offers" ADD CONSTRAINT "marketplace_offers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."marketplace_demands" ADD CONSTRAINT "marketplace_demands_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."marketplace_negotiations" ADD CONSTRAINT "marketplace_negotiations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."marketplace_negotiations" ADD CONSTRAINT "marketplace_negotiations_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "public"."marketplace_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."marketplace_negotiations" ADD CONSTRAINT "marketplace_negotiations_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "public"."marketplace_demands"("id") ON DELETE CASCADE ON UPDATE CASCADE;
