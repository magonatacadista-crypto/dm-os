import { notFound } from "next/navigation";

import { prisma } from "../../../../lib/prisma";
import BancoForm from "./BancoForm";

type EditarBancoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarBancoPage({
  params,
}: EditarBancoPageProps) {
  const { id } = await params;
  const bancoId = Number(id);

  if (!Number.isInteger(bancoId) || bancoId <= 0) {
    notFound();
  }

  const banco = await prisma.banco.findUnique({
    where: {
      id: bancoId,
    },
    select: {
      id: true,
      nome: true,
      codigo: true,
      ativo: true,
    },
  });

  if (!banco) {
    notFound();
  }

  return <BancoForm banco={banco} />;
}