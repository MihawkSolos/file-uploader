-- Add the new `filepath` column with a temporary default value
ALTER TABLE "File" ADD COLUMN "filepath" TEXT DEFAULT '/uploads/default.txt';

-- Migrate existing `path` data to `filepath`
UPDATE "File" SET "filepath" = COALESCE("path", '/uploads/default.txt');

-- Remove the default value and make `filepath` NOT NULL
ALTER TABLE "File" ALTER COLUMN "filepath" DROP DEFAULT;
ALTER TABLE "File" ALTER COLUMN "filepath" SET NOT NULL;

-- Add the `folderId` column (can be NULL initially)
ALTER TABLE "File" ADD COLUMN "folderId" INTEGER;

-- Create the `Folder` table
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- Add a foreign key from `File` to `Folder`
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add a foreign key from `Folder` to `User`
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop the old `path` column now that data has been migrated
ALTER TABLE "File" DROP COLUMN "path";
