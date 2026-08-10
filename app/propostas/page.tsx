import Link from "next/link";

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
    status?: string;
    bancoId?: string;
    vendedorId?: string;
  }>;
};

type StatusFiltro =
  | "RASCUNHO"
  | "EM_ANALISE"
  | "APROVADA"
  | "REPROVADA"
  | "PAGA"
  | "CANCELADA";

function formatarMoeda(valor: unknown) {
  const numero = Number(valor);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(numero) ? numero : 0);
}

function formatarData(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(data);
}

function obterStatus(status: string) {
  switch (status) {
    case "RASCUNHO":
      return {
        texto: "Rascunho",
        variante: "default" as const,
      };

    case "EM_ANALISE":
      return {
        texto: "Em análise",
        variante: "warning" as const,
      };

    case "APROVADA":
      return {
        texto: "Aprovada",
        variante: "success" as const,
      };

    case "REPROVADA":
      return {
        texto: "Reprovada",
        variante: "danger" as const,
      };

    case "PAGA":
      return {
        texto: "Paga",
        variante: "success" as const,
      };

    case "CANCELADA":
      return {
        texto: "Cancelada",
        variante: "danger" as const,
      };

    default:
      return {
        texto: status,
        variante: "default" as const,
      };
  }
}

function converterStatusFiltro(
  valor: string | undefined,
): StatusFiltro | undefined {
  switch (valor) {
    case "RASCUNHO":
    case "EM_ANALISE":
    case "APROVADA":
    case "REPROVADA":
    case "PAGA":
    case "CANCELADA":
      return valor;

    default:
      return undefined;
  }
}

function converterIdFiltro(
  valor: string | undefined,
) {
  if (!valor) {
    return undefined;
  }

  const numero = Number(valor);

  if (!Number.isInteger(numero) || numero <= 0) {
    return undefined;
  }

  return numero;
}

export default async function PropostasPage({
  searchParams,
}: Props) {
  const parametros = await searchParams;

  const statusFiltro = converterStatusFiltro(
    parametros.status,
  );

  const bancoIdFiltro = converterIdFiltro(
    parametros.bancoId,
  );

  const vendedorIdFiltro = converterIdFiltro(
    parametros.vendedorId,
  );

  const [propostas, bancos, vendedores] =
    await Promise.all([
      prisma.proposta.findMany({
        where: {
          ...(statusFiltro
            ? {
                status: statusFiltro,
              }
            : {}),

          ...(bancoIdFiltro
            ? {
                bancoId: bancoIdFiltro,
              }
            : {}),

          ...(vendedorIdFiltro
            ? {
                vendedorId: vendedorIdFiltro,
              }
            : {}),
        },

        orderBy: {
          criadoEm: "desc",
        },

        include: {
          lead: {
            select: {
              id: true,
              nome: true,
            },
          },

          banco: {
            select: {
              nome: true,
            },
          },

          produto: {
            select: {
              nome: true,
            },
          },

          vendedor: {
            select: {
              nome: true,
            },
          },
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

  const totalPropostas = propostas.length;

  const emAnalise = propostas.filter(
    (proposta) =>
      proposta.status === "EM_ANALISE",
  ).length;

  const aprovadas = propostas.filter(
    (proposta) =>
      proposta.status === "APROVADA" ||
      proposta.status === "PAGA",
  ).length;

  const valorAprovadoTotal = propostas.reduce(
    (total, proposta) =>
      total +
      Number(proposta.valorAprovado ?? 0),
    0,
  );

  const filtrosAtivos =
    Boolean(statusFiltro) ||
    Boolean(bancoIdFiltro) ||
    Boolean(vendedorIdFiltro);

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-4 bg-slate-100 p-4 lg:p-6">
        <PageHeader
          title="Propostas"
          subtitle="Acompanhe todas as propostas comerciais da operação."
        />

        {/* INDICADORES */}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <p className="text-xs font-medium text-slate-500">
              Total de propostas
            </p>

            <div className="mt-2 flex items-center justify-between">
              <strong className="text-2xl text-slate-900">
                {totalPropostas}
              </strong>

              <Badge variant="info">
                {filtrosAtivos
                  ? "Filtradas"
                  : "Carteira"}
              </Badge>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-medium text-slate-500">
              Em análise
            </p>

            <div className="mt-2 flex items-center justify-between">
              <strong className="text-2xl text-slate-900">
                {emAnalise}
              </strong>

              <Badge variant="warning">
                Aguardando
              </Badge>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-medium text-slate-500">
              Aprovadas ou pagas
            </p>

            <div className="mt-2 flex items-center justify-between">
              <strong className="text-2xl text-slate-900">
                {aprovadas}
              </strong>

              <Badge variant="success">
                Convertidas
              </Badge>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-medium text-slate-500">
              Valor aprovado
            </p>

            <div className="mt-2 flex items-center justify-between gap-2">
              <strong className="text-xl text-slate-900">
                {formatarMoeda(
                  valorAprovadoTotal,
                )}
              </strong>

              <Badge>
                Produção
              </Badge>
            </div>
          </Card>
        </div>

        {/* FILTROS */}

        <Card>
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Filtros
            </h2>

            <p className="text-xs text-slate-500">
              Refine a visualização das propostas.
            </p>
          </div>

          <form
            method="GET"
            className="grid items-end gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <div>
              <label
                htmlFor="status"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue={
                  statusFiltro ?? ""
                }
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Todos os status
                </option>

                <option value="RASCUNHO">
                  Rascunho
                </option>

                <option value="EM_ANALISE">
                  Em análise
                </option>

                <option value="APROVADA">
                  Aprovada
                </option>

                <option value="REPROVADA">
                  Reprovada
                </option>

                <option value="PAGA">
                  Paga
                </option>

                <option value="CANCELADA">
                  Cancelada
                </option>
              </select>
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
                  bancoIdFiltro
                    ? String(bancoIdFiltro)
                    : ""
                }
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Todos os bancos
                </option>

                {bancos.map((banco) => (
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
                  vendedorIdFiltro
                    ? String(
                        vendedorIdFiltro,
                      )
                    : ""
                }
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Todos os vendedores
                </option>

                {vendedores.map(
                  (vendedor) => (
                    <option
                      key={vendedor.id}
                      value={vendedor.id}
                    >
                      {vendedor.nome}
                      {vendedor.situacao !==
                      "ATIVO"
                        ? " — Inativo"
                        : ""}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Filtrar
              </button>

              {filtrosAtivos && (
                <Link
                  href="/propostas"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Limpar
                </Link>
              )}
            </div>
          </form>
        </Card>

        {/* TABELA */}

        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Lista de propostas
              </h2>

              <p className="text-xs text-slate-500">
                {filtrosAtivos
                  ? `${totalPropostas} proposta(s) encontrada(s) com os filtros aplicados.`
                  : "Propostas ordenadas da mais recente para a mais antiga."}
              </p>
            </div>

            {filtrosAtivos && (
              <Badge variant="info">
                Filtros ativos
              </Badge>
            )}
          </div>

          {propostas.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
              Nenhuma proposta encontrada.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Proposta
                  </TableHead>

                  <TableHead>
                    Cliente
                  </TableHead>

                  <TableHead>
                    Banco
                  </TableHead>

                  <TableHead>
                    Produto
                  </TableHead>

                  <TableHead>
                    Vendedor
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead>
                    Solicitado
                  </TableHead>

                  <TableHead>
                    Aprovado
                  </TableHead>

                  <TableHead>
                    Cadastro
                  </TableHead>

                  <TableHead className="text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {propostas.map(
                  (proposta) => {
                    const status =
                      obterStatus(
                        proposta.status,
                      );

                    return (
                      <TableRow
                        key={proposta.id}
                      >
                        <TableCell className="font-medium text-slate-900">
                          #{proposta.id}
                        </TableCell>

                        <TableCell>
                          <Link
                            href={`/leads/${proposta.lead.id}`}
                            className="font-medium text-slate-800 hover:text-blue-600"
                          >
                            {
                              proposta
                                .lead.nome
                            }
                          </Link>
                        </TableCell>

                        <TableCell>
                          {proposta.banco
                            ?.nome ?? (
                            <span className="text-slate-400">
                              Não informado
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {proposta.produto
                            ?.nome ?? (
                            <span className="text-slate-400">
                              Não informado
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {proposta.vendedor
                            ?.nome ?? (
                            <span className="text-slate-400">
                              Não atribuído
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              status.variante
                            }
                          >
                            {status.texto}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {formatarMoeda(
                            proposta.valorSolicitado,
                          )}
                        </TableCell>

                        <TableCell>
                          {formatarMoeda(
                            proposta.valorAprovado,
                          )}
                        </TableCell>

                        <TableCell>
                          {formatarData(
                            proposta.criadoEm,
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/propostas/${proposta.id}`}
                              className="inline-flex h-8 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                              Abrir
                            </Link>

                            <Link
                              href={`/propostas/${proposta.id}/editar`}
                              className="inline-flex h-8 items-center justify-center rounded-md bg-blue-600 px-3 text-xs font-medium text-white transition hover:bg-blue-700"
                            >
                              Editar
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  },
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>
    </div>
  );
}