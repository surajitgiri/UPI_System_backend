-- CreateEnum
CREATE TYPE "VpaStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "UpiTransactionStatus" AS ENUM ('INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'REVERSED', 'EXPIRED', 'DECLINED');

-- CreateEnum
CREATE TYPE "UpiTransactionType" AS ENUM ('PAY', 'COLLECT', 'REFUND');

-- CreateEnum
CREATE TYPE "CollectRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MandateStatus" AS ENUM ('CREATED', 'ACTIVE', 'PAUSED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MandateFrequency" AS ENUM ('ONETIME', 'DAILY', 'WEEKLY', 'MONTHLY', 'BIMONTHLY', 'QUARTERLY', 'HALFYEARLY', 'YEARLY');

-- CreateTable
CREATE TABLE "Vpa" (
    "id" TEXT NOT NULL,
    "vpa" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" "VpaStatus" NOT NULL DEFAULT 'ACTIVE',
    "pinHash" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vpa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpiTransaction" (
    "id" TEXT NOT NULL,
    "rrn" TEXT NOT NULL,
    "txnRef" TEXT NOT NULL,
    "type" "UpiTransactionType" NOT NULL,
    "status" "UpiTransactionStatus" NOT NULL DEFAULT 'INITIATED',
    "senderVpaId" TEXT NOT NULL,
    "receiverVpaId" TEXT NOT NULL,
    "senderAccountId" TEXT NOT NULL,
    "receiverAccountId" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "description" TEXT,
    "remarks" TEXT,
    "bankTxnId" TEXT,
    "npciTxnId" TEXT,
    "failureReason" TEXT,
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpiTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectRequest" (
    "id" TEXT NOT NULL,
    "initiatorVpaId" TEXT NOT NULL,
    "targetVpaId" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "description" TEXT,
    "remarks" TEXT,
    "status" "CollectRequestStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpiMandate" (
    "id" TEXT NOT NULL,
    "mandateRef" TEXT NOT NULL,
    "vpaId" TEXT NOT NULL,
    "payeeVpa" TEXT NOT NULL,
    "payeeAccountId" TEXT,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "frequency" "MandateFrequency" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "MandateStatus" NOT NULL DEFAULT 'CREATED',
    "description" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpiMandate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PinAttemptLog" (
    "id" TEXT NOT NULL,
    "vpaId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "success" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PinAttemptLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vpa_vpa_key" ON "Vpa"("vpa");

-- CreateIndex
CREATE INDEX "Vpa_userId_idx" ON "Vpa"("userId");

-- CreateIndex
CREATE INDEX "Vpa_accountId_idx" ON "Vpa"("accountId");

-- CreateIndex
CREATE INDEX "Vpa_handle_idx" ON "Vpa"("handle");

-- CreateIndex
CREATE INDEX "Vpa_status_idx" ON "Vpa"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UpiTransaction_rrn_key" ON "UpiTransaction"("rrn");

-- CreateIndex
CREATE UNIQUE INDEX "UpiTransaction_txnRef_key" ON "UpiTransaction"("txnRef");

-- CreateIndex
CREATE INDEX "UpiTransaction_senderVpaId_idx" ON "UpiTransaction"("senderVpaId");

-- CreateIndex
CREATE INDEX "UpiTransaction_receiverVpaId_idx" ON "UpiTransaction"("receiverVpaId");

-- CreateIndex
CREATE INDEX "UpiTransaction_status_idx" ON "UpiTransaction"("status");

-- CreateIndex
CREATE INDEX "UpiTransaction_type_idx" ON "UpiTransaction"("type");

-- CreateIndex
CREATE INDEX "UpiTransaction_rrn_idx" ON "UpiTransaction"("rrn");

-- CreateIndex
CREATE INDEX "UpiTransaction_initiatedAt_idx" ON "UpiTransaction"("initiatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CollectRequest_transactionId_key" ON "CollectRequest"("transactionId");

-- CreateIndex
CREATE INDEX "CollectRequest_initiatorVpaId_idx" ON "CollectRequest"("initiatorVpaId");

-- CreateIndex
CREATE INDEX "CollectRequest_targetVpaId_idx" ON "CollectRequest"("targetVpaId");

-- CreateIndex
CREATE INDEX "CollectRequest_status_idx" ON "CollectRequest"("status");

-- CreateIndex
CREATE INDEX "CollectRequest_expiresAt_idx" ON "CollectRequest"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "UpiMandate_mandateRef_key" ON "UpiMandate"("mandateRef");

-- CreateIndex
CREATE INDEX "UpiMandate_vpaId_idx" ON "UpiMandate"("vpaId");

-- CreateIndex
CREATE INDEX "UpiMandate_status_idx" ON "UpiMandate"("status");

-- CreateIndex
CREATE INDEX "UpiMandate_frequency_idx" ON "UpiMandate"("frequency");

-- CreateIndex
CREATE INDEX "UpiMandate_endDate_idx" ON "UpiMandate"("endDate");

-- CreateIndex
CREATE INDEX "PinAttemptLog_vpaId_idx" ON "PinAttemptLog"("vpaId");

-- CreateIndex
CREATE INDEX "PinAttemptLog_createdAt_idx" ON "PinAttemptLog"("createdAt");

-- AddForeignKey
ALTER TABLE "UpiTransaction" ADD CONSTRAINT "UpiTransaction_senderVpaId_fkey" FOREIGN KEY ("senderVpaId") REFERENCES "Vpa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpiTransaction" ADD CONSTRAINT "UpiTransaction_receiverVpaId_fkey" FOREIGN KEY ("receiverVpaId") REFERENCES "Vpa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectRequest" ADD CONSTRAINT "CollectRequest_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "UpiTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectRequest" ADD CONSTRAINT "CollectRequest_initiatorVpaId_fkey" FOREIGN KEY ("initiatorVpaId") REFERENCES "Vpa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectRequest" ADD CONSTRAINT "CollectRequest_targetVpaId_fkey" FOREIGN KEY ("targetVpaId") REFERENCES "Vpa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpiMandate" ADD CONSTRAINT "UpiMandate_vpaId_fkey" FOREIGN KEY ("vpaId") REFERENCES "Vpa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
