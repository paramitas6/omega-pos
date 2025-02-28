/*
  Warnings:

  - Added the required column `title` to the `TransactionItem` table without a default value. This is not possible if the table is not empty.

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
    "imageUrl" TEXT
);
INSERT INTO "new_Item" ("barcode", "id", "imageUrl", "inventory", "note", "price", "title") SELECT "barcode", "id", "imageUrl", "inventory", "note", "price", "title" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_barcode_key" ON "Item"("barcode");
CREATE TABLE "new_TransactionItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "title" TEXT NOT NULL,
    "barcode" TEXT,
    "itemId" INTEGER,
    "transactionId" INTEGER NOT NULL,
    CONSTRAINT "TransactionItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransactionItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TransactionItem" ("id", "itemId", "price", "quantity", "transactionId") SELECT "id", "itemId", "price", "quantity", "transactionId" FROM "TransactionItem";
DROP TABLE "TransactionItem";
ALTER TABLE "new_TransactionItem" RENAME TO "TransactionItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
