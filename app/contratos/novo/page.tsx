import Link from "next/link";
import { notFound } from "next/navigation";

import Sidebar from "../../components/layout/Sidebar";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";

import { prisma } from "../../lib/prisma";
import { criarContrato } from "../actions";

type Props = {
  searchParams: Promise<{
    propostaId?: string;
  }>;
};

export default async function NovoContratoPage({
  searchParams,
}: Props) {
  const { propostaId } = await searchParams;
  const id = Number(propostaId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const proposta = await prisma.proposta.findUnique({
    where: {
      id,
    },

    include: {
      lead: true,
      banco: true,
      convenio: true,
      produto: true,
      vendedor: true,

      contratos: {
        select: {
          id: true,
        },
        take: 1,
      },
    },
  });

  if (!proposta) {
    notFound();
  }

  if (
    proposta.status !== "APROVADA" &&
    proposta.status !== "PAGA"
  ) {
    throw new Error(
      "Somente propostas aprovadas ou pagas podem gerar contrato.",
    );
  }

  if (proposta.contratos.length > 0) {
    throw new Error(
      "Esta proposta já possui contrato vinculado.",
    );
  }
  const salvarContrato =
  criarContrato.bind(null, proposta.id);

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-4 bg-slate-100 p-4 lg:p-6">
        <PageHeader
          title="Novo Contrato"
          subtitle={`Gerar contrato a partir da Proposta #${proposta.id}`}
        />

        <Card>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">
              Dados da Proposta
            </h2>

            <p className="text-xs text-slate-500">
              As informações abaixo foram carregadas automaticamente.
            </p>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            <Info
              label="Cliente"
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
                  : "-"
              }
            />

            <Info
              label="Parcela"
              value={formatarMoeda(
                proposta.valorParcela,
              )}
            />
          </div>
        </Card>

        <Card>
          <form action={salvarContrato}>
            <input
              type="hidden"
              name="propostaId"
              value={proposta.id}
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Input
                label="Número do contrato"
                name="numero"
                placeholder="Número informado pelo banco"
              />

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
                  defaultValue="RASCUNHO"
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="RASCUNHO">
                    Rascunho
                  </option>

                  <option value="DIGITADO">
                    Digitado
                  </option>

                  <option value="EM_ANALISE">
                    Em análise
                  </option>

                  <option value="APROVADO">
                    Aprovado
                  </option>

                  <option value="PAGO">
                    Pago
                  </option>

                  <option value="CANCELADO">
                    Cancelado
                  </option>
                </select>
              </div>

              <Input
                label="Valor contratado"
                name="valorContratado"
                defaultValue={String(
                  proposta.valorAprovado ?? 0,
                )}
                inputMode="decimal"
              />

              <Input
                label="Valor liberado"
                name="valorLiberado"
                defaultValue="0"
                inputMode="decimal"
              />

              <Input
                label="Prazo"
                name="prazo"
                type="number"
                min="0"
                defaultValue={
                  proposta.prazo ?? ""
                }
              />

              <Input
                label="Valor da parcela"
                name="valorParcela"
                defaultValue={String(
                  proposta.valorParcela ?? 0,
                )}
                inputMode="decimal"
              />

              <Input
                label="Taxa"
                name="taxa"
                defaultValue={String(
                  proposta.taxa ?? 0,
                )}
                inputMode="decimal"
              />

              <Input
                label="Data de digitação"
                name="dataDigitacao"
                type="date"
              />

              <Input
                label="Data de aprovação"
                name="dataAprovacao"
                type="date"
              />

              <Input
                label="Data de pagamento"
                name="dataPagamento"
                type="date"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="observacoes"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Observações
              </label>

              <textarea
                id="observacoes"
                name="observacoes"
                className="min-h-28 w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Informações relevantes sobre o contrato..."
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Link
                href={`/propostas/${proposta.id}`}
                className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <Button type="submit">
                Salvar Contrato
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}

function formatarMoeda(valor: unknown) {
  const numero = Number(valor);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(numero) ? numero : 0);
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