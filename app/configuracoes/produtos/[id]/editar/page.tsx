import { notFound } from "next/navigation";

import Sidebar from "../../../../components/layout/Sidebar";
import PageHeader from "../../../../components/ui/PageHeader";
import { prisma } from "../../../../lib/prisma";

import EditarProdutoForm from "./EditarProdutoForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditarProdutoPage({
  params,
}: Props) {
  const { id } = await params;

  const produtoId = Number(id);

  if (
    !Number.isInteger(produtoId) ||
    produtoId <= 0
  ) {
    notFound();
  }

  const produto =
    await prisma.produto.findUnique({
      where: {
        id: produtoId,
      },

      select: {
        id: true,
        nome: true,
        codigo: true,
        ativo: true,
        comissaoPercentual: true,
      },
    });

  if (!produto) {
    notFound();
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen flex-1 bg-slate-100 p-10">
        <PageHeader
          title="Editar Produto"
          subtitle="Atualize os dados e a comissão do produto."
        />

        <EditarProdutoForm
          produto={{
            id: produto.id,
            nome: produto.nome,
            codigo: produto.codigo,
            ativo: produto.ativo,
            comissaoPercentual:
              produto.comissaoPercentual.toString(),
          }}
        />
      </main>
    </div>
  );
}