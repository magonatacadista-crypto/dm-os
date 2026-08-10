-- CreateTable
CREATE TABLE "Proposta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'RASCUNHO',
    "valorSolicitado" DECIMAL NOT NULL DEFAULT 0,
    "valorAprovado" DECIMAL NOT NULL DEFAULT 0,
    "prazo" INTEGER,
    "valorParcela" DECIMAL,
    "taxa" DECIMAL,
    "observacoes" TEXT,
    "leadId" INTEGER NOT NULL,
    "bancoId" INTEGER,
    "convenioId" INTEGER,
    "produtoId" INTEGER,
    "vendedorId" INTEGER,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "Proposta_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Proposta_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "Banco" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Proposta_convenioId_fkey" FOREIGN KEY ("convenioId") REFERENCES "Convenio" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Proposta_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Proposta_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Vendedor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
