-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'CLOSED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('CURRENT', 'PERMANENT', 'OFFICE');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "customerNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "occupation" TEXT,
    "annualIncome" DECIMAL(15,2),
    "maritalStatus" "MaritalStatus",
    "status" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "landmark" TEXT,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nominee" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nominee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KYC" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "aadhaarNumber" TEXT NOT NULL,
    "panNumber" TEXT NOT NULL,
    "passportNumber" TEXT,
    "voterId" TEXT,
    "drivingLicense" TEXT,
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KYC_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerNumber_key" ON "Customer"("customerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Nominee_customerId_key" ON "Nominee"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "KYC_customerId_key" ON "KYC"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "KYC_aadhaarNumber_key" ON "KYC"("aadhaarNumber");

-- CreateIndex
CREATE UNIQUE INDEX "KYC_panNumber_key" ON "KYC"("panNumber");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nominee" ADD CONSTRAINT "Nominee_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KYC" ADD CONSTRAINT "KYC_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
