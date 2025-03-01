/*
  Warnings:

  - You are about to drop the column `taxIncluded` on the `Transaction` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "barcode" TEXT,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "price" REAL NOT NULL,
    "inventory" INTEGER,
    "quickItem" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "taxIncluded" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Item" ("barcode", "id", "imageUrl", "inventory", "note", "price", "quickItem", "title") SELECT "barcode", "id", "imageUrl", "inventory", "note", "price", "quickItem", "title" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_barcode_key" ON "Item"("barcode");
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" REAL NOT NULL,
    "tax" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "receiptId" TEXT
);
INSERT INTO "new_Transaction" ("createdAt", "id", "paymentMethod", "receiptId", "status", "tax", "total") SELECT "createdAt", "id", "paymentMethod", "receiptId", "status", "tax", "total" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE UNIQUE INDEX "Transaction_receiptId_key" ON "Transaction"("receiptId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
