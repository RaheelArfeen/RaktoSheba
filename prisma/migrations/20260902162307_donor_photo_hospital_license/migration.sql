-- AlterTable
ALTER TABLE "DonorProfile" ADD COLUMN     "photoUrl" TEXT;

-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "licenseDocUrl" TEXT;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "updatedAt" DROP DEFAULT;

