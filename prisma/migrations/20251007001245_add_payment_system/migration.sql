-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "paymentMethod" TEXT NOT NULL DEFAULT 'ORANGE_MONEY',
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "orangeMoneyNumber" TEXT,
    "qrCode" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
