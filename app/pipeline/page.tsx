import Link from "next/link";

import Sidebar from "../components/layout/Sidebar";
import PageHeader from "../components/ui/PageHeader";

import { prisma } from "../lib/prisma";
import PipelineBoard from "./PipelineBoard";

const etapas = [
  {
    status: "NOVO",
    titulo: "Novo",
    variante: "info" as const,
  },
  {
    status: "PRIMEIRO_CONTATO",
    titulo: "Primeiro contato",
    variante: "warning" as const,
  },
  {
    status: "DOCUMENTACAO",
    titulo: "Documentação",
    variante: "warning" as const,
  },
  {
    status: "DIGITACAO",
    titulo: "Digitação",
    variante: "info" as const,
  },
  {
    status: "EM_ANALISE",
    titulo: "Em análise",
    variante: "info" as const,
  },
  {
    status: "APROVADO",
    titulo: "Aprovado",
    variante: "success" as const,
  },
  {
    status: "PAGO",
    titulo: "Pago",
    variante: "success" as const,
  },
  {
    status: "PERDIDO",
    titulo: "Perdido",
    variante: "danger" as const,
  },
];

export default async function PipelinePage() {
  const leads = await prisma.lead.findMany({
    orderBy: {
      atualizadoEm: "desc",
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

  const leadsPipeline = leads.map((lead) => ({
    id: lead.id,
    nome: lead.nome,
    telefone: lead.telefone,
    status: lead.status,
    valorSolicitado: Number(lead.valorSolicitado ?? 0),

    banco:
      lead.bancoCadastro?.nome ??
      lead.banco ??
      null,

    convenio:
      lead.convenioCadastro?.nome ??
      lead.convenio ??
      null,

    vendedor:
      lead.vendedor?.nome ??
      null,
  }));

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 bg-slate-100 p-6 lg:p-10">
        <PageHeader
          title="Pipeline Comercial"
          subtitle="Arraste os Leads entre as etapas do funil."
          action={
            <Link
              href="/leads/novo"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              + Novo Lead
            </Link>
          }
        />

        <div className="mt-6">
          <PipelineBoard
            leads={leadsPipeline}
            etapas={etapas}
          />
        </div>
      </main>
    </div>
  );
}