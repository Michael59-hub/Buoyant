-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "vendorId" TEXT NOT NULL DEFAULT 'c8cbac5f-452e-42d9-b750-17aacd22ff3c';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'customer';

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
