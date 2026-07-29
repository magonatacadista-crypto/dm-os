-- CreateTable
CREATE TABLE "Vendedor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "dataNascimento" DATETIME,
    "telefone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "matricula" TEXT,
    "cargo" TEXT NOT NULL DEFAULT 'Vendedor',
    "dataAdmissao" DATETIME,
    "situacao" TEXT NOT NULL DEFAULT 'ATIVO',
    "metaMensal" DECIMAL NOT NULL DEFAULT 0,
    "metaContratos" INTEGER NOT NULL DEFAULT 0,
    "comissaoPadrao" DECIMAL NOT NULL DEFAULT 0,
    "observacoes" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendedor_cpf_key" ON "Vendedor"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Vendedor_matricula_key" ON "Vendedor"("matricula");
