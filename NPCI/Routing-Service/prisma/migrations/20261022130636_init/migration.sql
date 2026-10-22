-- CreateEnum
CREATE TYPE "ParticipantType" AS ENUM ('BANK', 'PSP');

-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "VpaRouteStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "LookupResult" AS ENUM ('FOUND', 'NOT_FOUND', 'INACTIVE', 'ERROR');

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ParticipantType" NOT NULL DEFAULT 'BANK',
    "ifscPrefix" TEXT,
    "status" "ParticipantStatus" NOT NULL DEFAULT 'ACTIVE',
    "grpcAddress" TEXT,
    "callbackUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vpa_handles" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vpa_handles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vpa_routes" (
    "id" TEXT NOT NULL,
    "vpa" TEXT NOT NULL,
    "vpaId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "status" "VpaRouteStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vpa_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lookup_logs" (
    "id" TEXT NOT NULL,
    "vpa" TEXT NOT NULL,
    "result" "LookupResult" NOT NULL,
    "bankCode" TEXT,
    "requestedBy" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lookup_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participants_bankCode_key" ON "participants"("bankCode");

-- CreateIndex
CREATE INDEX "participants_status_idx" ON "participants"("status");

-- CreateIndex
CREATE UNIQUE INDEX "vpa_handles_handle_key" ON "vpa_handles"("handle");

-- CreateIndex
CREATE INDEX "vpa_handles_participantId_idx" ON "vpa_handles"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "vpa_routes_vpa_key" ON "vpa_routes"("vpa");

-- CreateIndex
CREATE UNIQUE INDEX "vpa_routes_vpaId_key" ON "vpa_routes"("vpaId");

-- CreateIndex
CREATE INDEX "vpa_routes_participantId_idx" ON "vpa_routes"("participantId");

-- CreateIndex
CREATE INDEX "vpa_routes_bankCode_idx" ON "vpa_routes"("bankCode");

-- CreateIndex
CREATE INDEX "vpa_routes_status_idx" ON "vpa_routes"("status");

-- CreateIndex
CREATE INDEX "lookup_logs_vpa_idx" ON "lookup_logs"("vpa");

-- CreateIndex
CREATE INDEX "lookup_logs_result_idx" ON "lookup_logs"("result");

-- CreateIndex
CREATE INDEX "lookup_logs_createdAt_idx" ON "lookup_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "vpa_handles" ADD CONSTRAINT "vpa_handles_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vpa_routes" ADD CONSTRAINT "vpa_routes_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
