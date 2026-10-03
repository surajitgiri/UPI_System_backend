-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "LedgerStatus" AS ENUM ('POSTED', 'REVERSED');

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "entryType" "LedgerEntryType" NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "balanceBefore" DECIMAL(18,2) NOT NULL,
    "balanceAfter" DECIMAL(18,2) NOT NULL,
    "status" "LedgerStatus" NOT NULL DEFAULT 'POSTED',
    "description" TEXT,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LedgerEntry_accountId_idx" ON "LedgerEntry"("accountId");

-- CreateIndex
CREATE INDEX "LedgerEntry_transactionId_idx" ON "LedgerEntry"("transactionId");

-- CreateIndex
CREATE INDEX "LedgerEntry_createdAt_idx" ON "LedgerEntry"("createdAt");
