import Link from "next/link";

import Sidebar from "../components/layout/Sidebar";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
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

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: {
      id: "desc",
    },
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
  });

  const totalLeads = leads.length;

  const leadsNovos = leads.filter(
    (lead) => lead.status === "NOVO",
  ).length;

  const leadsAprovados = leads.filter(
    (lead) =>
      lead.status === "APROVADO" ||
      lead.status === "PAGO",
  ).length;

  const valorSolicitadoTotal = leads.reduce(
    (total, lead) =>
      total + Number(lead.valorSolicitado ?? 0),
    0,
  );

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-6 bg-slate-100 p-6 lg:p-10">
        <PageHeader
          title="Leads"
          subtitle="Acompanhe as oportunidades comerciais da operação."
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
                {leadsAprovados}
              </strong>

              <Badge variant="success">
                Convertidos
              </Badge>
            </div>
          </Card>

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
        </div>

        <Card>
          {leads.length === 0 ? (
            <EmptyState
              title="Nenhum lead cadastrado"
              description="Cadastre o primeiro lead para iniciar o acompanhamento comercial."
              icon={
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-2xl">
                  🎯
                </div>
              }
              action={
                <Link
                  href="/leads/novo"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                  Novo lead
                </Link>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Banco</TableHead>
                  <TableHead>Convênio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Valor solicitado</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {leads.map((lead) => {
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
                        {lead.nome}
                      </TableCell>

                      <TableCell>
                        {lead.telefone}
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
                        {formatarMoeda(
                          lead.valorSolicitado ?? 0,
                        )}
                      </TableCell>

                      <TableCell>
                        {formatarData(lead.criadoEm)}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Visualizar
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>
    </div>
  );
}