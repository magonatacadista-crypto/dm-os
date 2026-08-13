import Sidebar from "../components/layout/Sidebar";
import Badge from "../components/ui/Badge";
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
type Props = {
  searchParams: Promise<{
    dataInicial?: string;
    dataFinal?: string;
    bancoId?: string;
    vendedorId?: string;
  }>;
};

function formatarMoeda(valor: unknown) {
  const numero = Number(valor);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(numero) ? numero : 0);
}
function converterDataInicial(
  valor: string | undefined,
) {
  if (!valor) {
    return undefined;
  }

  const data = new Date(
    `${valor}T00:00:00`,
  );

  if (Number.isNaN(data.getTime())) {
    return undefined;
  }

  return data;
}

function converterDataFinal(
  valor: string | undefined,
) {
  if (!valor) {
    return undefined;
  }

  const data = new Date(
    `${valor}T23:59:59.999`,
  );

  if (Number.isNaN(data.getTime())) {
    return undefined;
  }

  return data;
}

export default async function ProducaoPage({
  searchParams,
}: Props) {
  const parametros = await searchParams;

const dataInicialFiltro =
  converterDataInicial(
    parametros.dataInicial,
  );

const dataFinalFiltro =
  converterDataFinal(
    parametros.dataFinal,
  );

const bancoIdFiltro = Number(
  parametros.bancoId,
);

const bancoIdValido =
  Number.isInteger(bancoIdFiltro) &&
  bancoIdFiltro > 0;
  const vendedorIdFiltro = Number(
  parametros.vendedorId,
);

const vendedorIdValido =
  Number.isInteger(vendedorIdFiltro) &&
  vendedorIdFiltro > 0;

const [contratos, bancosFiltro, vendedoresFiltro] =
  await Promise.all([
    prisma.contrato.findMany({
      where: {
        status: {
          in: ["APROVADO", "PAGO"],
        },

        ...(bancoIdValido
          ? {
              bancoId: bancoIdFiltro,
            }
          : {}),
          ...(vendedorIdValido
  ? {
      vendedorId: vendedorIdFiltro,
    }
  : {}),

        ...((dataInicialFiltro || dataFinalFiltro)
          ? {
              criadoEm: {
                ...(dataInicialFiltro
                  ? {
                      gte: dataInicialFiltro,
                    }
                  : {}),

                ...(dataFinalFiltro
                  ? {
                      lte: dataFinalFiltro,
                    }
                  : {}),
              },
            }
          : {}),
      },

      include: {
        banco: {
          select: {
            id: true,
            nome: true,
          },
        },

        vendedor: {
          select: {
            id: true,
            nome: true,
          },
        },
      },

      orderBy: {
        criadoEm: "desc",
      },
    }),

    prisma.banco.findMany({
      orderBy: {
        nome: "asc",
      },

      select: {
        id: true,
        nome: true,
        ativo: true,
      },
    }),
    prisma.vendedor.findMany({
  orderBy: {
    nome: "asc",
  },

  select: {
    id: true,
    nome: true,
    situacao: true,
  },
}),
  ]);

  const totalContratos = contratos.length;

  const contratosPagos = contratos.filter(
    (contrato) => contrato.status === "PAGO",
  ).length;

  const valorContratadoTotal = contratos.reduce(
    (total, contrato) =>
      total + Number(contrato.valorContratado ?? 0),
    0,
  );

  const valorLiberadoTotal = contratos.reduce(
    (total, contrato) =>
      total + Number(contrato.valorLiberado ?? 0),
    0,
  );

  const producaoPorVendedor = new Map<
    string,
    {
      nome: string;
      contratos: number;
      valorContratado: number;
      valorLiberado: number;
    }
  >();

  for (const contrato of contratos) {
    const chave = contrato.vendedor
      ? String(contrato.vendedor.id)
      : "sem-vendedor";

    const atual = producaoPorVendedor.get(chave) ?? {
      nome:
        contrato.vendedor?.nome ??
        "Não atribuído",
      contratos: 0,
      valorContratado: 0,
      valorLiberado: 0,
    };

    atual.contratos += 1;
    atual.valorContratado += Number(
      contrato.valorContratado ?? 0,
    );
    atual.valorLiberado += Number(
      contrato.valorLiberado ?? 0,
    );

    producaoPorVendedor.set(chave, atual);
  }

  const producaoPorBanco = new Map<
    string,
    {
      nome: string;
      contratos: number;
      valorContratado: number;
      valorLiberado: number;
    }
  >();

  for (const contrato of contratos) {
    const chave = contrato.banco
      ? String(contrato.banco.id)
      : "sem-banco";

    const atual = producaoPorBanco.get(chave) ?? {
      nome:
        contrato.banco?.nome ??
        "Não informado",
      contratos: 0,
      valorContratado: 0,
      valorLiberado: 0,
    };

    atual.contratos += 1;
    atual.valorContratado += Number(
      contrato.valorContratado ?? 0,
    );
    atual.valorLiberado += Number(
      contrato.valorLiberado ?? 0,
    );

    producaoPorBanco.set(chave, atual);
  }

  const vendedores = Array.from(
    producaoPorVendedor.values(),
  ).sort(
    (a, b) =>
      b.valorLiberado - a.valorLiberado,
  );

  const bancos = Array.from(
    producaoPorBanco.values(),
  ).sort(
    (a, b) =>
      b.valorLiberado - a.valorLiberado,
  );

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-4 bg-slate-100 p-4 lg:p-6">
        <PageHeader
          title="Produção"
          subtitle="Acompanhe a produção consolidada dos contratos aprovados e pagos."
        />
        <Card>
  <div className="mb-3">
    <h2 className="text-sm font-semibold text-slate-900">
      Filtros
    </h2>

    <p className="text-xs text-slate-500">
      Selecione o período da produção.
    </p>
  </div>

<form
  method="GET"
  className="grid items-end gap-3 md:grid-cols-2 xl:grid-cols-5"
>
  <div>
    <label
      htmlFor="dataInicial"
      className="mb-1.5 block text-xs font-medium text-slate-600"
    >
      Data inicial
    </label>

    <input
      id="dataInicial"
      name="dataInicial"
      type="date"
      defaultValue={
        parametros.dataInicial ?? ""
      }
      className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  </div>

  <div>
    <label
      htmlFor="dataFinal"
      className="mb-1.5 block text-xs font-medium text-slate-600"
    >
      Data final
    </label>

    <input
      id="dataFinal"
      name="dataFinal"
      type="date"
      defaultValue={
        parametros.dataFinal ?? ""
      }
      className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  </div>

  <div>
    <label
      htmlFor="bancoId"
      className="mb-1.5 block text-xs font-medium text-slate-600"
    >
      Banco
    </label>

    <select
      id="bancoId"
      name="bancoId"
      defaultValue={
        bancoIdValido
          ? String(bancoIdFiltro)
          : ""
      }
      className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      <option value="">
        Todos os bancos
      </option>

      {bancosFiltro.map((banco) => (
        <option
          key={banco.id}
          value={banco.id}
        >
          {banco.nome}
          {!banco.ativo
            ? " — Inativo"
            : ""}
        </option>
      ))}
    </select>
  </div>

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
      defaultValue={
        vendedorIdValido
          ? String(vendedorIdFiltro)
          : ""
      }
      className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      <option value="">
        Todos os vendedores
      </option>

      {vendedoresFiltro.map((vendedor) => (
        <option
          key={vendedor.id}
          value={vendedor.id}
        >
          {vendedor.nome}
          {vendedor.situacao !== "ATIVO"
            ? " — Inativo"
            : ""}
        </option>
      ))}
    </select>
  </div>

  <div>
    <button
      type="submit"
      className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
    >
      Filtrar
    </button>
  </div>
</form>
</Card>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <p className="text-xs font-medium text-slate-500">
              Contratos
            </p>

            <div className="mt-2 flex items-center justify-between">
              <strong className="text-2xl text-slate-900">
                {totalContratos}
              </strong>

              <Badge variant="info">
                Produção
              </Badge>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-medium text-slate-500">
              Contratos pagos
            </p>

            <div className="mt-2 flex items-center justify-between">
              <strong className="text-2xl text-slate-900">
                {contratosPagos}
              </strong>

              <Badge variant="success">
                Pagos
              </Badge>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-medium text-slate-500">
              Valor contratado
            </p>

            <div className="mt-2">
              <strong className="text-xl text-slate-900">
                {formatarMoeda(
                  valorContratadoTotal,
                )}
              </strong>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-medium text-slate-500">
              Valor liberado
            </p>

            <div className="mt-2">
              <strong className="text-xl text-slate-900">
                {formatarMoeda(
                  valorLiberadoTotal,
                )}
              </strong>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <div className="mb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Produção por vendedor
              </h2>

              <p className="text-xs text-slate-500">
                Ranking por valor liberado.
              </p>
            </div>

            {vendedores.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
                Nenhuma produção encontrada.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Vendedor
                    </TableHead>

                    <TableHead>
                      Contratos
                    </TableHead>

                    <TableHead>
                      Contratado
                    </TableHead>

                    <TableHead>
                      Liberado
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {vendedores.map(
                    (vendedor) => (
                      <TableRow
                        key={vendedor.nome}
                      >
                        <TableCell className="font-medium text-slate-900">
                          {vendedor.nome}
                        </TableCell>

                        <TableCell>
                          {vendedor.contratos}
                        </TableCell>

                        <TableCell>
                          {formatarMoeda(
                            vendedor.valorContratado,
                          )}
                        </TableCell>

                        <TableCell>
                          {formatarMoeda(
                            vendedor.valorLiberado,
                          )}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            )}
          </Card>

          <Card>
            <div className="mb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Produção por banco
              </h2>

              <p className="text-xs text-slate-500">
                Distribuição por instituição financeira.
              </p>
            </div>

            {bancos.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
                Nenhuma produção encontrada.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Banco
                    </TableHead>

                    <TableHead>
                      Contratos
                    </TableHead>

                    <TableHead>
                      Contratado
                    </TableHead>

                    <TableHead>
                      Liberado
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {bancos.map(
                    (banco) => (
                      <TableRow
                        key={banco.nome}
                      >
                        <TableCell className="font-medium text-slate-900">
                          {banco.nome}
                        </TableCell>

                        <TableCell>
                          {banco.contratos}
                        </TableCell>

                        <TableCell>
                          {formatarMoeda(
                            banco.valorContratado,
                          )}
                        </TableCell>

                        <TableCell>
                          {formatarMoeda(
                            banco.valorLiberado,
                          )}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}