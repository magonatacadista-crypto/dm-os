import Link from "next/link";
import { notFound } from "next/navigation";

import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { prisma } from "../../lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LeadPage({ params }: Props) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      vendedor: true,
    },
  });

  if (!lead) {
    notFound();
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 space-y-6 bg-slate-100 p-10">
        <PageHeader
          title={lead.nome}
          subtitle="Ficha completa do Lead"
        />

        <Card>
          <h2 className="mb-4 text-xl font-semibold">
            Dados Pessoais
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Info label="Nome" value={lead.nome} />
            <Info label="CPF" value={lead.cpf} />
            <Info label="Telefone" value={lead.telefone} />
            <Info label="WhatsApp" value={lead.whatsapp} />
            <Info label="E-mail" value={lead.email} />
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold">
            Dados Comerciais
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Info label="Origem" value={lead.origem} />
            <Info label="Banco" value={lead.banco} />
            <Info label="Convênio" value={lead.convenio} />
            <Info label="Produto" value={lead.produto} />
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold">
            Valores
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Info
              label="Valor solicitado"
              value={`R$ ${Number(lead.valorSolicitado ?? 0).toFixed(2)}`}
            />

            <Info
              label="Valor liberado"
              value={`R$ ${Number(lead.valorLiberado ?? 0).toFixed(2)}`}
            />
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold">
            Gestão
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Info label="Status" value={lead.status} />
            <Info
              label="Vendedor"
              value={lead.vendedor?.nome ?? "Não atribuído"}
            />
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold">
            Observações
          </h2>

          <p className="whitespace-pre-wrap text-slate-700">
            {lead.observacoes || "Nenhuma observação cadastrada."}
          </p>
        </Card>

        <div className="flex gap-3">
          <Link href="/leads">
            <Button variant="secondary">
              Voltar
            </Button>
          </Link>

          <Link href={`/leads/${lead.id}/editar`}>
  <Button>
    Editar Lead
  </Button>
</Link>
        </div>
      </main>
    </div>
  );
}

type InfoProps = {
  label: string;
  value: string | number | null | undefined;
};

function Info({ label, value }: InfoProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value || "-"}
      </p>
    </div>
  );
}