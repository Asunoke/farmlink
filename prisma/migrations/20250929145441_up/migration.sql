-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('EXPENSE', 'REVENUE');

-- AlterTable
ALTER TABLE "public"."expenses" ADD COLUMN     "plotId" TEXT,
ADD COLUMN     "type" "public"."TransactionType" NOT NULL DEFAULT 'EXPENSE';

-- AddForeignKey
ALTER TABLE "public"."expenses" ADD CONSTRAINT "expenses_plotId_fkey" FOREIGN KEY ("plotId") REFERENCES "public"."plots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
