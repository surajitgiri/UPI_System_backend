-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('SAVINGS', 'CURRENT', 'SALARY', 'FIXED_DEPOSIT');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'FROZEN', 'CLOSED', 'DORMANT');

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "branchCode" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "managerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "availableBalance" DECIMAL(18,2) NOT NULL,
    "holdBalance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "minimumBalance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "openingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountLimit" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "dailyDebitLimit" DECIMAL(18,2) NOT NULL DEFAULT 100000,
    "dailyCreditLimit" DECIMAL(18,2) NOT NULL DEFAULT 500000,
    "monthlyTransferLimit" DECIMAL(18,2) NOT NULL DEFAULT 1000000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_branchCode_key" ON "Branch"("branchCode");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_ifscCode_key" ON "Branch"("ifscCode");

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountNumber_key" ON "Account"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AccountLimit_accountId_key" ON "AccountLimit"("accountId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountLimit" ADD CONSTRAINT "AccountLimit_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
