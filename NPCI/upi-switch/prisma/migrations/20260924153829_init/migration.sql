-- CreateEnum
CREATE TYPE "SwitchTxnStatus" AS ENUM ('RECEIVED', 'ROUTING', 'VALIDATING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REVERSED', 'REVERSAL_PENDING', 'TIMEOUT', 'DUPLICATE');

-- CreateEnum
CREATE TYPE "SwitchTxnType" AS ENUM ('PAY', 'COLLECT', 'REFUND', 'REVERSAL');

-- CreateEnum
CREATE TYPE "ReversalStatus" AS ENUM ('INITIATED', 'PROCESSING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "ReversalReason" AS ENUM ('TECHNICAL_FAILURE', 'TIMEOUT', 'BENEFICIARY_NOT_FOUND', 'BANK_REFUSED', 'DUPLICATE_TRANSACTION', 'CUSTOMER_REQUEST', 'FRAUD_DETECTED', 'COMPLIANCE');

-- CreateEnum
CREATE TYPE "SwitchLogLevel" AS ENUM ('INFO', 'WARN', 'ERROR', 'DEBUG');

-- CreateTable
CREATE TABLE "switch_transactions" (
    "id" TEXT NOT NULL,
    "rrn" TEXT NOT NULL,
    "txnRef" TEXT NOT NULL,
    "npciTxnId" TEXT,
    "type" "SwitchTxnType" NOT NULL,
    "status" "SwitchTxnStatus" NOT NULL DEFAULT 'RECEIVED',
    "senderVpa" TEXT NOT NULL,
    "senderBankCode" TEXT NOT NULL,
    "senderAccountId" TEXT NOT NULL,
    "senderIfsc" TEXT,
    "receiverVpa" TEXT NOT NULL,
    "receiverBankCode" TEXT NOT NULL,
    "receiverAccountId" TEXT NOT NULL,
    "receiverIfsc" TEXT,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "senderPsp" TEXT,
    "receiverPsp" TEXT,
    "routedAt" TIMESTAMP(3),
    "participantRouteId" TEXT,
    "debitedAt" TIMESTAMP(3),
    "creditedAt" TIMESTAMP(3),
    "settledAt" TIMESTAMP(3),
    "originalTxnId" TEXT,
    "failureReason" TEXT,
    "failureCode" TEXT,
    "description" TEXT,
    "remarks" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "switch_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reversal_requests" (
    "id" TEXT NOT NULL,
    "txnId" TEXT NOT NULL,
    "reversalRrn" TEXT NOT NULL,
    "reason" "ReversalReason" NOT NULL,
    "status" "ReversalStatus" NOT NULL DEFAULT 'INITIATED',
    "raisedBy" TEXT NOT NULL,
    "raisedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reversedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reversal_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "switch_logs" (
    "id" TEXT NOT NULL,
    "txnId" TEXT NOT NULL,
    "level" "SwitchLogLevel" NOT NULL DEFAULT 'INFO',
    "event" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "switch_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "switch_limits" (
    "id" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "maxSingleTxnAmt" DECIMAL(18,2) NOT NULL DEFAULT 100000.00,
    "maxDailyAmt" DECIMAL(18,2) NOT NULL DEFAULT 1000000.00,
    "maxDailyCount" INTEGER NOT NULL DEFAULT 20,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "switch_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duplicate_checks" (
    "id" TEXT NOT NULL,
    "rrn" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "txnId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "duplicate_checks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "switch_transactions_rrn_key" ON "switch_transactions"("rrn");

-- CreateIndex
CREATE UNIQUE INDEX "switch_transactions_txnRef_key" ON "switch_transactions"("txnRef");

-- CreateIndex
CREATE UNIQUE INDEX "switch_transactions_npciTxnId_key" ON "switch_transactions"("npciTxnId");

-- CreateIndex
CREATE INDEX "switch_transactions_senderVpa_idx" ON "switch_transactions"("senderVpa");

-- CreateIndex
CREATE INDEX "switch_transactions_receiverVpa_idx" ON "switch_transactions"("receiverVpa");

-- CreateIndex
CREATE INDEX "switch_transactions_senderBankCode_idx" ON "switch_transactions"("senderBankCode");

-- CreateIndex
CREATE INDEX "switch_transactions_receiverBankCode_idx" ON "switch_transactions"("receiverBankCode");

-- CreateIndex
CREATE INDEX "switch_transactions_status_idx" ON "switch_transactions"("status");

-- CreateIndex
CREATE INDEX "switch_transactions_type_idx" ON "switch_transactions"("type");

-- CreateIndex
CREATE INDEX "switch_transactions_receivedAt_idx" ON "switch_transactions"("receivedAt");

-- CreateIndex
CREATE INDEX "switch_transactions_settledAt_idx" ON "switch_transactions"("settledAt");

-- CreateIndex
CREATE UNIQUE INDEX "reversal_requests_txnId_key" ON "reversal_requests"("txnId");

-- CreateIndex
CREATE UNIQUE INDEX "reversal_requests_reversalRrn_key" ON "reversal_requests"("reversalRrn");

-- CreateIndex
CREATE INDEX "reversal_requests_status_idx" ON "reversal_requests"("status");

-- CreateIndex
CREATE INDEX "reversal_requests_reason_idx" ON "reversal_requests"("reason");

-- CreateIndex
CREATE INDEX "reversal_requests_raisedAt_idx" ON "reversal_requests"("raisedAt");

-- CreateIndex
CREATE INDEX "switch_logs_txnId_idx" ON "switch_logs"("txnId");

-- CreateIndex
CREATE INDEX "switch_logs_event_idx" ON "switch_logs"("event");

-- CreateIndex
CREATE INDEX "switch_logs_level_idx" ON "switch_logs"("level");

-- CreateIndex
CREATE INDEX "switch_logs_createdAt_idx" ON "switch_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "switch_limits_bankCode_key" ON "switch_limits"("bankCode");

-- CreateIndex
CREATE INDEX "switch_limits_bankCode_idx" ON "switch_limits"("bankCode");

-- CreateIndex
CREATE UNIQUE INDEX "duplicate_checks_rrn_key" ON "duplicate_checks"("rrn");

-- CreateIndex
CREATE INDEX "duplicate_checks_rrn_idx" ON "duplicate_checks"("rrn");

-- CreateIndex
CREATE INDEX "duplicate_checks_expiresAt_idx" ON "duplicate_checks"("expiresAt");

-- AddForeignKey
ALTER TABLE "switch_transactions" ADD CONSTRAINT "switch_transactions_originalTxnId_fkey" FOREIGN KEY ("originalTxnId") REFERENCES "switch_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reversal_requests" ADD CONSTRAINT "reversal_requests_txnId_fkey" FOREIGN KEY ("txnId") REFERENCES "switch_transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "switch_logs" ADD CONSTRAINT "switch_logs_txnId_fkey" FOREIGN KEY ("txnId") REFERENCES "switch_transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
