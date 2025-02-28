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
    "imageUrl" TEXT
);
INSERT INTO "new_Item" ("barcode", "id", "imageUrl", "inventory", "note", "price", "title") SELECT "barcode", "id", "imageUrl", "inventory", "note", "price", "title" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_barcode_key" ON "Item"("barcode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
