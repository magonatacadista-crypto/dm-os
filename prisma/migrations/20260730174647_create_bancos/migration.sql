-- CreateTable
CREATE TABLE "Banco" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "codigo" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lead" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "telefone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "origem" TEXT NOT NULL DEFAULT 'WhatsApp',
    "status" TEXT NOT NULL DEFAULT 'NOVO',
    "convenio" TEXT,
    "banco" TEXT,
    "bancoId" INTEGER,
    "produto" TEXT,
    "valorSolicitado" DECIMAL DEFAULT 0,
    "valorLiberado" DECIMAL DEFAULT 0,
    "observacoes" TEXT,
    "vendedorId" INTEGER,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "Lead_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "Banco" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Lead_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Vendedor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Lead" ("atualizadoEm", "banco", "convenio", "cpf", "criadoEm", "email", "id", "nome", "observacoes", "origem", "produto", "status", "telefone", "valorLiberado", "valorSolicitado", "vendedorId", "whatsapp") SELECT "atualizadoEm", "banco", "convenio", "cpf", "criadoEm", "email", "id", "nome", "observacoes", "origem", "produto", "status", "telefone", "valorLiberado", "valorSolicitado", "vendedorId", "whatsapp" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Banco_nome_key" ON "Banco"("nome");
