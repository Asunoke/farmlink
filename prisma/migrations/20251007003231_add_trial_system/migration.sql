-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."SubscriptionPlan" ADD VALUE 'BUSINESS';
ALTER TYPE "public"."SubscriptionPlan" ADD VALUE 'ENTERPRISE';

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "trialStartDate" TIMESTAMP(3);
