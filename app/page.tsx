import Link from "next/link";

import Sidebar from "./components/layout/Sidebar";
import Badge from "./components/ui/Badge";
import Card from "./components/ui/Card";
import PageHeader from "./components/ui/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/Table";

import { prisma } from "./lib/prisma";

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
    case "NOVO":
      return {
        texto: "Novo",
        variante: "info" as const,
      };

    case "PRIMEIRO_CONTATO":
      return {
        texto: "Primeiro contato",
        variante: "warning" as const,
      };

    case "DOCUMENTACAO":
      return {
        texto: "Documentação",
        variante: "warning" as const,
      };

    case "DIGITACAO":
      return {
        texto: "Digitação",
        variante: "info" as const,
      };

    case "EM_ANALISE":
      return {
        texto: "Em análise",
        variante: "info" as const,
      };

    case "APROVADO":
      return {
        texto: "Aprovado",
        variante: "success" as const,
      };

    case "PAGO":
      return {
        texto: "Pago",
        variante: "success" as const,
      };

    case "PERDIDO":
      return {
        texto: "Perdido",
        variante: "danger" as const,
      };

    default:
      return {
        texto: status,
        variante: "default" as const,
      };
  }
}

export default async function Home() {
  const [
    totalClientes,
    totalVendedores,
    vendedoresAtivos,
    vendedores,
    totalLeads,
    leadsNovos,
    leadsConvertidos,
    leads,
    ultimosLeads,
  ] = await Promise.all([
    prisma.cliente.count(),

    prisma.vendedor.count(),

    prisma.vendedor.count({
      where: {
        situacao: "ATIVO",
      },
    }),

    prisma.vendedor.findMany({
      select: {
        metaMensal: true,
        metaContratos: true,
      },
    }),

    prisma.lead.count(),

    prisma.lead.count({
      where: {
        status: "NOVO",
      },
    }),

    prisma.lead.count({
      where: {
        status: {
          in: ["APROVADO", "PAGO"],
        },
      },
    }),

    prisma.lead.findMany({
      select: {
        valorSolicitado: true,
        valorLiberado: true,
      },
    }),

    prisma.lead.findMany({
      orderBy: {
        criadoEm: "desc",
      },
      take: 5,
      include: {
        vendedor: {
          select: {
            nome: true,
          },
        },
        bancoCadastro: {
          select: {
            nome: true,
          },
        },
        convenioCadastro: {
          select: {
            nome: true,
          },
        },
      },
    }),
  ]);

  const metaMensalTotal = vendedores.reduce(
    (total, vendedor) =>
      total + Number(vendedor.metaMensal),
    0,
  );

  const metaContratosTotal = vendedores.reduce(
    (total, vendedor) =>
      total + vendedor.metaContratos,
    0,
  );

  const valorSolicitadoTotal = leads.reduce(
    (total, lead) =>
      total + Number(lead.valorSolicitado ?? 0),
    0,
  );

  const valorLiberadoTotal = leads.reduce(
    (total, lead) =>
      total + Number(lead.valorLiberado ?? 0),
    0,
  );

  const taxaConversao =
    totalLeads > 0
      ? (leadsConvertidos / totalLeads) * 100
      : 0;

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-6 bg-slate-100 p-6 lg:p-10">
        <PageHeader
          title="Dashboard"
          subtitle="Visão geral da operação da D&M Crédito Consignado."
          action={
            <Link
              href="/leads/novo"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              + Novo Lead
            </Link>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <p className="text-sm font-medium text-slate-500">
              Total de leads
            </p>

            <div className="mt-3 flex items-center justify-between">
              <strong className="text-3xl text-slate-900">
                {totalLeads}
              </strong>

              <Badge variant="info">
                Oportunidades
              </Badge>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Leads novos
            </p>

            <div className="mt-3 flex items-center justify-between">
              <strong className="text-3xl text-slate-900">
                {leadsNovos}
              </strong>

              <Badge variant="warning">
                Aguardando
              </Badge>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Aprovados ou pagos
            </p>

            <div className="mt-3 flex items-center justify-between">
              <strong className="text-3xl text-slate-900">
                {leadsConvertidos}
              </strong>

              <Badge variant="success">
                Convertidos
              </Badge>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Taxa de conversão
            </p>

            <div className="mt-3 flex items-center justify-between">
              <strong className="text-3xl text-slate-900">
                {taxaConversao.toFixed(1)}%
              </strong>

              <Badge variant="info">
                Resultado
              </Badge>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <p className="text-sm font-medium text-slate-500">
              Valor solicitado
            </p>

            <div className="mt-3 flex items-center justify-between gap-3">
              <strong className="text-2xl text-slate-900">
                {formatarMoeda(valorSolicitadoTotal)}
              </strong>

              <Badge>Carteira</Badge>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Valor liberado
            </p>

            <div className="mt-3 flex items-center justify-between gap-3">
              <strong className="text-2xl text-slate-900">
                {formatarMoeda(valorLiberadoTotal)}
              </strong>

              <Badge variant="success">
                Produção
              </Badge>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Meta mensal da equipe
            </p>

            <div className="mt-3 flex items-center justify-between gap-3">
              <strong className="text-2xl text-slate-900">
                {formatarMoeda(metaMensalTotal)}
              </strong>

              <Badge variant="warning">
                Meta
              </Badge>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Meta de contratos
            </p>

            <div className="mt-3 flex items-center justify-between">
              <strong className="text-3xl text-slate-900">
                {metaContratosTotal}
              </strong>

              <Badge variant="info">
                Mensal
              </Badge>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Leads cadastrados recentemente
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Últimas oportunidades incluídas no sistema.
                </p>
              </div>

              <Link
                href="/leads"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Ver todos
              </Link>
            </div>

            {ultimosLeads.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                Nenhum lead cadastrado.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Banco</TableHead>
                    <TableHead>Convênio</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Cadastro</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {ultimosLeads.map((lead) => {
                    const status = obterStatus(lead.status);

                    const nomeBanco =
                      lead.bancoCadastro?.nome ??
                      lead.banco ??
                      null;

                    const nomeConvenio =
                      lead.convenioCadastro?.nome ??
                      lead.convenio ??
                      null;

                    return (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="hover:text-blue-600"
                          >
                            {lead.nome}
                          </Link>
                        </TableCell>

                        <TableCell>
                          {nomeBanco ?? (
                            <span className="text-slate-400">
                              Não informado
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {nomeConvenio ?? (
                            <span className="text-slate-400">
                              Não informado
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <Badge variant={status.variante}>
                            {status.texto}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {lead.vendedor?.nome ?? (
                            <span className="text-slate-400">
                              Não atribuído
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {formatarData(lead.criadoEm)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-slate-900">
              Resumo operacional
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="text-sm text-slate-500">
                  Clientes cadastrados
                </span>

                <strong className="text-slate-900">
                  {totalClientes}
                </strong>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="text-sm text-slate-500">
                  Equipe ativa
                </span>

                <strong className="text-slate-900">
                  {vendedoresAtivos} de {totalVendedores}
                </strong>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="text-sm text-slate-500">
                  Leads convertidos
                </span>

                <strong className="text-slate-900">
                  {leadsConvertidos} de {totalLeads}
                </strong>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="text-sm text-slate-500">
                  Valor solicitado
                </span>

                <strong className="text-right text-slate-900">
                  {formatarMoeda(valorSolicitadoTotal)}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Valor liberado
                </span>

                <strong className="text-right text-slate-900">
                  {formatarMoeda(valorLiberadoTotal)}
                </strong>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}