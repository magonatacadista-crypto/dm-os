-- CreateTable
CREATE TABLE "MetaMensalVendedor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "metaValor" DECIMAL NOT NULL DEFAULT 0,
    "metaContratos" INTEGER NOT NULL DEFAULT 0,
    "vendedorId" INTEGER NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "MetaMensalVendedor_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Vendedor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MetaMensalVendedor_vendedorId_ano_mes_key" ON "MetaMensalVendedor"("vendedorId", "ano", "mes");
