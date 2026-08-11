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

export default async function ContratoPage({
  params,
}: Props) {
  const { id } = await params;
  const contratoId = Number(id);

  if (
    !Number.isInteger(contratoId) ||
    contratoId <= 0
  ) {
    notFound();
  }

  const contrato = await prisma.contrato.findUnique({
    where: {
      id: contratoId,
    },

    include: {
      lead: true,
      proposta: true,
      banco: true,
      convenio: true,
      produto: true,
      vendedor: true,
    },
  });

  if (!contrato) {
    notFound();
  }

  const status = obterStatus(contrato.status);

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-4 bg-slate-100 p-4 lg:p-6">
        <PageHeader
          title={
            contrato.numero
              ? `Contrato ${contrato.numero}`
              : `Contrato #${contrato.id}`
          }
          subtitle={`Lead: ${contrato.lead.nome}`}
        />

        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Resumo do Contrato
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
              label="Cliente"
              value={contrato.lead.nome}
            />

            <Info
              label="Proposta"
              value={`#${contrato.proposta.id}`}
            />

            <Info
              label="Banco"
              value={contrato.banco?.nome}
            />

            <Info
              label="Convênio"
              value={contrato.convenio?.nome}
            />

            <Info
              label="Produto"
              value={contrato.produto?.nome}
            />

            <Info
              label="Vendedor"
              value={
                contrato.vendedor?.nome ??
                "Não atribuído"
              }
            />

            <Info
              label="Valor contratado"
              value={formatarMoeda(
                contrato.valorContratado,
              )}
            />

            <Info
              label="Valor liberado"
              value={formatarMoeda(
                contrato.valorLiberado,
              )}
            />

            <Info
              label="Prazo"
              value={
                contrato.prazo
                  ? `${contrato.prazo} meses`
                  : null
              }
            />

            <Info
              label="Parcela"
              value={formatarMoeda(
                contrato.valorParcela,
              )}
            />

            <Info
              label="Taxa"
              value={
                contrato.taxa
                  ? `${Number(
                      contrato.taxa,
                    ).toFixed(2)}%`
                  : null
              }
            />

            <Info
              label="Data de digitação"
              value={formatarData(
                contrato.dataDigitacao,
              )}
            />

            <Info
              label="Data de aprovação"
              value={formatarData(
                contrato.dataAprovacao,
              )}
            />

            <Info
              label="Data de pagamento"
              value={formatarData(
                contrato.dataPagamento,
              )}
            />
          </div>
        </Card>

        <Card>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">
            Observações
          </h2>

          <p className="whitespace-pre-wrap text-sm text-slate-600">
            {contrato.observacoes ||
              "Nenhuma observação cadastrada."}
          </p>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Link href="/contratos">
            <Button variant="secondary">
              Voltar aos Contratos
            </Button>
          </Link>

          <Link
            href={`/propostas/${contrato.propostaId}`}
          >
            <Button variant="secondary">
              Abrir Proposta
            </Button>            
          </Link>
          <Link
  href={`/contratos/${contrato.id}/editar`}
>
  <Button>
    Editar Contrato
  </Button>
</Link>

          <Link
            href={`/leads/${contrato.leadId}`}
          >
            <Button variant="secondary">
              Abrir Lead
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