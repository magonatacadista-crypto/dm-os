import Link from "next/link";
import { notFound } from "next/navigation";

import Sidebar from "../../../components/layout/Sidebar";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import PageHeader from "../../../components/ui/PageHeader";

import { prisma } from "../../../lib/prisma";
import { criarAtendimento } from "./actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NovoAtendimentoPage({
  params,
}: Props) {
  const { id } = await params;
  const leadId = Number(id);

  if (!Number.isInteger(leadId) || leadId <= 0) {
    notFound();
  }

  const lead = await prisma.lead.findUnique({
    where: {
      id: leadId,
    },
    select: {
      id: true,
      nome: true,
      telefone: true,
      proximoContato: true,
    },
  });

  if (!lead) {
    notFound();
  }

  const salvarAtendimento =
    criarAtendimento.bind(null, lead.id);

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 space-y-6 bg-slate-100 p-10">
        <PageHeader
          title="Novo Atendimento"
          subtitle={`Registre o atendimento de ${lead.nome}.`}
        />

        <Card>
          <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Cliente
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {lead.nome}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {lead.telefone}
            </p>
          </div>

          <form
            action={salvarAtendimento}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="tipo"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Tipo de atendimento
              </label>

              <select
                id="tipo"
                name="tipo"
                defaultValue=""
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="" disabled>
                  Selecione o tipo
                </option>

                <option value="LIGACAO">
                  Ligação
                </option>

                <option value="WHATSAPP">
                  WhatsApp
                </option>

                <option value="EMAIL">
                  E-mail
                </option>

                <option value="PRESENCIAL">
                  Presencial
                </option>

                <option value="DOCUMENTACAO">
                  Documentação
                </option>

                <option value="DIGITACAO">
                  Digitação
                </option>

                <option value="ANALISE">
                  Análise
                </option>

                <option value="CONTRATO_PAGO">
                  Contrato pago
                </option>

                <option value="LEAD_PERDIDO">
                  Lead perdido
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="descricao"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Descrição do atendimento
              </label>

              <textarea
                id="descricao"
                name="descricao"
                required
                className="min-h-40 w-full rounded-lg border border-slate-300 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Descreva o que aconteceu no atendimento..."
              />
            </div>

            <div>
              <label
                htmlFor="proximoContato"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Próximo contato — data e hora
              </label>

              <input
                id="proximoContato"
                name="proximoContato"
                type="datetime-local"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-sm text-slate-500">
                Deixe em branco quando não houver retorno agendado.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Link
                href={`/leads/${lead.id}`}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <Button type="submit">
                Salvar Atendimento
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}