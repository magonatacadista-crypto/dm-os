"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "../lib/prisma";

export async function marcarComissaoComoPaga(
  contratoId: number,
) {
  if (
    !Number.isInteger(contratoId) ||
    contratoId <= 0
  ) {
    throw new Error(
      "Contrato inválido.",
    );
  }

  const contrato =
    await prisma.contrato.findUnique({
      where: {
        id: contratoId,
      },

      select: {
        id: true,
        status: true,
        comissaoPaga: true,
      },
    });

  if (!contrato) {
    throw new Error(
      "Contrato não encontrado.",
    );
  }

  if (contrato.status !== "PAGO") {
    throw new Error(
      "A comissão só pode ser paga para contratos com status PAGO.",
    );
  }

  if (contrato.comissaoPaga) {
    return;
  }

  await prisma.contrato.update({
    where: {
      id: contratoId,
    },

    data: {
      comissaoPaga: true,
      dataComissaoPaga: new Date(),
    },
  });

  revalidatePath("/comissoes");
}

export async function desfazerPagamentoComissao(
  contratoId: number,
) {
  if (
    !Number.isInteger(contratoId) ||
    contratoId <= 0
  ) {
    throw new Error(
      "Contrato inválido.",
    );
  }

  const contrato =
    await prisma.contrato.findUnique({
      where: {
        id: contratoId,
      },

      select: {
        id: true,
        comissaoPaga: true,
      },
    });

  if (!contrato) {
    throw new Error(
      "Contrato não encontrado.",
    );
  }

  if (!contrato.comissaoPaga) {
    return;
  }

  await prisma.contrato.update({
    where: {
      id: contratoId,
    },

    data: {
      comissaoPaga: false,
      dataComissaoPaga: null,
    },
  });

  revalidatePath("/comissoes");
}