import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "../../../components/layout/Sidebar";
import VendedorForm from "../../../components/vendedores/VendedorForm";
import { prisma } from "../../../lib/prisma";

type EditarVendedorPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatarDataParaInput(data: Date | null) {
  if (!data) {
    return "";
  }

  return data.toISOString().split("T")[0];
}

export default async function EditarVendedorPage({
  params,
}: EditarVendedorPageProps) {
  const { id } = await params;
  const vendedorId = Number(id);

  if (!Number.isInteger(vendedorId) || vendedorId <= 0) {
    notFound();
  }

  const vendedor = await prisma.vendedor.findUnique({
    where: {
      id: vendedorId,
    },
  });

  if (!vendedor) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden bg-slate-100 p-6 lg:p-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Editar Vendedor</h1>

            <p className="mt-2 text-gray-600">
              Atualize os dados cadastrais e comerciais do vendedor.
            </p>
          </div>

          <Link
            href="/vendedores"
            className="w-fit rounded-lg border border-gray-300 bg-white px-5 py-3 hover:bg-gray-50"
          >
            Voltar
          </Link>
        </div>

        <VendedorForm
          modo="editar"
          vendedorId={vendedor.id}
          dadosIniciais={{
            nome: vendedor.nome,
            cpf: vendedor.cpf,
            rg: vendedor.rg ?? "",
            dataNascimento: formatarDataParaInput(
              vendedor.dataNascimento
            ),
            telefone: vendedor.telefone,
            whatsapp: vendedor.whatsapp ?? "",
            email: vendedor.email ?? "",
            matricula: vendedor.matricula ?? "",
            cargo: vendedor.cargo,
            dataAdmissao: formatarDataParaInput(
              vendedor.dataAdmissao
            ),
            situacao: vendedor.situacao,
            metaMensal: vendedor.metaMensal.toString(),
            metaContratos: vendedor.metaContratos.toString(),
            comissaoPadrao: vendedor.comissaoPadrao.toString(),
            observacoes: vendedor.observacoes ?? "",
          }}
        />
      </main>
    </div>
  );
}