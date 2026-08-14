-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "codigo" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "comissaoPercentual" DECIMAL NOT NULL DEFAULT 0,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);
INSERT INTO "new_Produto" ("ativo", "atualizadoEm", "codigo", "criadoEm", "id", "nome") SELECT "ativo", "atualizadoEm", "codigo", "criadoEm", "id", "nome" FROM "Produto";
DROP TABLE "Produto";
ALTER TABLE "new_Produto" RENAME TO "Produto";
CREATE UNIQUE INDEX "Produto_nome_key" ON "Produto"("nome");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
