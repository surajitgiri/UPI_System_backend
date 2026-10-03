-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'PAYMENT', 'REFUND');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REVERSED');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "transactionReference" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "sourceAccountId" TEXT,
    "destinationAccountId" TEXT,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "description" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionReference_key" ON "Transaction"("transactionReference");

-- CreateIndex
CREATE INDEX "Transaction_sourceAccountId_idx" ON "Transaction"("sourceAccountId");

-- CreateIndex
CREATE INDEX "Transaction_destinationAccountId_idx" ON "Transaction"("destinationAccountId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");
