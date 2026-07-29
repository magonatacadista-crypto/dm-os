import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "../../../components/layout/Sidebar";
import ClienteForm from "../../../components/clientes/ClienteForm";
import { prisma } from "../../../lib/prisma";

type EditarClientePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarClientePage({
  params,
}: EditarClientePageProps) {
  const { id } = await params;
  const clienteId = Number(id);

  if (!Number.isInteger(clienteId) || clienteId <= 0) {
    notFound();
  }

  const cliente = await prisma.cliente.findUnique({
    where: {
      id: clienteId,
    },
  });

  if (!cliente) {
    notFound();
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen min-w-0 flex-1 overflow-hidden bg-slate-100 p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Editar Cliente</h1>

            <p className="mt-2 text-gray-600">
              Atualize os dados cadastrais do cliente.
            </p>
          </div>

          <Link
            href="/clientes"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 hover:bg-gray-50"
          >
            Voltar
          </Link>
        </div>

        <ClienteForm
          modo="editar"
          clienteId={cliente.id}
          dadosIniciais={{
            nome: cliente.nome,
            cpf: cliente.cpf,
            telefone: cliente.telefone,
            email: cliente.email ?? "",
          }}
        />
      </main>
    </div>
  );
}