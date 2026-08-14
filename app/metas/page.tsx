import { salvarMeta } from "./actions";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";

import { prisma } from "../lib/prisma";

function formatarMoeda(valor: unknown) {
  const numero = Number(valor);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(numero) ? numero : 0);
}

function nomeMes(mes: number) {
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return meses[mes - 1] ?? String(mes);
}

export default async function MetasPage() {
  const [vendedores, metas] =
    await Promise.all([
      prisma.vendedor.findMany({
        where: {
          situacao: "ATIVO",
        },

        orderBy: {
          nome: "asc",
        },

        select: {
          id: true,
          nome: true,
        },
      }),

      prisma.metaMensalVendedor.findMany({
        orderBy: [
          {
            ano: "desc",
          },
          {
            mes: "desc",
          },
        ],

        include: {
          vendedor: {
            select: {
              nome: true,
            },
          },
        },
      }),
    ]);

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-4 bg-slate-100 p-4 lg:p-6">
        <PageHeader
          title="Metas Mensais"
          subtitle="Defina as metas comerciais por vendedor e competência."
        />

        <Card>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">
              Nova meta
            </h2>

            <p className="text-xs text-slate-500">
              Informe vendedor, mês, ano e os objetivos da competência.
            </p>
          </div>

          <form
  action={salvarMeta}
  className="grid items-end gap-3 md:grid-cols-2 xl:grid-cols-6"
>
            <div>
              <label
                htmlFor="vendedorId"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Vendedor
              </label>

              <select
                id="vendedorId"
                name="vendedorId"
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Selecione
                </option>

                {vendedores.map((vendedor) => (
                  <option
                    key={vendedor.id}
                    value={vendedor.id}
                  >
                    {vendedor.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="mes"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Mês
              </label>

              <select
                id="mes"
                name="mes"
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {Array.from(
                  { length: 12 },
                  (_, i) => i + 1,
                ).map((mes) => (
                  <option
                    key={mes}
                    value={mes}
                  >
                    {nomeMes(mes)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="ano"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Ano
              </label>

              <input
                id="ano"
                name="ano"
                type="number"
                defaultValue={new Date().getFullYear()}
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="metaValor"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Meta em valor
              </label>

              <input
                id="metaValor"
                name="metaValor"
                inputMode="decimal"
                placeholder="0,00"
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="metaContratos"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Meta contratos
              </label>

              <input
                id="metaContratos"
                name="metaContratos"
                type="number"
                min="0"
                defaultValue="0"
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <button
                type="submit"
                className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Salvar Meta
              </button>
            </div>
          </form>
        </Card>

        <Card>
          <div className="mb-3">
            <h2 className="text-base font-semibold text-slate-900">
              Metas cadastradas
            </h2>

            <p className="text-xs text-slate-500">
              Histórico de metas por vendedor e competência.
            </p>
          </div>

          {metas.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
              Nenhuma meta cadastrada.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Meta em valor</TableHead>
                  <TableHead>Meta contratos</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {metas.map((meta) => (
                  <TableRow key={meta.id}>
                    <TableCell className="font-medium text-slate-900">
                      {meta.vendedor.nome}
                    </TableCell>

                    <TableCell>
                      {nomeMes(meta.mes)} / {meta.ano}
                    </TableCell>

                    <TableCell>
                      {formatarMoeda(meta.metaValor)}
                    </TableCell>

                    <TableCell>
                      {meta.metaContratos}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>
    </div>
  );
}