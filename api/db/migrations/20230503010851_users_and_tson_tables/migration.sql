-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "apiToken" VARCHAR(15) NOT NULL DEFAULT nanoid(15),
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tuning" (
    "id" VARCHAR(10) NOT NULL DEFAULT nanoid(10),
    "authorId" INTEGER NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "description" TEXT,
    "tson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tuning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spectrum" (
    "id" VARCHAR(10) NOT NULL DEFAULT nanoid(10),
    "authorId" INTEGER NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "description" TEXT,
    "tson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spectrum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Set" (
    "id" VARCHAR(10) NOT NULL DEFAULT nanoid(10),
    "authorId" INTEGER NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "description" TEXT,
    "tson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SpectrumToTuning" (
    "A" VARCHAR(10) NOT NULL,
    "B" VARCHAR(10) NOT NULL
);

-- CreateTable
CREATE TABLE "_SetToSpectrum" (
    "A" VARCHAR(10) NOT NULL,
    "B" VARCHAR(10) NOT NULL
);

-- CreateTable
CREATE TABLE "_SetToTuning" (
    "A" VARCHAR(10) NOT NULL,
    "B" VARCHAR(10) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_apiToken_key" ON "User"("apiToken");

-- CreateIndex
CREATE UNIQUE INDEX "_SpectrumToTuning_AB_unique" ON "_SpectrumToTuning"("A", "B");

-- CreateIndex
CREATE INDEX "_SpectrumToTuning_B_index" ON "_SpectrumToTuning"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SetToSpectrum_AB_unique" ON "_SetToSpectrum"("A", "B");

-- CreateIndex
CREATE INDEX "_SetToSpectrum_B_index" ON "_SetToSpectrum"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SetToTuning_AB_unique" ON "_SetToTuning"("A", "B");

-- CreateIndex
CREATE INDEX "_SetToTuning_B_index" ON "_SetToTuning"("B");

-- AddForeignKey
ALTER TABLE "Tuning" ADD CONSTRAINT "Tuning_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spectrum" ADD CONSTRAINT "Spectrum_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpectrumToTuning" ADD CONSTRAINT "_SpectrumToTuning_A_fkey" FOREIGN KEY ("A") REFERENCES "Spectrum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpectrumToTuning" ADD CONSTRAINT "_SpectrumToTuning_B_fkey" FOREIGN KEY ("B") REFERENCES "Tuning"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetToSpectrum" ADD CONSTRAINT "_SetToSpectrum_A_fkey" FOREIGN KEY ("A") REFERENCES "Set"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetToSpectrum" ADD CONSTRAINT "_SetToSpectrum_B_fkey" FOREIGN KEY ("B") REFERENCES "Spectrum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetToTuning" ADD CONSTRAINT "_SetToTuning_A_fkey" FOREIGN KEY ("A") REFERENCES "Set"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetToTuning" ADD CONSTRAINT "_SetToTuning_B_fkey" FOREIGN KEY ("B") REFERENCES "Tuning"("id") ON DELETE CASCADE ON UPDATE CASCADE;
