import Link from "next/link";
import { notFound } from "next/navigation";

import Sidebar from "../../../components/layout/Sidebar";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import PageHeader from "../../../components/ui/PageHeader";

import { prisma } from "../../../lib/prisma";
import { editarContrato } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatarDataInput(data: Date | null) {
  if (!data) {
    return "";
  }

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export default async function EditarContratoPage({
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
      lead: {
        select: {
          nome: true,
        },
      },

      proposta: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!contrato) {
    notFound();
  }

  const salvarContrato =
    editarContrato.bind(null, contrato.id);

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-4 bg-slate-100 p-4 lg:p-6">
        <PageHeader
          title={`Editar Contrato ${
            contrato.numero ?? `#${contrato.id}`
          }`}
          subtitle={`Lead: ${contrato.lead.nome} • Proposta #${contrato.proposta.id}`}
        />

        <Card>
          <form action={salvarContrato}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Input
                label="Número do contrato"
                name="numero"
                defaultValue={contrato.numero ?? ""}
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
                  defaultValue={contrato.status}
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
                  contrato.valorContratado ?? 0,
                )}
                inputMode="decimal"
              />

              <Input
                label="Valor liberado"
                name="valorLiberado"
                defaultValue={String(
                  contrato.valorLiberado ?? 0,
                )}
                inputMode="decimal"
              />

              <Input
                label="Prazo"
                name="prazo"
                type="number"
                min="0"
                defaultValue={contrato.prazo ?? ""}
              />

              <Input
                label="Valor da parcela"
                name="valorParcela"
                defaultValue={String(
                  contrato.valorParcela ?? 0,
                )}
                inputMode="decimal"
              />

              <Input
                label="Taxa"
                name="taxa"
                defaultValue={String(
                  contrato.taxa ?? 0,
                )}
                inputMode="decimal"
              />

              <Input
                label="Data de digitação"
                name="dataDigitacao"
                type="date"
                defaultValue={formatarDataInput(
                  contrato.dataDigitacao,
                )}
              />

              <Input
                label="Data de aprovação"
                name="dataAprovacao"
                type="date"
                defaultValue={formatarDataInput(
                  contrato.dataAprovacao,
                )}
              />

              <Input
                label="Data de pagamento"
                name="dataPagamento"
                type="date"
                defaultValue={formatarDataInput(
                  contrato.dataPagamento,
                )}
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
                defaultValue={contrato.observacoes ?? ""}
                className="min-h-28 w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Link
                href={`/contratos/${contrato.id}`}
                className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}