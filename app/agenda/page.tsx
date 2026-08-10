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

function formatarDataHora(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

function obterSituacaoContato(
  proximoContato: Date,
  inicioHoje: Date,
  fimHoje: Date,
) {
  if (proximoContato < inicioHoje) {
    return {
      texto: "Atrasado",
      variante: "danger" as const,
    };
  }

  if (
    proximoContato >= inicioHoje &&
    proximoContato <= fimHoje
  ) {
    return {
      texto: "Hoje",
      variante: "warning" as const,
    };
  }

  return {
    texto: "Futuro",
    variante: "success" as const,
  };
}

export default async function AgendaPage() {
  const agora = new Date();

  const inicioHoje = new Date(agora);
  inicioHoje.setHours(0, 0, 0, 0);

  const fimHoje = new Date(agora);
  fimHoje.setHours(23, 59, 59, 999);

  const contatos = await prisma.lead.findMany({
    where: {
      proximoContato: {
        not: null,
      },
      status: {
        notIn: ["PAGO", "PERDIDO"],
      },
    },
    orderBy: {
      proximoContato: "asc",
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

  const contatosHoje = contatos.filter(
    (lead) =>
      lead.proximoContato &&
      lead.proximoContato >= inicioHoje &&
      lead.proximoContato <= fimHoje,
  ).length;

  const contatosAtrasados = contatos.filter(
    (lead) =>
      lead.proximoContato &&
      lead.proximoContato < inicioHoje,
  ).length;

  const contatosFuturos = contatos.filter(
    (lead) =>
      lead.proximoContato &&
      lead.proximoContato > fimHoje,
  ).length;

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-6 bg-slate-100 p-6 lg:p-10">
        <PageHeader
          title="Agenda Comercial"
          subtitle="Acompanhe os próximos contatos dos clientes."
          action={
            <Link
              href="/leads/novo"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              + Novo Lead
            </Link>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm font-medium text-slate-500">
              Contatos de hoje
            </p>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-3xl font-bold text-slate-900">
                {contatosHoje}
              </p>

              <Badge variant="warning">Hoje</Badge>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Contatos atrasados
            </p>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-3xl font-bold text-red-600">
                {contatosAtrasados}
              </p>

              <Badge variant="danger">Atenção</Badge>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-medium text-slate-500">
              Próximos contatos
            </p>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-3xl font-bold text-blue-600">
                {contatosFuturos}
              </p>

              <Badge variant="success">Futuros</Badge>
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Contatos agendados
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Leads ordenados pela data do próximo contato.
            </p>
          </div>

          {contatos.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              Nenhum contato agendado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Data e hora</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Status do Lead</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Banco</TableHead>
                  <TableHead>Convênio</TableHead>
                  <TableHead className="text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {contatos.map((lead) => {
                  if (!lead.proximoContato) {
                    return null;
                  }

                  const situacaoContato =
                    obterSituacaoContato(
                      lead.proximoContato,
                      inicioHoje,
                      fimHoje,
                    );

                  const statusLead = obterStatus(lead.status);

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
                      <TableCell className="font-medium text-slate-900">
                        {lead.nome}
                      </TableCell>

                      <TableCell>{lead.telefone}</TableCell>

                      <TableCell>
                        {formatarDataHora(
                          lead.proximoContato,
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={situacaoContato.variante}
                        >
                          {situacaoContato.texto}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant={statusLead.variante}>
                          {statusLead.texto}
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

                      <TableCell className="text-right">
  <div className="flex justify-end gap-2">
    <Link
      href={`/leads/${lead.id}`}
      className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      Visualizar
    </Link>

    <Link
      href={`/leads/${lead.id}/atendimento`}
      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      Atender
    </Link>
  </div>
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