import Link from "next/link";
import { notFound } from "next/navigation";

import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";

import { prisma } from "../../lib/prisma";

type ClientePageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatarData(
  data: Date | null,
) {
  if (!data) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  ).format(data);
}

export default async function ClientePage({
  params,
}: ClientePageProps) {
  const { id } = await params;

  const clienteId = Number(id);

  if (
    !Number.isInteger(clienteId) ||
    clienteId <= 0
  ) {
    notFound();
  }

  const cliente =
  await prisma.cliente.findUnique({
    where: {
      id: clienteId,
    },

    include: {
      lead: {
        select: {
          id: true,
          nome: true,
          status: true,
        },
      },
    },
  });

  if (!cliente) {
    notFound();
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 space-y-4 bg-slate-100 p-4 lg:p-6">
        <PageHeader
          title={cliente.nome}
          subtitle="Dados cadastrais do cliente."
          action={
            <Link
              href={`/clientes/${cliente.id}/editar`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Editar Cliente
            </Link>
          }
        />

        <Card>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">
              Dados do Cliente
            </h2>

            <p className="text-xs text-slate-500">
              Informações principais do cadastro.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">
                Nome
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {cliente.nome}
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">
                CPF
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {cliente.cpf || "-"}
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">
                Telefone
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {cliente.telefone || "-"}
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">
                E-mail
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {cliente.email || "-"}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
  <p className="text-xs text-slate-500">
    CEP
  </p>

  <p className="mt-1 font-medium text-slate-900">
    {cliente.cep || "-"}
  </p>
</div>

<div className="rounded-md border border-slate-200 bg-slate-50 p-3">
  <p className="text-xs text-slate-500">
    Logradouro
  </p>

  <p className="mt-1 font-medium text-slate-900">
    {cliente.logradouro || "-"}
  </p>
</div>

<div className="rounded-md border border-slate-200 bg-slate-50 p-3">
  <p className="text-xs text-slate-500">
    Número
  </p>

  <p className="mt-1 font-medium text-slate-900">
    {cliente.numero || "-"}
  </p>
</div>

<div className="rounded-md border border-slate-200 bg-slate-50 p-3">
  <p className="text-xs text-slate-500">
    Complemento
  </p>

  <p className="mt-1 font-medium text-slate-900">
    {cliente.complemento || "-"}
  </p>
</div>

<div className="rounded-md border border-slate-200 bg-slate-50 p-3">
  <p className="text-xs text-slate-500">
    Bairro
  </p>

  <p className="mt-1 font-medium text-slate-900">
    {cliente.bairro || "-"}
  </p>
</div>

<div className="rounded-md border border-slate-200 bg-slate-50 p-3">
  <p className="text-xs text-slate-500">
    Cidade
  </p>

  <p className="mt-1 font-medium text-slate-900">
    {cliente.cidade || "-"}
  </p>
</div>

<div className="rounded-md border border-slate-200 bg-slate-50 p-3">
  <p className="text-xs text-slate-500">
    Estado
  </p>

  <p className="mt-1 font-medium text-slate-900">
    {cliente.estado || "-"}
  </p>
</div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">
                Cadastro
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {formatarData(
                  cliente.criadoEm,
                )}
              </p>
            </div>

   
          </div>
        </Card>

        <Card>
  <div className="mb-4">
    <h2 className="text-base font-semibold text-slate-900">
      Relacionamento Comercial
    </h2>

    <p className="text-xs text-slate-500">
      Acesso ao Lead e às operações comerciais deste cliente.
    </p>
  </div>

  {cliente.lead ? (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-500">
            Lead vinculado
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {cliente.lead.nome}
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-500">
            Status do Lead
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {cliente.lead.status}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/leads/${cliente.lead.id}`}
          className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Abrir Lead
        </Link>

        <Link
          href={`/propostas/novo?leadId=${cliente.lead.id}`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Nova Proposta
        </Link>
      </div>
    </div>
  ) : (
    <div className="rounded-lg border border-dashed border-slate-300 p-6">
      <p className="text-sm font-medium text-slate-700">
        Este cliente ainda não possui Lead vinculado.
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Crie ou vincule um Lead para permitir propostas, contratos e histórico comercial.
      </p>

      <div className="mt-4">
        <Link
          href={`/leads/novo?clienteId=${cliente.id}`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Criar Lead para este Cliente
        </Link>
      </div>
    </div>
  )}
</Card>

<div className="flex flex-wrap gap-2">
  <Link
    href="/clientes"
    className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
  >
    Voltar para Clientes
  </Link>

  <Link
    href={`/clientes/${cliente.id}/editar`}
    className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
  >
    Editar Cliente
  </Link>
</div>
      </main>
    </div>
  );
}