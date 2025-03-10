-- CreateEnum
CREATE TYPE "ModelTrainingStatusEnum" AS ENUM ('Pending', 'Generated', 'Failed');

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "falAiRequestId" TEXT,
ADD COLUMN     "tensorPath" TEXT,
ADD COLUMN     "trainingStatus" "ModelTrainingStatusEnum" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "triggerWords" TEXT;

-- AlterTable
ALTER TABLE "OutputImages" ADD COLUMN     "falAiRequestId" TEXT;

-- CreateIndex
CREATE INDEX "Model_falAiRequestId_idx" ON "Model"("falAiRequestId");

-- CreateIndex
CREATE INDEX "OutputImages_falAiRequestId_idx" ON "OutputImages"("falAiRequestId");
