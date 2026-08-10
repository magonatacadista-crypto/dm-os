import Link from "next/link";
import { notFound } from "next/navigation";

import Sidebar from "../../components/layout/Sidebar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";

import { prisma } from "../../lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatarMoeda(valor: unknown) {
  const numero = Number(valor);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(numero) ? numero : 0);
}

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
    case "APROVADA":
      return {
        texto: "Aprovada",
        variante: "success" as const,
      };

    case "PAGA":
      return {
        texto: "Paga",
        variante: "success" as const,
      };

    case "REPROVADA":
      return {
        texto: "Reprovada",
        variante: "danger" as const,
      };

    case "CANCELADA":
      return {
        texto: "Cancelada",
        variante: "danger" as const,
      };

    case "EM_ANALISE":
      return {
        texto: "Em análise",
        variante: "warning" as const,
      };

    case "RASCUNHO":
    default:
      return {
        texto: "Rascunho",
        variante: "default" as const,
      };
  }
}

export default async function PropostaPage({
  params,
}: Props) {
  const { id } = await params;
  const propostaId = Number(id);

  if (
    !Number.isInteger(propostaId) ||
    propostaId <= 0
  ) {
    notFound();
  }

  const proposta =
    await prisma.proposta.findUnique({
      where: {
        id: propostaId,
      },

      include: {
        lead: true,
        banco: true,
        convenio: true,
        produto: true,
        vendedor: true,
      },
    });

  if (!proposta) {
    notFound();
  }

  const status = obterStatus(
    proposta.status,
  );

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-4 bg-slate-100 p-4 lg:p-6">
        <PageHeader
          title={`Proposta #${proposta.id}`}
          subtitle={`Lead: ${proposta.lead.nome}`}
        />

        <Card>
          <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Resumo da Proposta
              </h2>

              <p className="text-xs text-slate-500">
                Dados principais da operação.
              </p>
            </div>

            <Badge variant={status.variante}>
              {status.texto}
            </Badge>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Info
              label="Lead"
              value={proposta.lead.nome}
            />

            <Info
              label="Banco"
              value={proposta.banco?.nome}
            />

            <Info
              label="Convênio"
              value={proposta.convenio?.nome}
            />

            <Info
              label="Produto"
              value={proposta.produto?.nome}
            />

            <Info
              label="Vendedor"
              value={
                proposta.vendedor?.nome ??
                "Não atribuído"
              }
            />

            <Info
              label="Valor solicitado"
              value={formatarMoeda(
                proposta.valorSolicitado,
              )}
            />

            <Info
              label="Valor aprovado"
              value={formatarMoeda(
                proposta.valorAprovado,
              )}
            />

            <Info
              label="Prazo"
              value={
                proposta.prazo
                  ? `${proposta.prazo} meses`
                  : null
              }
            />

            <Info
              label="Parcela"
              value={formatarMoeda(
                proposta.valorParcela,
              )}
            />

            <Info
              label="Taxa"
              value={
                proposta.taxa
                  ? `${Number(
                      proposta.taxa,
                    ).toFixed(2)}%`
                  : null
              }
            />

            <Info
              label="Criada em"
              value={formatarDataHora(
                proposta.criadoEm,
              )}
            />

            <Info
              label="Atualizada em"
              value={formatarDataHora(
                proposta.atualizadoEm,
              )}
            />
          </div>
        </Card>

        <Card>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">
            Observações
          </h2>

          <p className="whitespace-pre-wrap text-sm text-slate-600">
            {proposta.observacoes ||
              "Nenhuma observação cadastrada."}
          </p>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/leads/${proposta.leadId}`}
          >
            <Button variant="secondary">
              Voltar ao Lead
            </Button>
          </Link>

          <Link
            href={`/propostas/${proposta.id}/editar`}
          >
            <Button>
              Editar Proposta
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

type InfoProps = {
  label: string;
  value:
    | string
    | number
    | null
    | undefined;
};

function Info({
  label,
  value,
}: InfoProps) {
  const valorExibido =
    value === null ||
    value === undefined ||
    value === ""
      ? "-"
      : value;

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[11px] text-slate-500">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-medium text-slate-900">
        {valorExibido}
      </p>
    </div>
  );
}