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

function formatarMoeda(valor: unknown) {
  const numero = Number(valor);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(numero) ? numero : 0);
}

function formatarData(data: Date | null) {
  if (!data) {
    return "-";
  }

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

    case "DIGITADO":
      return {
        texto: "Digitado",
        variante: "info" as const,
      };

    case "EM_ANALISE":
      return {
        texto: "Em análise",
        variante: "warning" as const,
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

    case "CANCELADO":
      return {
        texto: "Cancelado",
        variante: "danger" as const,
      };

    default:
      return {
        texto: status,
        variante: "default" as const,
      };
  }
}

export default async function ContratosPage() {
  const contratos = await prisma.contrato.findMany({
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

      proposta: {
        select: {
          id: true,
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
  });

  const totalContratos = contratos.length;

  const emAnalise = contratos.filter(
    (contrato) => contrato.status === "EM_ANALISE",
  ).length;

  const aprovados = contratos.filter(
    (contrato) =>
      contrato.status === "APROVADO" ||
      contrato.status === "PAGO",
  ).length;

  const valorLiberadoTotal = contratos.reduce(
    (total, contrato) =>
      total + Number(contrato.valorLiberado ?? 0),
    0,
  );

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-4 bg-slate-100 p-4 lg:p-6">
        <PageHeader
          title="Contratos"
          subtitle="Acompanhe os contratos gerados a partir das propostas."
        />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <p className="text-xs font-medium text-slate-500">
              Total de contratos
            </p>

            <div className="mt-2 flex items-center justify-between">
              <strong className="text-2xl text-slate-900">
                {totalContratos}
              </strong>

              <Badge variant="info">Carteira</Badge>
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

              <Badge variant="warning">Aguardando</Badge>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-medium text-slate-500">
              Aprovados ou pagos
            </p>

            <div className="mt-2 flex items-center justify-between">
              <strong className="text-2xl text-slate-900">
                {aprovados}
              </strong>

              <Badge variant="success">Convertidos</Badge>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-medium text-slate-500">
              Valor liberado
            </p>

            <div className="mt-2 flex items-center justify-between gap-2">
              <strong className="text-xl text-slate-900">
                {formatarMoeda(valorLiberadoTotal)}
              </strong>

              <Badge>Produção</Badge>
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-3">
            <h2 className="text-base font-semibold text-slate-900">
              Lista de contratos
            </h2>

            <p className="text-xs text-slate-500">
              Contratos ordenados do mais recente para o mais antigo.
            </p>
          </div>

          {contratos.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
              Nenhum contrato cadastrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Proposta</TableHead>
                  <TableHead>Banco</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contratado</TableHead>
                  <TableHead>Liberado</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {contratos.map((contrato) => {
                  const status = obterStatus(contrato.status);

                  return (
                    <TableRow key={contrato.id}>
                      <TableCell className="font-medium text-slate-900">
                        {contrato.numero ?? `#${contrato.id}`}
                      </TableCell>

                      <TableCell>
                        <Link
                          href={`/leads/${contrato.lead.id}`}
                          className="font-medium text-slate-800 hover:text-blue-600"
                        >
                          {contrato.lead.nome}
                        </Link>
                      </TableCell>

                      <TableCell>
                        <Link
                          href={`/propostas/${contrato.proposta.id}`}
                          className="text-slate-700 hover:text-blue-600"
                        >
                          #{contrato.proposta.id}
                        </Link>
                      </TableCell>

                      <TableCell>
                        {contrato.banco?.nome ?? "Não informado"}
                      </TableCell>

                      <TableCell>
                        {contrato.produto?.nome ?? "Não informado"}
                      </TableCell>

                      <TableCell>
                        {contrato.vendedor?.nome ?? "Não atribuído"}
                      </TableCell>

                      <TableCell>
                        <Badge variant={status.variante}>
                          {status.texto}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {formatarMoeda(contrato.valorContratado)}
                      </TableCell>

                      <TableCell>
                        {formatarMoeda(contrato.valorLiberado)}
                      </TableCell>

                      <TableCell>
                        {formatarData(contrato.dataPagamento)}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link
                          href={`/contratos/${contrato.id}`}
                          className="inline-flex h-8 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Abrir
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