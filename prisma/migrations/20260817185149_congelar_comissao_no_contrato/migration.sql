-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contrato" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RASCUNHO',
    "valorContratado" DECIMAL NOT NULL DEFAULT 0,
    "valorLiberado" DECIMAL NOT NULL DEFAULT 0,
    "prazo" INTEGER,
    "valorParcela" DECIMAL,
    "taxa" DECIMAL,
    "dataDigitacao" DATETIME,
    "dataAprovacao" DATETIME,
    "dataPagamento" DATETIME,
    "comissaoPaga" BOOLEAN NOT NULL DEFAULT false,
    "dataComissaoPaga" DATETIME,
    "comissaoPercentual" DECIMAL NOT NULL DEFAULT 0,
    "valorComissao" DECIMAL NOT NULL DEFAULT 0,
    "observacoes" TEXT,
    "propostaId" INTEGER NOT NULL,
    "leadId" INTEGER NOT NULL,
    "bancoId" INTEGER,
    "convenioId" INTEGER,
    "produtoId" INTEGER,
    "vendedorId" INTEGER,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "Contrato_propostaId_fkey" FOREIGN KEY ("propostaId") REFERENCES "Proposta" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Contrato_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Contrato_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "Banco" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Contrato_convenioId_fkey" FOREIGN KEY ("convenioId") REFERENCES "Convenio" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Contrato_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Contrato_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Vendedor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Contrato" ("atualizadoEm", "bancoId", "comissaoPaga", "convenioId", "criadoEm", "dataAprovacao", "dataComissaoPaga", "dataDigitacao", "dataPagamento", "id", "leadId", "numero", "observacoes", "prazo", "produtoId", "propostaId", "status", "taxa", "valorContratado", "valorLiberado", "valorParcela", "vendedorId") SELECT "atualizadoEm", "bancoId", "comissaoPaga", "convenioId", "criadoEm", "dataAprovacao", "dataComissaoPaga", "dataDigitacao", "dataPagamento", "id", "leadId", "numero", "observacoes", "prazo", "produtoId", "propostaId", "status", "taxa", "valorContratado", "valorLiberado", "valorParcela", "vendedorId" FROM "Contrato";
DROP TABLE "Contrato";
ALTER TABLE "new_Contrato" RENAME TO "Contrato";
CREATE UNIQUE INDEX "Contrato_numero_key" ON "Contrato"("numero");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
