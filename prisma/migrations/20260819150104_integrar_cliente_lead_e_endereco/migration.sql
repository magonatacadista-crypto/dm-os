-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "bairro" TEXT;
ALTER TABLE "Lead" ADD COLUMN "cep" TEXT;
ALTER TABLE "Lead" ADD COLUMN "cidade" TEXT;
ALTER TABLE "Lead" ADD COLUMN "complemento" TEXT;
ALTER TABLE "Lead" ADD COLUMN "estado" TEXT;
ALTER TABLE "Lead" ADD COLUMN "logradouro" TEXT;
ALTER TABLE "Lead" ADD COLUMN "numero" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "cep" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "leadId" INTEGER,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Cliente_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Cliente" ("cpf", "criadoEm", "email", "id", "nome", "telefone") SELECT "cpf", "criadoEm", "email", "id", "nome", "telefone" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");
CREATE UNIQUE INDEX "Cliente_leadId_key" ON "Cliente"("leadId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
